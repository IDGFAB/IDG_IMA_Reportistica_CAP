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

            this._initializeFilters();
            // this.getDataMock(); // Load mock data for table

            this.osUrl = this.getOwnerComponent().getModel().sServiceUrl;

            this._createFiltersModel()

            this._getDataFilters()

            // this.getTableData()

            this.getView().setModel(new JSONModel(), 'DataIMA23')
            // this._bindToolbarText();
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
               // TipoContratto: null,
                Contratto: null,
                Anno: null,
                Periodo: null,
               // CostCenter: null,
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
                           // TipoContratto: this._sortStringArray(response.data.RECNTYPE),
                            Contratto: this._sortStringArray(response.data.RECNNR),
                            Periodo: this._elaboratedMonths(response.data.PERIODDUEDATE),
                            Anno: this._sortStringArray(response.data.YEARDUEDATE),
                          //  CostCenter: this._sortStringArray(response.data.CDC),
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
               // tipoContratto: Object.values(oSelectedFilters.tipoContratto),
                contratto: oSelectedFilters.contratto ? Object.values(oSelectedFilters.contratto) : null, // Campo opzionale
                year: oSelectedFilters.year,
                period: oSelectedFilters.period,
         //       costCenter: oSelectedFilters.costCenter ? Object.values(oSelectedFilters.costCenter) : null, // Campo opzionale
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
                            // Convert each object in the array
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
                // For MultiComboBox, join selected items' keys
                oSelectedFilters[controlName] = selectedControl.getSelectedKeys();
            } else {
                // For Select and ComboBox, get the selected key
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
                    //(oSelectedFilters.TipoContratto && oSelectedFilters.TipoContratto.length > 0) &&
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
                            // this.getView().byId("CostCenterBox"),
                            this.getView().byId("EntityBox")
                        ]

                        els.forEach(el => {
                            if (el.getMetadata().getName() === "sap.m.MultiComboBox") {
                                // Handle MultiComboBox
                                el.setSelectedKeys(null)
                            } else if (el.getMetadata().getName() === "sap.m.Select") {
                                // Handle Select
                                el.setSelectedKey(null)
                            } else if (el.getMetadata().getName() === "sap.m.ComboBox") {
                                // Handle ComboBox
                                el.setSelectedKey(null)
                            }

                            // Checking each label's concatenation to empty it
                            this.assignReportResume(oEvent, el.getLabels()[0].getText().toLowerCase(), el);
                            this.makeTitleObjAttrBold();
                        })
                    }
                    break;
        
                // case "TipoContratto":
                //     isItemSelectedFilled = selectedControl.getSelectedKeys();
                //     isItemSelectedFilled = true // Deselect to make optional fields upon deletion filterable based on the selected filters
                    
                //     if(isItemSelectedFilled) {
                        
                //         const els = [
                //             this.getView().byId("ContrattoBox"),
                //             this.getView().byId("AnnoSelect"),
                //             this.getView().byId("PeriodoSelect"),
                //             // this.getView().byId("CostCenterBox"),
                //             this.getView().byId("IdStoricoSelect")
                //         ]

                //         els.forEach(el => {
                //             if (el.getMetadata().getName() === "sap.m.MultiComboBox") {
                //                 // Handle MultiComboBox
                //                 el.setSelectedKeys(null)
                //             } else if (el.getMetadata().getName() === "sap.m.Select") {
                //                 // Handle Select
                //                 el.setSelectedKey(null)
                //             } else if (el.getMetadata().getName() === "sap.m.ComboBox") {
                //                 // Handle ComboBox
                //                 el.setSelectedKey(null)
                //             }

                //             // Checking each label's concatenation to empty it
                //             this.assignReportResume(oEvent, el.getLabels()[0].getText().toLowerCase(), el);
                //             this.makeTitleObjAttrBold();
                //         })
                //     }
                     
                //     break;
        
                case "Entity":                    
                    isItemSelectedFilled = selectedControl.getSelectedKeys().length;
                    isItemSelectedFilled = true // Deselect to make optional fields upon deletion filterable based on the selected filters
                    
                    if(isItemSelectedFilled){
                        
                        const els = [
                            this.getView().byId("AnnoSelect"),
                            this.getView().byId("PeriodoSelect"),
                            // this.getView().byId("CostCenterBox"),
                            this.getView().byId("ContrattoBox")
                        ]

                        els.forEach(el => {
                            if (el.getMetadata().getName() === "sap.m.MultiComboBox") {
                                // Handle MultiComboBox
                                el.setSelectedKeys(null)
                            } else if (el.getMetadata().getName() === "sap.m.Select") {
                                // Handle Select
                                el.setSelectedKey(null)
                            } else if (el.getMetadata().getName() === "sap.m.ComboBox") {
                                // Handle ComboBox
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
                            // this.getView().byId("CostCenterBox"),
                            this.getView().byId("ContrattoBox")
                        ]

                        els.forEach(el => {
                            if (el.getMetadata().getName() === "sap.m.MultiComboBox") {
                                // Handle MultiComboBox
                                el.setSelectedKeys(null)
                            } else if (el.getMetadata().getName() === "sap.m.Select") {
                                // Handle Select
                                el.setSelectedKey(null)
                            } else if (el.getMetadata().getName() === "sap.m.ComboBox") {
                                // Handle ComboBox
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
                            // this.getView().byId("CostCenterBox"),
                            this.getView().byId("ContrattoBox")
                        ]

                        els.forEach(el => {
                            if (el.getMetadata().getName() === "sap.m.MultiComboBox") {
                                // Handle MultiComboBox
                                el.setSelectedKeys(null)
                            } else if (el.getMetadata().getName() === "sap.m.Select") {
                                // Handle Select
                                el.setSelectedKey(null)
                            } else if (el.getMetadata().getName() === "sap.m.ComboBox") {
                                // Handle ComboBox
                                el.setSelectedKey(null)
                            }

                            // Checking each label's concatenation to empty it
                            this.assignReportResume(oEvent, el.getLabels()[0].getText().toLowerCase(), el);
                            this.makeTitleObjAttrBold();
                        })
                    }
                           
                    break;
        
                // case "CostCenter":                    
                //     isItemSelectedFilled = selectedControl.getSelectedKeys().length;
                //     isItemSelectedFilled = true // Deselect to make optional fields upon deletion filterable based on the selected filters
                    
                //     if(isItemSelectedFilled){
                        
                //         const els = [
                //             this.getView().byId("IdStoricoSelect")
                //         ]

                //         els.forEach(el => {
                //             if (el.getMetadata().getName() === "sap.m.MultiComboBox") {
                //                 // Handle MultiComboBox
                //                 el.setSelectedKeys(null)
                //             } else if (el.getMetadata().getName() === "sap.m.Select") {
                //                 // Handle Select
                //                 el.setSelectedKey(null)
                //             } else if (el.getMetadata().getName() === "sap.m.ComboBox") {
                //                 // Handle ComboBox
                //                 el.setSelectedKey(null)
                //             }

                //             // Checking each label's concatenation to empty it
                //             this.assignReportResume(oEvent, el.getLabels()[0].getText().toLowerCase(), el);
                //             this.makeTitleObjAttrBold();
                //         })
                //     }
                     
                //     break;  
                
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
               // tipoContratto: oSelectedFilters.tipoContratto ? Object.values(oSelectedFilters.tipoContratto) : null,
               year: oSelectedFilters.year,
               period: oSelectedFilters.period,
               contratto: oSelectedFilters.contratto ? Object.values(oSelectedFilters.contratto) : null, // Campo opzionale
            //    costCenter: oSelectedFilters.costCenter ? Object.values(oSelectedFilters.costCenter) : null, // Campo opzionale
            }

            axios.post(servicePath, requestData)
            .then((response) => {
                let oFiltersModel = this.getView().getModel('oFiltersModel')
              
                // if(!requestData.tipoContratto || requestData.tipoContratto.length == 0){
                // oFiltersModel.getData().TipoContratto = this._sortStringArray(response.data.RECNTYPE)
                // oFiltersModel.getData().Contratto = this._sortStringArray(response.data.RECNNR)
                // oFiltersModel.getData().Anno = this._sortStringArray(response.data.YEARDUEDATE)
                // oFiltersModel.getData().Periodo = this._elaboratedMonths(response.data.PERIODDUEDATE)
                // oFiltersModel.getData().CostCenter = this._sortStringArray(response.data.CDC)
                // oFiltersModel.getData().Id_storico = this._sortStringArray(response.data.ID_STORICO)
                
                // }
                
                if(!requestData.entity || requestData.entity.length == 0)
                    {
                    oFiltersModel.getData().Contratto = this._sortStringArray(response.data.RECNNR)
                    oFiltersModel.getData().Anno = this._sortStringArray(response.data.YEARDUEDATE)
                    oFiltersModel.getData().Periodo = this._elaboratedMonths(response.data.PERIODDUEDATE)
                    //oFiltersModel.getData().CostCenter = this._sortStringArray(response.data.CDC)
                    oFiltersModel.getData().Entity = this._elaborateEntities(response.data.BUKRS, response.data.BUTXT)
                    
                    }
                

                    if(!requestData.year){
                        oFiltersModel.getData().Anno = this._sortStringArray(response.data.YEARDUEDATE)
                        oFiltersModel.getData().Periodo = this._elaboratedMonths(response.data.PERIODDUEDATE)
                    //    oFiltersModel.getData().CostCenter = this._sortStringArray(response.data.CDC)
                        oFiltersModel.getData().Contratto = this._sortStringArray(response.data.RECNNR)
                        
                        }

                if(!requestData.period){
                    oFiltersModel.getData().Periodo = this._elaboratedMonths(response.data.PERIODDUEDATE)
                //    oFiltersModel.getData().CostCenter = this._sortStringArray(response.data.CDC)
                    oFiltersModel.getData().Contratto = this._sortStringArray(response.data.RECNNR)
                    
                    }

                // if(!requestData.costCenter || requestData.costCenter.length == 0){
                //     oFiltersModel.getData().CostCenter = this._sortStringArray(response.data.CDC)
                //     oFiltersModel.getData().Id_storico = this._sortStringArray(response.data.ID_STORICO)
                    
                //     }
                if(!requestData.contratto){
                    oFiltersModel.getData().Contratto = this._sortStringArray(response.data.RECNNR)
                    
                    }
                   

                
                // {
                //         Entity: this._elaborateEntities(response.data.BUKRS, response.data.BUTXT),
                //         TipoContratto: this._sortStringArray(response.data.RECNTYPE),
                //         Contratto: this._sortStringArray(response.data.RECNNR),
                //         Periodo: this._elaboratedMonths(response.data.PERIODDUEDATE),
                //         Anno: this._sortStringArray(response.data.YEARDUEDATE),
                //         CostCenter: this._sortStringArray(response.data.CDC),
                //         Id_storico: this._sortStringArray(response.data.ID_STORICO)
                //     }
        

                oFiltersModel.refresh()
                //oSelectedFilters.refresh()
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

            // Entering in the elements of the resume in the header of the DynamicPage 
            const resumeAttributesWrapperElements = this.getView().byId("hLayout");
            const attributesContent = resumeAttributesWrapperElements.getContent();

            attributesContent.forEach(content => {
                const objectAttributes = content.getContent();

                objectAttributes.forEach(objAttr => {
                    if (objAttr instanceof ObjectAttribute) {

                        // Checks between the name of the ObjectAttribute {text:""} and the <Select label="">
                        if (objAttr.getTitle().toLowerCase() === selectedNameString.toLowerCase() ) {
                            objAttr.setText(selectedItemsText);

                            // This .rerender() forces the element to be rendered right away (try removing it)
                            objAttr.rerender();

                        } else if (objAttr.getTitle().toLowerCase() === concatenatedElementLabel) {
                            objAttr.setText(concatedItemsText)

                            // This .rerender() forces the element to be rendered right away (try removing it)
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

        _initializeFilters: function () {

            /* var url = "https://port4004-workspaces-ws-54xj8.eu20.applicationstudio.cloud.sap/odata/v4/catalog/View_All_Data";
             var urlBase= "https://port4004-workspaces-ws-54xj8.eu20.applicationstudio.cloud.sap/odata/v4/catalog/"
 
             var oTable = this.getView().byId("table"); 
         
             // Mostra l'indicatore di caricamento mentre i dati vengono recuperati
             //oTable.setBusy(true);
         
             var that = this;
         
             function fetchAllData(url, allData = []) {
                 axios.get(url)
                 .then((response) => {
                     // Aggiunge i dati ottenuti all'array allData
                     allData = allData.concat(response.data.value);
         
                     // Controlla se esiste un '@odata.nextLink' per continuare la paginazione
                     if (response.data['@odata.nextLink']) {
 
                         var urlGetSuccessive = urlBase + response.data['@odata.nextLink'];
                         fetchAllData(urlGetSuccessive, allData);
                     } else {
                         let tableModel = that.getView().getModel('tableModel');
                         if (!tableModel) {
                             tableModel = new sap.ui.model.json.JSONModel();
                             that.getView().setModel(tableModel, 'tableModel');
                         }
                         tableModel.setData({ allTableData: allData });
         
                         
                         var dati = tableModel.getProperty("/allTableData");
 
                        
                         let oFilterModel = new sap.ui.model.json.JSONModel({
                             Scenarios: [],
                             Periods: [],
                             Years: [],
                             Entity: []
                         });
 
                         
                         if (dati && dati.length > 0) {
                             
                             var scenarios = [{ name: "Actual" }, { name: "Budget" }];
                             var periods = [];
                             var years = [];
                             var entities = [];
 
                             dati.forEach((item) => {
                                 if (item.PERIODDUEDATE && !periods.some(period => period.name === item.PERIODDUEDATE)) {
                                     periods.push({ name: item.PERIODDUEDATE });
                                 }
                             
                                 if (item.YEARDUEDATE && !years.some(year => year.name === item.YEARDUEDATE)) {
                                     years.push({ name: item.YEARDUEDATE });
                                 }
                             
                                 if (item.IDENTASSET && !entities.some(entity => entity.name === item.IDENTASSET)) {
                                     entities.push({ name: item.IDENTASSET });
                                 }
                             });
 
                             
                             oFilterModel.setData({
                                 Scenarios: scenarios,
                                 Periods: periods,
                                 Years: years,
                                 Entity: entities
                             });
 
                             // Imposta il modello sulla vista
                             that.getView().setModel(oFilterModel, 'filterModel');
                             
                         } else {
                             console.error("No data available in tableModel to populate filterModel.");
                         }
 
                     }
                 })
                 .catch((error) => {
                     console.error("Error fetching data: ", error);
                     // Nasconde l'indicatore di caricamento anche in caso di errore
                     //oTable.setBusy(false);
 
                 });
                 
             }
         
             // Inizializza il fetch dei dati
             fetchAllData(url); */

            // let oFilterModel = new JSONModel({
            //     Scenarios: [{ name: "Actual" }, { name: "Budget" }],
            //     Periods: [{ name: "January" }, { name: "February" }, { name: "December" }],
            //     Years: [{ name: "2021" }, { name: "2022" }, { name: "2023" }],
            //     Entity: [{ name: "IMA - Industria Macchine Automatiche" }, { name: "COMADIS SPA" }, { name: "ILAPAK INTERNATIONAL SA" }]
            // });
            // this.getView().setModel(oFilterModel, 'filterModel');
        },

        _matchData: function () {
            let dataFilter = this.getView().getModel('selectedFiltersModel').getData();
            // let dataFromJSON = this.getView().getModel('tableModel').getData();

            this.getView().setModel(new JSONModel(), "DataIMA23");
            var arrayFiltrato = []

            // dataFromJSON.allTableData
            //     .filter(el => {
            //         if (el.IDENTASSET === dataFilter.entity &&
            //             el.YEARDUEDATE === dataFilter.year &&
            //             el.PERIODDUEDATE === dataFilter.period) {
            //             arrayFiltrato.push(el)
            //         }
            //     });
            this.getView().getModel("DataIMA23").setData(arrayFiltrato)
            this.getView().getModel("DataIMA23").refresh()

            // const keyMapping = {e
            //     entity: "Entity",
            //     period: "Period",
            //     scenario: "Scenario",
            //     year: "Year"
            // };

            // // Compare data using the keyMapping
            // return Object.keys(dataFilter).filter(el => el !== 'allSelected').every(key => {
            //     const jsonKey = keyMapping[key];
            //     if (!dataFilter[key]) return true; // Skip null filters
            //     return dataFromJSON[jsonKey] === dataFilter[key];
            // });
        },

        onSearch: function () {

            // let oSelectedFiltersModel = this.getView().getModel('selectedFiltersModel');
            // let dataFilled = Object.values(oSelectedFiltersModel.getData()).every(filter => filter != null);


            // oSelectedFiltersModel.setProperty("/matchData", false);
            // if (dataFilled) {
            //     const result = this._matchData();
            //     if (!result) {
            //         oSelectedFiltersModel.setProperty("/matchData", false);
            //         var oTable = this.byId("table");

            //         var oEmptyModel = new JSONModel({ rows: [] });
            //         oTable.setModel(oEmptyModel);
            //         oTable.unbindRows();
            //         sap.m.MessageToast.show("No report found");

            //         return;
            //     } else {
            //         oSelectedFiltersModel.setProperty("/matchData", true);
            //     }

            //     const dataFromJSON = this.getView().getModel('DataIMA23');
            //     this._loadData(dataFromJSON); // Load filtered data into table

            // }


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

        // _prepareData: function (leasesData) {
        //     var aRows = [];

        //     // Loop through all categories of leases
        //     for (const category in leasesData) {
        //         if (Array.isArray(leasesData[category])) {
        //             // Handle non-Summary lease categories (e.g., Buildings, Cars in pool)
        //             leasesData[category].forEach(item => {
        //                 let oRowData = { "Category": category };  // Add category name as a column
        //                 for (let key in item) {
        //                     oRowData[key] = item[key] === null ? "-" : item[key];
        //                 }
        //                 aRows.push(oRowData);
        //             });
        //         } else if (category === "Summary") {
        //             // Handle the Summary section separately
        //             let summaryData = leasesData[category];
        //             for (const subCategory in summaryData) {
        //                 let summaryRow = { "Category": subCategory };
        //                 let summaryValues = summaryData[subCategory];

        //                 for (let key in summaryValues) {
        //                     summaryRow[key] = summaryValues[key] === null ? "-" : summaryValues[key];
        //                 }
        //                 // Mark this row as a summary row
        //                 summaryRow["_isTotal"] = true;
        //                 aRows.push(summaryRow);
        //             }
        //         }
        //     }

        //     return aRows;
        // },



        _prepareData: function (leasesData) {
            var aRows = [];
            var lastCategory = "";  // Per tenere traccia dell'ultima categoria usata

            // Loop attraverso tutte le categorie di leases
            for (const category in leasesData) {
                if (Array.isArray(leasesData[category])) {
                    // Gestisci categorie non-Summary (es: Buildings, Cars in pool)
                    leasesData[category].forEach(item => {
                        let oRowData = { "Category": category === lastCategory ? "" : category };  // Evita di ripetere la categoria

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
            // Apply styles initially as well
            fnApplyStyles();
        },


        _bindToolbarText: function () {
            let oSelectedFilters = this.getView().getModel('selectedFiltersModel').getData();
            let sInfoText = `Scenario: ${oSelectedFilters.scenario || "-"} - Period: ${oSelectedFilters.period || "-"} - Year: ${oSelectedFilters.year || "-"} - Entity: ${oSelectedFilters.entity || "-"}`;
            // this.byId("dynamicInfoText").setText(sInfoText);
        },

        onDownloadExcelPress: function () {
            var oTable = this.byId("table");  // Reference to the table control
            var oModel = oTable.getModel();  // Access the model of the table
            var aData = oTable.getBinding('rows').oList;  // Get the data from the model
            var aCols = this._createColumnConfig();  // Create dynamic column configuration

            // Excel Export settings
            var oSettings = {
                workbook: {
                    columns: aCols,  // Dynamic columns based on data
                    context: {
                        sheetName: 'Exported Data'  // Name of the Excel sheet
                    },
                    // Define custom styles for the Excel export
                    styles: [
                        {
                            id: "header",  // Style ID for headers
                            fontSize: 12,  // Font size
                            fontColor: "#ffffff",  // Font color (white)
                            backgroundColor: "#808080",  // Background color (grey)
                            bold: true,  // Bold font
                            hAlign: "Center",  // Center alignment
                            border: {
                                top: { style: "thin", color: "#000000" },  // Top border
                                bottom: { style: "thin", color: "#000000" },  // Bottom border
                                left: { style: "thin", color: "#000000" },  // Left border
                                right: { style: "thin", color: "#000000" }  // Right border
                            }
                        },
                        {
                            id: "content",  // Style ID for content cells
                            fontSize: 10,  // Font size
                            hAlign: "Left",  // Left alignment
                            border: {
                                top: { style: "thin", color: "#000000" },  // Top border
                                bottom: { style: "thin", color: "#000000" },  // Bottom border
                                left: { style: "thin", color: "#000000" },  // Left border
                                right: { style: "thin", color: "#000000" }  // Right border
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
            // Ottieni il modello associato alla tabella
            var oTable = this.byId("table");
            var oBinding = oTable.getBinding("rows");

            console.log("tabella ",oTable)
        
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
        
                // Popola i dati delle righe nel PDF, solo per le colonne di questa sezione
                odata.forEach(function (rowData) {
                    let row = [];
                    pageColumns.forEach(col => {
                        row.push({ text: rowData[col] || "-", style: ['cellStyle'] });
                    });
                    tableBody.push(row);
                });
        
                // Aggiungi la tabella della sezione al contenuto del PDF come nuova pagina
                docDefinition.content.push({
                    table: {
                        widths: Array(pageColumns.length).fill('auto'),
                        body: tableBody
                    },
                    pageBreak: 'after' // Imposta un'interruzione di pagina dopo ogni tabella
                });
            }
        
            // Rimuove l'ultima interruzione di pagina per evitare una pagina vuota alla fine
            if (docDefinition.content.length > 0) {
                delete docDefinition.content[docDefinition.content.length - 1].pageBreak;
            }
        
            // Crea e scarica il PDF
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

        // getDataMock: function () {
        //     // Set JSON data to the model
        //     let oData = {
        //         "Entity": "ILAPAK INTERNATIONAL SA",
        //         "Scenario": "Actual",
        //         "Period": "December",
        //         "Year": "2023",
        //         "Leases": {
        //             "Buildings": [
        //                 {
        //                     "Asset Class": "Building",
        //                     "Intercompany": "None",
        //                     "CDC": "SPESE GENERALIDI GRUPPO",
        //                     "Sector": "SPESE GENERALI",
        //                     "Contract Description": "Affitto nuovo immobile",
        //                     "Lease N.": "IIN4298",
        //                     "Net Right of Use": 1134683,
        //                     "Closing Leases Liabilities": 1496413,
        //                     "Lease Liabilities Short Term": 200664,
        //                     "Lease Liabilities Long Term": 1295749,
        //                     "Depreciation": -236682,
        //                     "FX Rates Gain": 194931,
        //                     "FX Rates Loss": -38534
        //                 },
        //                 {
        //                     "Asset Class": "Building",
        //                     "Intercompany": "none",
        //                     "CDC": "SPESE GENERALIDI GRUPPO",
        //                     "Sector": "SPAZI ATTR Lugano",
        //                     "Contract Description": "Affitto nuovo immobile",
        //                     "Lease N.": "IIN4225",
        //                     "Net Right of Use": 4371810,
        //                     "Closing Leases Liabilities": 5765516,
        //                     "Lease Liabilities Short Term": 773138,
        //                     "Lease Liabilities Long Term": 4992378,
        //                     "Depreciation": -911910,
        //                     "FX Rates Gain": 751046,
        //                     "FX Rates Loss": -148469
        //                 },
        //                 {
        //                     "Asset Class": "Building",
        //                     "Intercompany CDC": "None",
        //                     "Sector": "SPAZI ATTR Lugano",
        //                     "Contract Description": "Affitto vecchio immobile",
        //                     "Lease N.": "IIN4225",
        //                     "Net Right of Use": 4782416,
        //                     "Closing Leases Liabilities": 6307020,
        //                     "Lease Liabilities Short Term": 845752,
        //                     "Lease Liabilities Long Term": 5461268,
        //                     "Depreciation": -997558,
        //                     "FX Rates Gain": 821585,
        //                     "FX Rates Loss": -162413
        //                 }
        //             ],
        //             "Cars in pool": [
        //                 {
        //                     "Asset Class": "Cars in pool",
        //                     "Intercompany CDC": "None",
        //                     "Sector": "COSTI COMUNI OPERATIONS",
        //                     "Contract Description": "Leasing auto",
        //                     "Lease N.": "IIN2424",
        //                     "Net Right of Use": 2397,
        //                     "Closing Leases Liabilities": 2992,
        //                     "Lease Liabilities Short Term": 2992,
        //                     "Depreciation": -3419,
        //                     "FX Rates Gain": 3371,
        //                     "FX Rates Loss": -169
        //                 },
        //                 {
        //                     "Asset Class": "Cars in pool",
        //                     "Intercompany CDC": "None",
        //                     "Sector": "ASSISTENZA TEC GRUPPO IMA",
        //                     "Contract Description": "Leasing auto",
        //                     "Lease N.": "IIN3422",
        //                     "Net Right of Use": 2397,
        //                     "Closing Leases Liabilities": 2992,
        //                     "Lease Liabilities Short Term": 2992,
        //                     "Depreciation": -3419,
        //                     "FX Rates Gain": 3371,
        //                     "FX Rates Loss": -169
        //                 },
        //                 {
        //                     "Asset Class": "Cars in pool",
        //                     "Intercompany CDC": "None",
        //                     "Sector": "RICAMBI",
        //                     "Contract Description": "LEASING AUTO GD595BC",
        //                     "Lease N.": "IIN4213",
        //                     "Net Right of Use": 2031,
        //                     "Closing Leases Liabilities": 2059,
        //                     "Lease Liabilities Short Term": 2059,
        //                     "Depreciation": -2256,
        //                     "FX Rates Gain": 2216,
        //                     "FX Rates Loss": 0
        //                 }
        //             ],
        //             "Cars in benefit": [
        //                 {
        //                     "Asset Class": "Cars in benefit",
        //                     "Intercompany CDC": "None",
        //                     "Sector": "ACQUISTI E SPEDIZIONI",
        //                     "Contract Description": "LEASING AUTO GC978PH",
        //                     "Lease N.": "IIN4217",
        //                     "Net Right of Use": 1788,
        //                     "Closing Leases Liabilities": 1813,
        //                     "Lease Liabilities Short Term": 1813,
        //                     "Depreciation": -2184,
        //                     "FX Rates Gain": 2145,
        //                     "FX Rates Loss": 0
        //                 },
        //                 {
        //                     "Asset Class": "Cars in benefit",
        //                     "Intercompany CDC": "None",
        //                     "Sector": "DIREZIONE UFFICIO TECNICO",
        //                     "Contract Description": "LEASING AUTO GE716CK",
        //                     "Lease N.": "IIN4216",
        //                     "Net Right of Use": 4828,
        //                     "Closing Leases Liabilities": 4894,
        //                     "Lease Liabilities Short Term": 3911,
        //                     "Lease Liabilities Long Term": 984,
        //                     "Depreciation": -3942,
        //                     "FX Rates Gain": 3862,
        //                     "FX Rates Loss": 0
        //                 },
        //                 {
        //                     "Asset Class": "Cars in benefit",
        //                     "Intercompany CDC": "None",
        //                     "Sector": "DIREZIONE VENDITE",
        //                     "Contract Description": "LEASING AUTO TI265703",
        //                     "Lease N.": "IIN4220",
        //                     "Net Right of Use": 8068,
        //                     "Closing Leases Liabilities": 9697,
        //                     "Lease Liabilities Short Term": 6830,
        //                     "Lease Liabilities Long Term": 2866,
        //                     "Depreciation": -6571,
        //                     "FX Rates Gain": 6436,
        //                     "FX Rates Loss": -1066
        //                 }
        //             ],
        //             "Summary": {
        //                 "Building": {
        //                     "Net Right of Use": 10288910,
        //                     "Closing Leases Liabilities": 13568950,
        //                     "Lease Liabilities Short Term": 1819554,
        //                     "Lease Liabilities Long Term": 11749396,
        //                     "Depreciation": -2146149,
        //                     "FX Rates Gain": 1767562,
        //                     "FX Rates Loss": -349417,
        //                     "Total Gain/Loss": 936895
        //                 },
        //                 "Other tangible fixed assets": {
        //                     "Net Right of Use": 162676,
        //                     "Closing Leases Liabilities": 181583,
        //                     "Lease Liabilities Short Term": 119750,
        //                     "Lease Liabilities Long Term": 61833,
        //                     "Depreciation": -173727,
        //                     "FX Rates Gain": 170037,
        //                     "FX Rates Loss": -6440,
        //                     "Total Gain/Loss": 12451
        //                 },
        //                 "Total": {
        //                     "Net Right of Use": 10451586,
        //                     "Closing Leases Liabilities": 13750533,
        //                     "Lease Liabilities Short Term": 1939304,
        //                     "Lease Liabilities Long Term": 11811229,
        //                     "Depreciation": -2319877,
        //                     "FX Rates Gain": 1937599,
        //                     "FX Rates Loss": -355857,
        //                     "Total Gain/Loss": 949346
        //                 }
        //             }
        //         }
        //     };
        //     let oModel = new JSONModel(oData);
        //     this.getView().setModel(oModel, "DataIMA23");
        // }
    });
});

        //FILTRI DELLA 22


        //ONINIT:
        // this.getView().setModel(new JSONModel(), 'selectedFiltersModel')

        // let oSelectedFiltersModel = this.getView().getModel('selectedFiltersModel');

        // oSelectedFiltersModel.setProperty("/matchData", false);



        //onSelectonChange da aggiornare

        // onSelectionChange: function (oEvent) {
        //     this.assignReportResume(oEvent);
        //     this.makeTitleObjAttrBold();

        //     let oSelectedFiltersModel = this.getView().getModel('selectedFiltersModel');
        //     let oSelectedFilters = oSelectedFiltersModel.getData();

        //     const selectedControl = oEvent.getSource();
        //     const controlName = selectedControl.getName();

        //     // Update the specific filter in the model
        //     if (selectedControl.getMetadata().getName() === "sap.m.MultiComboBox") {
        //         // For MultiComboBox, join selected items' keys
        //         oSelectedFilters[controlName] = selectedControl.getSelectedKeys();
        //     } else {
        //         // For Select and ComboBox, get the selected key
        //         oSelectedFilters[controlName] = selectedControl.getSelectedKey();
        //     }

        //     // Update the model with new data
        //     oSelectedFiltersModel.setData(oSelectedFilters);

        //     // Check if all required filters are selected
        //     let allSelected =
        //         oSelectedFilters.Periodo &&
        //             oSelectedFilters.Anno &&
        //             oSelectedFilters.ID_STORICO &&
        //             (oSelectedFilters.TipoContratto && oSelectedFilters.TipoContratto.length > 0) &&
        //             (oSelectedFilters.Entity && oSelectedFilters.Entity.length > 0) ? true : false;

        //     // Update allSelected property
        //     oSelectedFiltersModel.setProperty("/allSelected", allSelected);

        // },

        //matchData

        // _matchData: function () {
        //     let dataFilter = this.getView().getModel('selectedFiltersModel').getData();

        //     this.getView().setModel(new JSONModel(), "DataIMA23");
        //     var arrayFiltrato = []

        //     this.getView().getModel("DataIMA23").setData(arrayFiltrato)
        //     this.getView().getModel("DataIMA23").refresh()

        // },

        // bind toolbar

        // _bindToolbarText: function () {
        //     let oSelectedFilters = this.getView().getModel('selectedFiltersModel').getData();
        //     let sInfoText = `Scenario: ${oSelectedFilters.scenario || "-"} - Period: ${oSelectedFilters.period || "-"} - Year: ${oSelectedFilters.year || "-"} - Entity: ${oSelectedFilters.entity || "-"}`;
        //     // this.byId("dynamicInfoText").setText(sInfoText);
        // },




        // _createFiltersModel: function () {
        //     let oFiltersModel = new JSONModel({
        //         Entity: null,
        //         TipoContratto: null,
        //         Contratto: null,
        //         Anno: null,
        //         Periodo: null,
        //         CostCenter: null,
        //         Id_storico:null,
        //         CompanyCode: null
        //     });
        //     this.getView().setModel(oFiltersModel, 'oFiltersModel');
        // },

        //-------------------------------------------------------------------------------------------------------------

        // _getDataFilters: function () {
        //     const servicePath = `${this.osUrl}Filters`;  // Append the action name with a trailing slash

        //     axios.post(servicePath)
        //         .then((response) => {
        //             let oFiltersModel = this.getView().getModel('oFiltersModel') //valutare quale modello utilizzare
        //             oFiltersModel.setData(
        //                 {
        //                     Entity: this._elaborateEntities(response.data.BUKRS, response.data.BUTXT),
        //                     TipoContratto: this._sortStringArray(response.data.RECNTYPE),
        //                     Contratto: this._sortStringArray(response.data.RECNNR),
        //                     Periodo: this._elaboratedMonths(response.data.PERIODDUEDATE),
        //                     Anno: this._sortStringArray(response.data.YEARDUEDATE),
        //                     CostCenter: this._sortStringArray(response.data.CDC),
        //                     Id_storico: this._sortStringArray(response.data.ID_STORICO)
        //                 }
        //             )
        //             return

        //         })
        //         .catch((error) => {
        //             console.error(error)
        //             if (error.response) {
        //                 console.error("Server responded with error: ", error.response.status, error.response.data);
        //             } else if (error.request) {
        //                 console.error("No response received from server: ", error.request);
        //             } else {
        //                 console.error("Axios error: ", error.message);
        //             }
        //         });
        // },

        //-------------------------------------------------------------------------------------------------------
        //cascade filtering

        // selectFiltering: function() {
            
        //     const servicePath = `${this.osUrl}applyFilters`;

        //     let oSelectedFilters = this.getView().getModel('selectedFiltersModel').getData();

        //     const requestData = {
        //         entity: Object.values(oSelectedFilters.entity),
        //         tipoContratto: oSelectedFilters.tipoContratto ? Object.values(oSelectedFilters.tipoContratto) : null,
        //         contratto: oSelectedFilters.contratto ? Object.values(oSelectedFilters.contratto) : null, // Campo opzionale
        //         year: oSelectedFilters.year,
        //         period: oSelectedFilters.period,
        //         costCenter: oSelectedFilters.costCenter ? Object.values(oSelectedFilters.costCenter) : null, // Campo opzionale
        //         Id_storico: oSelectedFilters.ID_STORICO,
        //     }

        //     axios.post(servicePath, requestData)
        //     .then((response) => {
        //         let oFiltersModel = this.getView().getModel('oFiltersModel')
              
        //         if(!requestData.tipoContratto || requestData.tipoContratto.length == 0){
        //         oFiltersModel.getData().TipoContratto = this._sortStringArray(response.data.RECNTYPE)
        //         oFiltersModel.getData().Contratto = this._sortStringArray(response.data.RECNNR)
        //         oFiltersModel.getData().Anno = this._sortStringArray(response.data.YEARDUEDATE)
        //         oFiltersModel.getData().Periodo = this._elaboratedMonths(response.data.PERIODDUEDATE)
        //         oFiltersModel.getData().CostCenter = this._sortStringArray(response.data.CDC)
        //         oFiltersModel.getData().Id_storico = this._sortStringArray(response.data.ID_STORICO)
                
        //         }
                
        //         if(!requestData.contratto || requestData.contratto.length == 0){
        //             oFiltersModel.getData().Contratto = this._sortStringArray(response.data.RECNNR)
        //             oFiltersModel.getData().Anno = this._sortStringArray(response.data.YEARDUEDATE)
        //             oFiltersModel.getData().Periodo = this._elaboratedMonths(response.data.PERIODDUEDATE)
        //             oFiltersModel.getData().CostCenter = this._sortStringArray(response.data.CDC)
        //             oFiltersModel.getData().Id_storico = this._sortStringArray(response.data.ID_STORICO)
                    
        //             }

        //             if(!requestData.year){
        //                 oFiltersModel.getData().Anno = this._sortStringArray(response.data.YEARDUEDATE)
        //                 oFiltersModel.getData().Periodo = this._elaboratedMonths(response.data.PERIODDUEDATE)
        //                 oFiltersModel.getData().CostCenter = this._sortStringArray(response.data.CDC)
        //                 oFiltersModel.getData().Id_storico = this._sortStringArray(response.data.ID_STORICO)
                        
        //                 }

        //         if(!requestData.period){
        //             oFiltersModel.getData().Periodo = this._elaboratedMonths(response.data.PERIODDUEDATE)
        //             oFiltersModel.getData().CostCenter = this._sortStringArray(response.data.CDC)
        //             oFiltersModel.getData().Id_storico = this._sortStringArray(response.data.ID_STORICO)
                    
        //             }

        //         if(!requestData.costCenter || requestData.costCenter.length == 0){
        //             oFiltersModel.getData().CostCenter = this._sortStringArray(response.data.CDC)
        //             oFiltersModel.getData().Id_storico = this._sortStringArray(response.data.ID_STORICO)
                    
        //             }
        //         if(!requestData.Id_storico){
        //             oFiltersModel.getData().Id_storico = this._sortStringArray(response.data.ID_STORICO)
                    
        //             }
                   
                
        //         // {
        //         //         Entity: this._elaborateEntities(response.data.BUKRS, response.data.BUTXT),
        //         //         TipoContratto: this._sortStringArray(response.data.RECNTYPE),
        //         //         Contratto: this._sortStringArray(response.data.RECNNR),
        //         //         Periodo: this._elaboratedMonths(response.data.PERIODDUEDATE),
        //         //         Anno: this._sortStringArray(response.data.YEARDUEDATE),
        //         //         CostCenter: this._sortStringArray(response.data.CDC),
        //         //         Id_storico: this._sortStringArray(response.data.ID_STORICO)
        //         //     }
        

        //         oFiltersModel.refresh()
        //         //oSelectedFilters.refresh()
        //         return

        //     })
        //     .catch((error) => {
        //         console.error(error)
        //         if (error.response) {
        //             console.error("Server responded with error: ", error.response.status, error.response.data);
        //         } else if (error.request) {
        //             console.error("No response received from server: ", error.request);
        //         } else {
        //             console.error("Axios error: ", error.message);
        //         }
        //     });

        // },

