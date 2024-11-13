sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/Spreadsheet",
    "sap/m/ObjectAttribute",
    "sap/ui/model/Sorter",
],
    function (Controller, JSONModel, Spreadsheet, ObjectAttribute, Sorter) {
        "use strict";

        return Controller.extend("imareport23.controller.Homepage", {
             filterArray: [],

             onInit: function () {
            // Initialize filters and data
            this.getView().setModel(new JSONModel(), 'selectedFiltersModel')

            this.osUrl = this.getOwnerComponent().getModel().sServiceUrl;

            this._createFiltersModel()

            this._getDataFilters()

            this.getView().setModel(new JSONModel(), 'DataIMA23')
            let oSelectedFiltersModel = this.getView().getModel('selectedFiltersModel');

            oSelectedFiltersModel.setProperty("/matchData", false);

            this.entityKeys;
            this.contractKeys;
            this.annoKey;
            this.periodoKey;
        },

        createSorter: function() {
            return new Sorter("description", false); // false for ascending order
        },

        _createFiltersModel: function () {
            let oFiltersModel = new JSONModel({
                Entity: null,
                Contratto: null,
                Anno: null,
                Periodo: null,
                Id_storico:null,
                CompanyCode: null
            });
            this.getView().setModel(oFiltersModel, 'oFiltersModel');
        },

        _elaboratedMonths: function (monthNumbers) {
            const mesiItaliani = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

            return monthNumbers
                .map(num => parseInt(num, 10))
                .sort((a, b) => a - b)
                .map(num => ({
                    ID: num.toString().padStart(3, '0'),
                    description: mesiItaliani[num - 1]
                }));
        },

        convertModelStringToNumericValues() {
            var oModel = this.getView().getModel("DataIMA23");
            var aData = oModel.getData();
        
            const numericFields = [
                "DEBIT",
                "CREDIT",
                "DEBIT_CURR",
                "CREDIT_CURR"
            ];
        
            aData = aData.map(item => {
                // Helper function to format number with thousands separator and 2 decimals
                const formatNumber = (num) => {
                    return num.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                };
        
                numericFields.forEach(field => {
                    if (item[field]) {
                        const strValue = String(item[field]);
        
                        // Conversione diretta da stringa a numero senza sostituzioni
                        const numValue = parseFloat(strValue);
        
                        // Verifica se la conversione ha prodotto un numero valido
                        if (!isNaN(numValue)) {
                            // Imposta il valore numerico corretto
                            item[field] = numValue;
                            // Formatta il valore per la visualizzazione
                            item[field + '_DISPLAY'] = formatNumber(numValue);
                        } else {
                            console.warn(`Valore non valido per il campo ${field}:`, strValue);
                        }
                    }
                });
                return item;
            });
        
            oModel.setData(aData);
            oModel.refresh();
        },
        
        
        onTableSort: function(oEvent) {
            const oColumn = oEvent.getParameter("column");
            const sSortProperty = oColumn.getSortProperty();
            const bDescending = oEvent.getParameter("sortOrder") === "Descending";
            
            // Simple sorter since values are already numeric
            const oSorter = new Sorter(sSortProperty, bDescending);
            this.byId("table").getBinding("rows").sort(oSorter);
        },

        _sortEntitiesByDescription: function(entities) {
            return entities.sort((a, b) => a.description.localeCompare(b.description));
        },
        
        _elaborateEntities: function (ids, descriptions) {
            const entities = ids.map((id, index) => ({
                ID: id,
                description: descriptions[index]
            }));
        
            return this._sortEntitiesByDescription(entities);
        },

        _sortStringArray: function(arr) {
            return arr.sort((a, b) => a.localeCompare(b));
        },
        
        _getDataFilters: function () {
            const servicePath = `${this.osUrl}Filters`;  // Append the action name with a trailing slash

            axios.post(servicePath)
                .then((response) => {
                    let oFiltersModel = this.getView().getModel('oFiltersModel')
                    oFiltersModel.setData(
                        {
                            Entity: this._elaborateEntities(response.data.BUKRS, response.data.BUTXT),
                            Contratto: this._sortStringArray(response.data.RECNNR),
                            Periodo: this._elaboratedMonths(response.data.PERIODDUEDATE),
                            Anno: this._sortStringArray(response.data.YEARDUEDATE),
                            Id_storico: this._sortStringArray(response.data.ID_STORICO)
                        }
                    )
                    return

                })
                .catch((error) => {
                    console.error(error)
                    if (error.response) {
                        console.error("Server responded with error: ", error.response.status, error.response.data);
                    } else if (error.request) {
                        console.error("No response received from server: ", error.request);
                    } else {
                        console.error("Axios error: ", error.message);
                    }
                });
        },

        getTableData: function () {

            this.getView().byId("table").setBusy(true)

            // Initialize filter models
            let oSelectedFilters = this.getView().getModel('selectedFiltersModel').getData();
            let oSelectedFiltersModel = this.getView().getModel('selectedFiltersModel');



            const requestData = {
                entity: Object.values(oSelectedFilters.entity),
                contratto: oSelectedFilters.contratto ? Object.values(oSelectedFilters.contratto) : null, // Campo opzionale
                year: oSelectedFilters.year,
                period: oSelectedFilters.period,
                Id_storico: oSelectedFilters.ID_STORICO,
            }

            const servicePath = `${this.osUrl}GetTabellaFiltrata23`;  // Append the action name with a trailing slash
            axios.post(servicePath,  requestData)
                .then((response) => {
                    this.getView().byId("table").setBusy(false)
                    oSelectedFiltersModel.setProperty("/matchData", true);
                    let dataFiltered = this.getView().getModel('DataIMA23');
                    if(typeof response.data === 'object'){
                        let dataArray = []
                        dataArray.push(response.data)
                        
                        if (dataArray && Array.isArray(dataArray)) {
                            let processedData = dataArray[0].value.map(this.convertExponentialValues);
                            dataFiltered.setData(processedData);
                            dataFiltered.refresh();
                            this.convertModelStringToNumericValues();
                        }
                    } else {
                        dataFiltered.setData(response.data)
                        dataFiltered.refresh()
                    }     
                    return
                    


                })
                .catch((error) => {
                    console.error(error)
                    if (error.response) {
                        console.error("Server responded with error: ", error.response.status, error.response.data);
                    } else if (error.request) {
                        console.error("No response received from server: ", error.request);
                    } else {
                        console.error("Axios error: ", error.message);
                    }
                });

                

        },

        convertExponentialValues: function (obj) {
            // Iterate through all properties of the object
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    // Check if the value is a string representing a number in exponential form
                    if (typeof obj[key] === 'string' && obj[key].match(/^-?\d+\.?\d*e[+\-]?\d+$/i)) {
                        // Convert the string to a number
                        let numberValue = parseFloat(obj[key]);
                        if (!isNaN(numberValue)) {
                            // Format the number to Italian style with 2 decimal places
                            obj[key] = numberValue.toLocaleString('it-IT', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            });
                        }
                    }
                }
            }
            return obj;
        },
        
        onAfterRendering: function () {
            this.makeTitleObjAttrBold();
            this.disableFilterStart();
            console.clear();
        },

        onSelectionChange: function (oEvent) {
            this.assignReportResume(oEvent);
            this.makeTitleObjAttrBold();

            let oSelectedFiltersModel = this.getView().getModel('selectedFiltersModel');
            let oSelectedFilters = oSelectedFiltersModel.getData();

            const selectedControl = oEvent.getSource();
            const controlName = selectedControl.getName();

            // Update the specific filter in the model
            if (selectedControl.getMetadata().getName() === "sap.m.MultiComboBox") {
                oSelectedFilters[controlName] = selectedControl.getSelectedKeys();
            } else {
                oSelectedFilters[controlName] = selectedControl.getSelectedKey();
            }

            // Update the model with new data
            oSelectedFiltersModel.setData(oSelectedFilters);
            oSelectedFiltersModel.refresh();

            this.clearFilter(oEvent)
            


            // Check if all required filters are selected
            let allSelected =
                oSelectedFilters.Periodo &&
                    oSelectedFilters.Anno &&
                    oSelectedFilters.ID_STORICO &&
                    (oSelectedFilters.Entity && oSelectedFilters.Entity.length > 0) ? true : false;

            // Update allSelected property
            oSelectedFiltersModel.setProperty("/allSelected", allSelected);

            this.selectFiltering();
        },


        clearFilter: function(oEvent) {

            let oSelectedFiltersModel = this.getView().getModel('selectedFiltersModel');
            let filtriSelezionati = oSelectedFiltersModel.getData();

            const selectedControl = oEvent.getSource();
            const controlName = selectedControl.getName();

            let aPreviousSelectedKeys = filtriSelezionati[controlName] || [];
            let isItemSelectedFilled

            switch (controlName) {
                case "ID_STORICO":
                        isItemSelectedFilled = selectedControl.getSelectedKey().length;
                        isItemSelectedFilled = true // Deselect to make optional fields upon deletion filterable based on the selected filters
                       
                        if(isItemSelectedFilled){
                            
                        const els = [
                            this.getView().byId("ContrattoBox"),
                            this.getView().byId("AnnoSelect"),
                            this.getView().byId("PeriodoSelect"),
                            this.getView().byId("EntityBox")
                        ]

                        els.forEach(el => {
                            if (el.getMetadata().getName() === "sap.m.MultiComboBox") {
                                el.setSelectedKeys(null)
                            } else if (el.getMetadata().getName() === "sap.m.Select") {
                                el.setSelectedKey(null)
                            } else if (el.getMetadata().getName() === "sap.m.ComboBox") {
                                el.setSelectedKey(null)
                            }

                            // Checking each label's concatenation to empty it
                            this.assignReportResume(oEvent, el.getLabels()[0].getText().toLowerCase(), el);
                            this.makeTitleObjAttrBold();
                        })
                    }
                    break;

                case "Entity":                    
                    isItemSelectedFilled = selectedControl.getSelectedKeys().length;
                    isItemSelectedFilled = true // Deselect to make optional fields upon deletion filterable based on the selected filters
                    
                    if(isItemSelectedFilled){
                        
                        const els = [
                            this.getView().byId("AnnoSelect"),
                            this.getView().byId("PeriodoSelect"),
                            this.getView().byId("ContrattoBox")
                        ]

                        els.forEach(el => {
                            if (el.getMetadata().getName() === "sap.m.MultiComboBox") {
                                el.setSelectedKeys(null)
                            } else if (el.getMetadata().getName() === "sap.m.Select") {
                                el.setSelectedKey(null)
                            } else if (el.getMetadata().getName() === "sap.m.ComboBox") {
                                el.setSelectedKey(null)
                            }

                            // Checking each label's concatenation to empty it
                            this.assignReportResume(oEvent, el.getLabels()[0].getText().toLowerCase(), el);
                            this.makeTitleObjAttrBold();
                        })
                    }
                        
                    break;
        
                case "Anno":
                        isItemSelectedFilled = selectedControl.getSelectedKey().length;
                        isItemSelectedFilled = true // Deselect to make optional fields upon deletion filterable based on the selected filters
                       
                        if(isItemSelectedFilled){
                            
                        const els = [
                            this.getView().byId("PeriodoSelect"),
                            this.getView().byId("ContrattoBox")
                        ]

                        els.forEach(el => {
                            if (el.getMetadata().getName() === "sap.m.MultiComboBox") {
                                el.setSelectedKeys(null)
                            } else if (el.getMetadata().getName() === "sap.m.Select") {
                                el.setSelectedKey(null)
                            } else if (el.getMetadata().getName() === "sap.m.ComboBox") {
                                el.setSelectedKey(null)
                            }

                            // Checking each label's concatenation to empty it
                            this.assignReportResume(oEvent, el.getLabels()[0].getText().toLowerCase(), el);
                            this.makeTitleObjAttrBold();
                        })
                    }
                     
                    break;
        
                case "Periodo":
                        isItemSelectedFilled = selectedControl.getSelectedKey().length;
                        isItemSelectedFilled = true // Deselect to make optional fields upon deletion filterable based on the selected filters
                       
                        if(isItemSelectedFilled){
                            
                        const els = [
                            this.getView().byId("ContrattoBox")
                        ]

                        els.forEach(el => {
                            if (el.getMetadata().getName() === "sap.m.MultiComboBox") {
                                el.setSelectedKeys(null)
                            } else if (el.getMetadata().getName() === "sap.m.Select") {
                                el.setSelectedKey(null)
                            } else if (el.getMetadata().getName() === "sap.m.ComboBox") {
                                el.setSelectedKey(null)
                            }

                            // Checking each label's concatenation to empty it
                            this.assignReportResume(oEvent, el.getLabels()[0].getText().toLowerCase(), el);
                            this.makeTitleObjAttrBold();
                        })
                    }
                           
                    break;
                
                case "Contratto":
                break;
                default:
                    console.error("default, errore nello switch")
                    break;
            }

        },



        selectFiltering: function() {
            
            const servicePath = `${this.osUrl}applyFilters23`;

            let oSelectedFilters = this.getView().getModel('selectedFiltersModel').getData();

            const requestData = {
                Id_storico: oSelectedFilters.ID_STORICO,
                entity: oSelectedFilters.entity ? Object.values(oSelectedFilters.entity) : null,
               year: oSelectedFilters.year,
               period: oSelectedFilters.period,
               contratto: oSelectedFilters.contratto ? Object.values(oSelectedFilters.contratto) : null, // Campo opzionale
            }

            axios.post(servicePath, requestData)
            .then((response) => {
                let oFiltersModel = this.getView().getModel('oFiltersModel')

                if(!requestData.entity || requestData.entity.length == 0)
                    {
                    oFiltersModel.getData().Contratto = this._sortStringArray(response.data.RECNNR)
                    oFiltersModel.getData().Anno = this._sortStringArray(response.data.YEARDUEDATE)
                    oFiltersModel.getData().Periodo = this._elaboratedMonths(response.data.PERIODDUEDATE)
                    oFiltersModel.getData().Entity = this._elaborateEntities(response.data.BUKRS, response.data.BUTXT)
                    
                    }
                

                    if(!requestData.year){
                        oFiltersModel.getData().Anno = this._sortStringArray(response.data.YEARDUEDATE)
                        oFiltersModel.getData().Periodo = this._elaboratedMonths(response.data.PERIODDUEDATE)
                        oFiltersModel.getData().Contratto = this._sortStringArray(response.data.RECNNR)
                        
                        }

                if(!requestData.period){
                    oFiltersModel.getData().Periodo = this._elaboratedMonths(response.data.PERIODDUEDATE)
                    oFiltersModel.getData().Contratto = this._sortStringArray(response.data.RECNNR)
                    
                    }

                if(!requestData.contratto){
                    oFiltersModel.getData().Contratto = this._sortStringArray(response.data.RECNNR)
                    
                    }

                oFiltersModel.refresh()
                return

            })
            .catch((error) => {
                console.error(error)
                if (error.response) {
                    console.error("Server responded with error: ", error.response.status, error.response.data);
                } else if (error.request) {
                    console.error("No response received from server: ", error.request);
                } else {
                    console.error("Axios error: ", error.message);
                }
            });

        },



        setEnabledDownload: function (bool) {
            const excelBtnEl = this.getView().byId("excelBtn");
            const pdfBtnEl = this.getView().byId("pdfBtn");


            excelBtnEl.setEnabled(bool)
            pdfBtnEl.setEnabled(bool)

        },

        disableFilterStart: function (oEvent) {

            const filterBarEl = this.getView().byId("filterbar");
            const searchButtonEl = filterBarEl._getSearchButton();

            if (searchButtonEl) {
                searchButtonEl.setEnabled(false);  // Disable the search (or Avvio) button
            }
        },

        makeTitleObjAttrBold: function () {
            const objectAttributeText = document.querySelectorAll(".sapFDynamicPageHeaderContent .sapUiVltCell.sapuiVltCell span");

            objectAttributeText.forEach((el) => {
                if (el && el.textContent.includes(':')) {
                    const textParts = el.textContent.split(':');

                    const boldTitle = document.createElement('span');
                    boldTitle.style.fontWeight = 'bold';
                    boldTitle.textContent = textParts[0] + ': ';

                    const regularText = document.createTextNode(textParts[1].trim());

                    el.textContent = '';

                    el.appendChild(boldTitle);
                    el.appendChild(regularText);
                }
            })
        },

        assignReportResume: function (oEvent, concatenatedElementLabel, concatenatedElementObj) {
            const selectedSelectObj = oEvent.getSource();
            const selectedNameString = selectedSelectObj ? selectedSelectObj.getLabels()[0].getText() : "";
            let selectedItemsText = "";
            let concatedItemsText = "";

            if (selectedSelectObj.getMetadata().getName() === "sap.m.MultiComboBox") {
                // Handle MultiComboBox
                // Set the text for the selected item and the concatenated element and check the relative select type
                if (concatenatedElementObj !== undefined && concatenatedElementObj.getMetadata().getName() === "sap.m.MultiComboBox") {
                    concatedItemsText = concatenatedElementObj.getSelectedKeys()
                    .map(item => item.getText())
                    .join(", ");
                } else {
                    selectedItemsText = selectedSelectObj.getSelectedItems()
                        .map(item => item.getText())
                        .join(", ");

                }
                
            } else if (selectedSelectObj.getMetadata().getName() === "sap.m.Select") {
                // Handle Select
                if (concatenatedElementObj !== undefined && concatenatedElementObj.getMetadata().getName() === "sap.m.Select") {
                    const selectedConcatenatedItem = concatenatedElementObj.getSelectedItem();
                    concatedItemsText = selectedConcatenatedItem ? selectedConcatenatedItem.getText() : "";
                } else {
                    const selectedItem = selectedSelectObj.getSelectedItem();
                    selectedItemsText = selectedItem ? selectedItem.getText() : "";

                }

            } else if (selectedSelectObj.getMetadata().getName() === "sap.m.ComboBox") {
                // Handle ComboBox
                if (concatenatedElementObj !== undefined && concatenatedElementObj.getMetadata().getName() === "sap.m.ComboBox") {
                    const selectedConcatenatedItem = concatenatedElementObj.getSelectedItem();
                    concatedItemsText = selectedConcatenatedItem ? selectedConcatenatedItem.getText() : "";
                } else {
                    const selectedItem = selectedSelectObj.getSelectedItem();
                    selectedItemsText = selectedItem ? selectedItem.getText() : "";

                }

            }

            const resumeAttributesWrapperElements = this.getView().byId("hLayout");
            const attributesContent = resumeAttributesWrapperElements.getContent();

            attributesContent.forEach(content => {
                const objectAttributes = content.getContent();

                objectAttributes.forEach(objAttr => {
                    if (objAttr instanceof ObjectAttribute) {

                        if (objAttr.getTitle().toLowerCase() === selectedNameString.toLowerCase() ) {
                            objAttr.setText(selectedItemsText);

                            objAttr.rerender();

                        } else if (objAttr.getTitle().toLowerCase() === concatenatedElementLabel) {
                            objAttr.setText(concatedItemsText)

                            objAttr.rerender();
                        }

                    }
                })

            })

        },

        onCloseLegend: function (oEvent) {
            var oPanel = this.byId("legendPanel");
            oPanel.setVisible(false);  // Collapse the panel (similar to closing it)
        },


        _matchData: function () {
            let dataFilter = this.getView().getModel('selectedFiltersModel').getData();

            this.getView().setModel(new JSONModel(), "DataIMA23");
            var arrayFiltrato = []

            this.getView().getModel("DataIMA23").setData(arrayFiltrato)
            this.getView().getModel("DataIMA23").refresh()

        },

        onSearch: function () {
            this.getTableData()
        },

        _loadData: function (oModel) {
            var oTable = this.byId("table");
            if (oModel) {
                var aData = this._prepareData(oModel.getData().Leases);
                var oTableModel = new JSONModel({ rows: aData });
                oTable.setModel(oTableModel);
                oTable.bindRows("/rows");
                this._createColumns(aData);
                this._colorTotalRows();
                this.setTableHeight(null, oTable)
            }
        },

        _prepareData: function (leasesData) {
            var aRows = [];
            var lastCategory = "";  // Per tenere traccia dell'ultima categoria usata

            // Loop attraverso tutte le categorie di leases
            for (const category in leasesData) {
                if (Array.isArray(leasesData[category])) {
                    // Gestisci categorie non-Summary (es: Buildings, Cars in pool)
                    leasesData[category].forEach(item => {
                        let oRowData = { "Category": category === lastCategory ? "" : category };  

                        // Aggiorna lastCategory per le prossime iterazioni
                        lastCategory = category;

                        // Aggiungi gli altri dati
                        for (let key in item) {
                            oRowData[key] = item[key] === null ? "-" : item[key];
                        }
                        aRows.push(oRowData);
                    });
                } else if (category === "Summary") {
                    // Gestisci la sezione Summary separatamente
                    let summaryData = leasesData[category];
                    for (const subCategory in summaryData) {
                        let summaryRow = { "Category": subCategory === lastCategory ? "" : subCategory };
                        let summaryValues = summaryData[subCategory];

                        // Aggiorna lastCategory per evitare ripetizioni
                        lastCategory = subCategory;

                        for (let key in summaryValues) {
                            summaryRow[key] = summaryValues[key] === null ? "-" : summaryValues[key];
                        }
                        // Marca questa riga come riga di riepilogo
                        summaryRow["_isTotal"] = true;
                        aRows.push(summaryRow);
                    }
                }
            }

            return aRows;
        },


        _createColumns: function (aData) {
            var oTable = this.byId("table");
            var aExistingColumns = new Set();
            Object.keys(aData[0] || {}).forEach(sColumnName => {
                if (!aExistingColumns.has(sColumnName)) {
                    this._addColumn(sColumnName);
                    aExistingColumns.add(sColumnName);
                }
            });
        },

        _addColumn: function (sColumnName) {
            var oTable = this.byId("table");
            var oColumn = new sap.ui.table.Column({
                label: new sap.m.Label({ text: sColumnName }),
                template: new sap.m.Text({ text: "{" + sColumnName + "}" }),
                width: "11rem"
            });
            oTable.addColumn(oColumn);
        },

        setTableHeight: function (oEvent, oTable) {
            let iScreenHeight = window.innerHeight;
            let iScreenWidth = window.innerWidth;
            if (iScreenWidth < 450) {
                let iRowCount = Math.floor(iScreenHeight / 100);  // Assuming each row is around 100px in height
                oTable.setVisibleRowCount(iRowCount);
            } else {
                let iRowCount = Math.floor(iScreenHeight / 80);  // Assuming each row is around 100px in height
                oTable.setVisibleRowCount(iRowCount);
            }
        },

        _colorTotalRows: function () {
            var oTable = this.byId("table");
            var fnApplyStyles = function () {
                var aRows = oTable.getRows(); // Get all visible rows

                aRows.forEach(function (oRow) {
                    var oContext = oRow.getBindingContext(); // Get row context (data)
                    var $rowDom = oRow._mDomRefs.jQuery.row[1]; // Get DOM reference of row
                    var $rowDomFix = oRow._mDomRefs.jQuery.row[0]; // Get fixed column DOM reference

                    if (oContext && ($rowDom || $rowDomFix)) {
                        // Fetch the row data (e.g., Category and _isTotal)
                        var sCategory = oContext.getProperty("Category");
                        var bIsTotal = oContext.getProperty("_isTotal");

                        // Check if the row belongs to the 'Total' category and is marked as a total row
                        if (sCategory === "Total" && bIsTotal === true) {
                            // Add the CSS class to highlight the total row
                            $($rowDom).addClass("highlightRow");
                            $($rowDomFix).addClass("highlightRow");
                        } else {
                            // Remove the CSS class in case it was previously added
                            $($rowDom).removeClass("highlightRow");
                            $($rowDomFix).removeClass("highlightRow");
                        }
                    }
                });
            };

            // Attach the event handler to the rowsUpdated event to ensure styles are applied after rendering
            oTable.attachEvent("rowsUpdated", fnApplyStyles);
            fnApplyStyles();
        },


        _bindToolbarText: function () {
            let oSelectedFilters = this.getView().getModel('selectedFiltersModel').getData();
            let sInfoText = `Scenario: ${oSelectedFilters.scenario || "-"} - Period: ${oSelectedFilters.period || "-"} - Year: ${oSelectedFilters.year || "-"} - Entity: ${oSelectedFilters.entity || "-"}`;
        },

        onDownloadExcelPress: function () {
            var oTable = this.byId("table");  
            var oModel = oTable.getModel();  
            var aData = oTable.getBinding('rows').oList;  
            var aCols = this._createColumnConfig();  

            // Excel Export settings
            var oSettings = {
                workbook: {
                    columns: aCols,  // Dynamic columns based on data
                    context: {
                        sheetName: 'Exported Data'  // Name of the Excel sheet
                    },
                    styles: [
                        {
                            id: "header", 
                            fontSize: 12,  
                            fontColor: "#ffffff",  
                            backgroundColor: "#808080",  
                            bold: true,  
                            hAlign: "Center",  
                            border: {
                                top: { style: "thin", color: "#000000" },  
                                bottom: { style: "thin", color: "#000000" },  
                                left: { style: "thin", color: "#000000" },  
                                right: { style: "thin", color: "#000000" }  
                            }
                        },
                        {
                            id: "content",  
                            fontSize: 10,  
                            hAlign: "Left",  
                            border: {
                                top: { style: "thin", color: "#000000" },  
                                bottom: { style: "thin", color: "#000000" },  
                                left: { style: "thin", color: "#000000" },  
                                right: { style: "thin", color: "#000000" }  
                            }
                        }
                    ]
                },
                dataSource: aData,  // Data source for the export
                fileName: 'ExportedData.xlsx',  // File name for the exported file
                worker: false  // Disable worker threads for simplicity
            };

            // Create a new instance of the Spreadsheet export utility
            var oSheet = new Spreadsheet(oSettings);
            oSheet.build()  // Build the Excel file
                .then(function () {
                    sap.m.MessageToast.show('Excel export successful!');  // Show success message
                })
                .finally(function () {
                    oSheet.destroy();  // Clean up the export utility
                });
        },
        

        onDownloadPdfPress: function () {
            var oTable = this.byId("table");
            var oBinding = oTable.getBinding("rows");
        
            // Estrai i dati mappati per ogni riga
            var odata = oBinding.getContexts().map(function (oContext) {
                return oContext.getObject();
            });
        
            // Definisci la struttura del PDF
            var docDefinition = {
                pageSize: 'A4',
                pageOrientation: 'landscape',
                footer: { text: new Date().toLocaleString(), style: ['footerStyle'] },
                content: [],
                styles: {
                    headerStyle: {
                        fontSize: 20,
                        bold: true,
                        alignment: 'center',
                        margin: [0, 10, 0, 25]
                    },
                    columnStyle: {
                        fontSize: 13,
                        bold: true,
                        alignment: 'center',
                        margin: [0, 10, 0, 0]
                    },
                    cellStyle: {
                        fontSize: 10,
                    },
                    footerStyle: {
                        fontSize: 7,
                        alignment: 'right',
                        margin: [0, 10, 10, 0]
                    }
                }
            };
        
            // Suddivisione delle colonne in gruppi di massimo 5
            var columns = [
                "JOURNAL_TYPE", "ACCOUNT", "XMBEZ", "RECNTXTOLD", 
                "IDENTOBJNR", "DEBIT", "CREDIT", "DEBIT_CURR", 
                "CREDIT_CURR"
            ];
        
            // Calcola quante sezioni (o pagine) con colonne divise sono necessarie
            for (let i = 0; i < columns.length; i += 10) {
                let pageColumns = columns.slice(i, i + 10);
                
                // Struttura la tabella per questa sezione
                let tableBody = [];
        
                // Aggiungi l'intestazione
                let headerRow = pageColumns.map(col => ({ text: col, style: ['columnStyle'] }));
                tableBody.push(headerRow);
        
                odata.forEach(function (rowData) {
                    let row = [];
                    pageColumns.forEach(col => {
                        row.push({ text: rowData[col] || "-", style: ['cellStyle'] });
                    });
                    tableBody.push(row);
                });
        
                docDefinition.content.push({
                    table: {
                        widths: Array(pageColumns.length).fill('auto'),
                        body: tableBody
                    },
                    pageBreak: 'after' // Imposta un'interruzione di pagina dopo ogni tabella
                });
            }
        
            if (docDefinition.content.length > 0) {
                delete docDefinition.content[docDefinition.content.length - 1].pageBreak;
            }
        
            pdfMake.createPdf(docDefinition).download();
        },
        
        


        _createColumnConfig: function() {
            return this.byId("table").getColumns().map(function(oColumn) {
                const labels = oColumn.getMultiLabels();
                
                // Default values
                let columnConfig = {
                    label: "",
                    property: "",
                    type: 'string'
                };
        
                // Handle different label scenarios
                if (!labels || !labels.length) {
                    const singleLabel = oColumn.getLabel();
                    const text = singleLabel ? singleLabel.getText() : "";
                    columnConfig.label = text;
                    columnConfig.property = text;
                } else {
                    const targetLabel = labels.length > 1 ? labels[1] : labels[0];
                    columnConfig.label = targetLabel.getText();
                    columnConfig.property = targetLabel.getCustomData()[0]?.getValue() || targetLabel.getText();
                }
        
                return columnConfig;
            });
        },
    });
});

