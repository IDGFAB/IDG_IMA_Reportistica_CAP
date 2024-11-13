sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/Spreadsheet",
    "sap/ui/thirdparty/jquery",
    "sap/m/ObjectAttribute",
    "sap/ui/model/Sorter",
], function (Controller, JSONModel, Spreadsheet, jQuery, ObjectAttribute, Sorter) {
    "use strict";

    return Controller.extend("imareport22.controller.Homepage", {
        onInit: function () {
            // Initialize filters and data
            this.getView().setModel(new JSONModel(), 'selectedFiltersModel')

            this.osUrl = this.getOwnerComponent().getModel().sServiceUrl;

            this._createFiltersModel()

            this._getDataFilters()

            this.getView().setModel(new JSONModel(), 'DataIMA22')
            let oSelectedFiltersModel = this.getView().getModel('selectedFiltersModel');

            oSelectedFiltersModel.setProperty("/matchData", false);

            this.entityKeys;
            this.typeContractKeys;
            this.contractKeys;
            this.cdcKeys;
            this.annoKey;
            this.periodoKey;
            this.idStoricoKey;
        },

        onAfterRendering: function () {
            this.makeTitleObjAttrBold();
            this.disableFilterStart();
            console.clear()
        },

        createSorter: function() {
            return new Sorter("description", false); // false for ascending order
        },

        _createFiltersModel: function () {
            let oFiltersModel = new JSONModel({
                Entity: null,
                TipoContratto: null,
                Contratto: null,
                Anno: null,
                Periodo: null,
                CostCenter: null,
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
            function padStart(num, targetLength) {
                let numStr = num.toString();
                while (numStr.length < targetLength) {
                  numStr = '0' + numStr;
                }
                return numStr;
            }
            
            var oModel = this.getView().getModel("DataIMA22");
            var aData = oModel.getData();
            
            const numericFields = [
                "RIGHT_OF_USE",
                "ACCUMULATED_DEPRECIATION",
                "NET_RIGHT_OF_USE",
                "CLOSING_LEASES_LIABILITIES",
                "LEASE_LIABILITIES_SHORT_TERM",
                "LEASE_LIABILITIES_LONG_TERM",
                "YTD_INTEREST",
                "LEASE_COST",
                "DEPRECIATION",
                "GAIN_FX_RATES",
                "LOSS_FX_RATES"
            ];
        
            aData = aData.map(item => {
                // Helper function to format number with thousands separator and 2 decimals
                const formatNumber = (num) => {
                    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                };
            
                numericFields.forEach(field => {
                    if (item[field]) {
                        const strValue = String(item[field]);
                        
                        const numValue = parseFloat(
                            strValue.replace(/\./g, '').replace(/,/g, '.'));
                        // Store the actual numeric value
                        item[field] = numValue;
                        
                        // Format display value with thousands separator and 2 decimals
                        item[field + '_DISPLAY'] = formatNumber(
                            strValue.startsWith('0,') 
                                ? parseFloat(strValue.replace(/,/g, '0.'))
                                : parseFloat(strValue.replace(/\./g, '').replace(/,/g, '.'))
                        );
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
            const servicePath = `${this.osUrl}Filters`;  // Append the action name

            axios.post(servicePath)
                .then((response) => {
                    let oFiltersModel = this.getView().getModel('oFiltersModel')
                    oFiltersModel.setData(
                        {
                            Entity: this._elaborateEntities(response.data.BUKRS, response.data.BUTXT),
                            TipoContratto: this._sortStringArray(response.data.RECNTYPE),
                            Contratto: this._sortStringArray(response.data.RECNNR),
                            Periodo: this._elaboratedMonths(response.data.PERIODDUEDATE),
                            Anno: this._sortStringArray(response.data.YEARDUEDATE),
                            CostCenter: this._sortStringArray(response.data.CDC),
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
                tipoContratto: Object.values(oSelectedFilters.tipoContratto),
                contratto: oSelectedFilters.contratto ? Object.values(oSelectedFilters.contratto) : null, // Campo opzionale
                year: oSelectedFilters.year,
                period: oSelectedFilters.period,
                costCenter: oSelectedFilters.costCenter ? Object.values(oSelectedFilters.costCenter) : null, // Campo opzionale
                Id_storico: oSelectedFilters.ID_STORICO,
            }

            const servicePath = `${this.osUrl}GetTabellaFiltrata22`;  // Append the action name with a trailing slash
            axios.post(servicePath,  requestData)
                .then((response) => {
                    this.getView().byId("table").setBusy(false)
                    oSelectedFiltersModel.setProperty("/matchData", true);
                    let dataFiltered = this.getView().getModel('DataIMA22');
                    if(typeof response.data === 'object'){
                        let dataArray = []
                        dataArray.push(response.data)
                        
                        if (dataArray && Array.isArray(dataArray)) {
                            // Convert each object in the array
                            let processedData = dataArray[0].value.map(this.convertExponentialValues);
                            dataFiltered.setData(processedData);
                            dataFiltered.refresh();
                            this.convertModelStringToNumericValues(); // Converting into numeric values
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
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    // Check if the value is a string representing a number in exponential form
                    if (typeof obj[key] === 'string' && obj[key].match(/^-?\d+\.?\d*e[+\-]?\d+$/i)) {
                        let numberValue = parseFloat(obj[key]);
                        if (!isNaN(numberValue)) {
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

            this.clearFilter(oEvent);
            
            // Update the model with new data
            oSelectedFiltersModel.setData(oSelectedFilters);
            oSelectedFiltersModel.refresh();

            // Check if all required filters are selected
            let allSelected =
                oSelectedFilters.Periodo &&
                    oSelectedFilters.Anno &&
                    oSelectedFilters.ID_STORICO &&
                    (oSelectedFilters.TipoContratto && oSelectedFilters.TipoContratto.length > 0) &&
                    (oSelectedFilters.Entity && oSelectedFilters.Entity.length > 0) ? true : false;

            oSelectedFiltersModel.setProperty("/allSelected", allSelected);
            
            this.selectFiltering();
        },


       clearFilter: function(oEvent) {

            let oSelectedFiltersModel = this.getView().getModel('selectedFiltersModel');
            let filtriSelezionati = oSelectedFiltersModel.getData();

            const selectedControl = oEvent.getSource();
            const controlName = selectedControl.getName();

            let aPreviousSelectedKeys = filtriSelezionati[controlName] || [];

            let isSelectedItemFilled

            switch (controlName) {
                case "ID_STORICO":
                    isSelectedItemFilled = selectedControl.getSelectedKey().length
                    isSelectedItemFilled = true // Deselect to make optional fields upon deletion filterable based on the selected filters
                    
                    if(isSelectedItemFilled){
                        
                        filtriSelezionati.Periodo = null
                        filtriSelezionati.CostCenter = null
                        filtriSelezionati.Entity = null
                        filtriSelezionati.TipoContratto = null
                        filtriSelezionati.Contratto = null
                        oSelectedFiltersModel.refresh();
                        
                        const els = [
                            this.getView().byId("TipoContrattoBox"),
                            this.getView().byId("ContrattoBox"),
                            this.getView().byId("AnnoSelect"),
                            this.getView().byId("PeriodoSelect"),
                            this.getView().byId("CostCenterBox"),
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
                            const labelText = el.getLabels()[0].getText().toLowerCase();
                            this.assignReportResume({
                                getSource: () => el
                            }, labelText, null);
                            this.makeTitleObjAttrBold();
                        })
                        oSelectedFiltersModel.setProperty("/allSelected", false);
                    }
                    break;
        
                case "Anno":
                    isSelectedItemFilled = selectedControl.getSelectedKey().length
                    isSelectedItemFilled = true // Deselect to make optional fields upon deletion filterable based on the selected filters
                    
                    if(isSelectedItemFilled){

                        filtriSelezionati.Periodo = null
                        filtriSelezionati.CostCenter = null
                        filtriSelezionati.Entity = null
                        filtriSelezionati.TipoContratto = null
                        filtriSelezionati.Contratto = null
                        oSelectedFiltersModel.refresh();
                        
                        const els = [
                            this.getView().byId("TipoContrattoBox"),
                            this.getView().byId("ContrattoBox"),
                            this.getView().byId("PeriodoSelect"),
                            this.getView().byId("CostCenterBox"),
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
                            const labelText = el.getLabels()[0].getText().toLowerCase();
                            this.assignReportResume({
                                getSource: () => el
                            }, labelText, null);
                            this.makeTitleObjAttrBold();
                            oSelectedFiltersModel.setProperty("/allSelected", false);
                        })
                    }
                     
                    break;
        
                case "Periodo":                    
                    isSelectedItemFilled = selectedControl.getSelectedKey().length
                    isSelectedItemFilled = true
                
                    if(isSelectedItemFilled){

                        filtriSelezionati.CostCenter = null
                        filtriSelezionati.Entity = null
                        filtriSelezionati.TipoContratto = null
                        filtriSelezionati.Contratto = null
                        oSelectedFiltersModel.refresh();
                        
                        const els = [
                            this.getView().byId("TipoContrattoBox"),
                            this.getView().byId("ContrattoBox"),
                            this.getView().byId("CostCenterBox"),
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

                            const labelText = el.getLabels()[0].getText().toLowerCase();
                            this.assignReportResume({
                                getSource: () => el
                            }, labelText, null);
                            this.makeTitleObjAttrBold();
                            oSelectedFiltersModel.setProperty("/allSelected", false);
                        })
                    }
                        
                    break;
        
                case "Entity":
                    isSelectedItemFilled = selectedControl.getSelectedKeys().length
                    isSelectedItemFilled = true 
                    
                    if(isSelectedItemFilled){

                        filtriSelezionati.TipoContratto = null
                        filtriSelezionati.Contratto = null
                        filtriSelezionati.CostCenter = null
                        oSelectedFiltersModel.refresh();
                        
                        const els = [
                            this.getView().byId("TipoContrattoBox"),
                            this.getView().byId("ContrattoBox"),
                            this.getView().byId("CostCenterBox"),
                        ]

                        els.forEach(el => {
                            if (el.getMetadata().getName() === "sap.m.MultiComboBox") {
                                el.setSelectedKeys(null)
                            } else if (el.getMetadata().getName() === "sap.m.Select") {
                                el.setSelectedKey(null)
                            } else if (el.getMetadata().getName() === "sap.m.ComboBox") {
                                el.setSelectedKey(null)
                            }

                            const labelText = el.getLabels()[0].getText().toLowerCase();
                            this.assignReportResume({
                                getSource: () => el
                            }, labelText, null);
                            this.makeTitleObjAttrBold();
                            oSelectedFiltersModel.setProperty("/allSelected", false);
                        })
                    }
                     
                    break;
        
                case "CostCenter":
                    isSelectedItemFilled = selectedControl.getSelectedKeys().length
                    isSelectedItemFilled = true 
                    
                    if(isSelectedItemFilled){
                        
                        filtriSelezionati.TipoContratto = null
                        filtriSelezionati.Contratto = null
                        oSelectedFiltersModel.refresh();

                        const els = [
                            this.getView().byId("TipoContrattoBox"),
                            this.getView().byId("ContrattoBox"),
                        ]

                        els.forEach(el => {
                            if (el.getMetadata().getName() === "sap.m.MultiComboBox") {
                                el.setSelectedKeys(null)
                            } else if (el.getMetadata().getName() === "sap.m.Select") {
                                el.setSelectedKey(null)
                            } else if (el.getMetadata().getName() === "sap.m.ComboBox") {
                                el.setSelectedKey(null)
                            }

                            const labelText = el.getLabels()[0].getText().toLowerCase();
                            this.assignReportResume({
                                getSource: () => el
                            }, labelText, null);
                            this.makeTitleObjAttrBold();
                            oSelectedFiltersModel.setProperty("/allSelected", false);
                        })
                    }
                           
                    break;
        
                case "TipoContratto":                    
                    isSelectedItemFilled = selectedControl.getSelectedKeys().length
                    isSelectedItemFilled = true 
                
                    if(isSelectedItemFilled){
                        
                        const els = [
                            this.getView().byId("ContrattoBox"),
                        ]

                        els.forEach(el => {
                            if (el.getMetadata().getName() === "sap.m.MultiComboBox") {
                                el.setSelectedKeys(null)
                            } else if (el.getMetadata().getName() === "sap.m.Select") {
                                el.setSelectedKey(null)
                            } else if (el.getMetadata().getName() === "sap.m.ComboBox") {
                                el.setSelectedKey(null)
                            }

                            const labelText = el.getLabels()[0].getText().toLowerCase();
                            this.assignReportResume({
                                getSource: () => el
                            }, labelText, null);
                            this.makeTitleObjAttrBold();
                            oSelectedFiltersModel.setProperty("/allSelected", false);
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
            
            const servicePath = `${this.osUrl}applyFilters22`;

            let oSelectedFilters = this.getView().getModel('selectedFiltersModel').getData();

            const requestData = {
                Id_storico: oSelectedFilters.ID_STORICO,
                year: oSelectedFilters.year,
                period: oSelectedFilters.period,
                entity: oSelectedFilters.entity ? Object.values(oSelectedFilters.entity) : null,
                costCenter: oSelectedFilters.costCenter ? Object.values(oSelectedFilters.costCenter) : null, // Campo opzionale
                tipoContratto: oSelectedFilters.tipoContratto ? Object.values(oSelectedFilters.tipoContratto) : null,
                contratto: oSelectedFilters.contratto ? Object.values(oSelectedFilters.contratto) : null, // Campo opzionale
            }

            axios.post(servicePath, requestData)
            .then((response) => {
                let oFiltersModel = this.getView().getModel('oFiltersModel')
              
                if(!requestData.year){
                oFiltersModel.getData().Anno = this._sortStringArray(response.data.YEARDUEDATE)
                oFiltersModel.getData().Periodo = this._elaboratedMonths(response.data.PERIODDUEDATE)
                oFiltersModel.getData().Entity = this._elaborateEntities(response.data.BUKRS, response.data.BUTXT)
                oFiltersModel.getData().CostCenter = this._sortStringArray(response.data.CDC)
                oFiltersModel.getData().TipoContratto = this._sortStringArray(response.data.RECNTYPE)
                oFiltersModel.getData().Contratto = this._sortStringArray(response.data.RECNNR)                
                }
                
                if(!requestData.period){
                    oFiltersModel.getData().Periodo = this._elaboratedMonths(response.data.PERIODDUEDATE)
                    oFiltersModel.getData().Entity = this._elaborateEntities(response.data.BUKRS, response.data.BUTXT)
                    oFiltersModel.getData().CostCenter = this._sortStringArray(response.data.CDC)
                    oFiltersModel.getData().TipoContratto = this._sortStringArray(response.data.RECNTYPE)
                    oFiltersModel.getData().Contratto = this._sortStringArray(response.data.RECNNR) 
                    }

                    if(!requestData.entity || requestData.entity.length == 0){
                        oFiltersModel.getData().Entity = this._elaborateEntities(response.data.BUKRS, response.data.BUTXT)
                        oFiltersModel.getData().CostCenter = this._sortStringArray(response.data.CDC)
                        oFiltersModel.getData().TipoContratto = this._sortStringArray(response.data.RECNTYPE)
                        oFiltersModel.getData().Contratto = this._sortStringArray(response.data.RECNNR) 
                        }

                if(!requestData.costCenter || requestData.costCenter.length == 0){
                    oFiltersModel.getData().CostCenter = this._sortStringArray(response.data.CDC)
                    oFiltersModel.getData().Contratto = this._sortStringArray(response.data.RECNNR) 
                    if(!requestData.tipoContratto){
                    oFiltersModel.getData().TipoContratto = this._sortStringArray(response.data.RECNTYPE)
                    }
                }

                if(!requestData.tipoContratto || requestData.tipoContratto.length == 0){
                    oFiltersModel.getData().TipoContratto = this._sortStringArray(response.data.RECNTYPE)
                    oFiltersModel.getData().Contratto = this._sortStringArray(response.data.RECNNR) 
                    
                    }
                if(!requestData.contratto || requestData.contratto.length == 0){
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

        assignReportResume: function(oEvent, concatenatedElementLabel, concatenatedElementObj) {
            const selectedSelectObj = oEvent.getSource();
            const selectedNameString = selectedSelectObj ? selectedSelectObj.getLabels()[0].getText() : "";
            
            // Helper function to get text based on control type
            const getSelectedText = (control) => {
                if (!control) return "";
                
                switch (control.getMetadata().getName()) {
                    case "sap.m.MultiComboBox":
                        return control.getSelectedKeys()
                            .map(item => typeof item === 'object' ? item.getText() : item)
                            .join(", ");
                            
                    case "sap.m.Select":
                    case "sap.m.ComboBox":
                        const selectedItem = control.getSelectedItem();
                        return selectedItem ? selectedItem.getText() : "";
                        
                    default:
                        return "";
                }
            };
        
            const selectedItemsText = concatenatedElementObj ? 
                getSelectedText(concatenatedElementObj) : 
                getSelectedText(selectedSelectObj);
        
            const resumeAttributesWrapperElements = this.getView().byId("hLayout");
            resumeAttributesWrapperElements.getContent().forEach(content => {
                content.getContent().forEach(objAttr => {
                    if (!(objAttr instanceof ObjectAttribute)) return;
        
                    const attrTitle = objAttr.getTitle().toLowerCase();
                    const isTargetAttribute = attrTitle === selectedNameString.toLowerCase() ||
                                            attrTitle === concatenatedElementLabel;
        
                    if (isTargetAttribute && selectedItemsText !== undefined) {
                        objAttr.setText(selectedItemsText);
                        objAttr.rerender();
                    }
                });
            });
        },

        onCloseLegend: function (oEvent) {
            var oPanel = this.byId("legendPanel");
            oPanel.setVisible(false);  // Collapse the panel (similar to closing it)
        },


        _matchData: function () {
            let dataFilter = this.getView().getModel('selectedFiltersModel').getData();

            this.getView().setModel(new JSONModel(), "DataIMA22");
            var arrayFiltrato = []

            this.getView().getModel("DataIMA22").setData(arrayFiltrato)
            this.getView().getModel("DataIMA22").refresh()

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
                let iRowCount = Math.floor(iScreenHeight / 100);  
                oTable.setVisibleRowCount(iRowCount);
            } else {
                let iRowCount = Math.floor(iScreenHeight / 80);  
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

            oTable.attachEvent("rowsUpdated", fnApplyStyles);
            fnApplyStyles();
        },


        _bindToolbarText: function () {
            let oSelectedFilters = this.getView().getModel('selectedFiltersModel').getData();
            let sInfoText = `Scenario: ${oSelectedFilters.scenario || "-"} - Period: ${oSelectedFilters.period || "-"} - Year: ${oSelectedFilters.year || "-"} - Entity: ${oSelectedFilters.entity || "-"}`;
        },

        onDownloadExcelPress: function () {
            var oTable = this.byId("table");  // Reference to the table control
            var oModel = oTable.getModel();  // Access the model of the table
            var aData = oTable.getBinding('rows').oList;  // Get the data from the model
            var aCols = this._createColumnConfig();  // Create dynamic column configuration

            // Excel Export settings
            var oSettings = {
                workbook: {
                    columns: aCols, 
                    context: {
                        sheetName: 'Exported Data'  
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
                dataSource: aData, 
                fileName: 'ExportedData.xlsx',  // File name for the exported file
                worker: false  // Disable worker threads
            };

            // Create a new instance of the Spreadsheet export utility
            var oSheet = new Spreadsheet(oSettings);
            oSheet.build()  
                .then(function () {
                    sap.m.MessageToast.show('Excel export successful!'); 
                })
                .finally(function () {
                    oSheet.destroy();  
                });
        },
        

        onDownloadPdfPress: function () {
            var oTable = this.byId("table");
            var oBinding = oTable.getBinding("rows");
            let odata = oBinding.getContexts().map(function (oContext) {
                return oContext.getObject();
            });
            
            const columnsConfig = [
                { name: "Asset Class", width: 60, technical: "ASSET_CLASS" },
                { name: "Intercompany", width: 40, technical: "INTERCOMPANY" },
                { name: "Cost Centre", width: 45, technical: "CDC" },
                { name: "CC Description", width: 60, technical: "CDC_CODE" },
                { name: "Lease Number", width: 45, technical: "LEASE_N" },
                { name: "Contract Code", width: 50, technical: "CONTRACT_CODE" },
                { name: "Business Area", width: 45, technical: "ACC_SECTOR" },
                { name: "Contract Description", width: 80, technical: "CONTRACT_DESCRIPTION" },
                { name: "Merged Entity", width: 45, technical: "MERGED_ENTITY" },
                { name: "Right of Use", width: 50, technical: "RIGHT_OF_USE" },
                { name: "Accumulated Depr.", width: 55, technical: "ACCUMULATED_DEPRECIATION" },
                { name: "Net Right of Use", width: 50, technical: "NET_RIGHT_OF_USE" },
                { name: "Closing Leases Liabilities", width: 60, technical: "CLOSING_LEASES_LIABILITIES" },
                { name: "Lease Liabilities Short Term", width: 60, technical: "LEASE_LIABILITIES_SHORT_TERM" },
                { name: "Lease Liabilities Long Term", width: 60, technical: "LEASE_LIABILITIES_LONG_TERM" },
                { name: "YTD Interest", width: 45, technical: "YTD_INTEREST" },
                { name: "Lease Cost", width: 45, technical: "LEASE_COST" },
                { name: "Depreciation", width: 45, technical: "DEPRECIATION" },
                { name: "Gain FX Rates", width: 45, technical: "GAIN_FX_RATES" },
                { name: "Loss FX Rates", width: 45, technical: "LOSS_FX_RATES" }
            ];
        
            var docDefinition = {
                pageSize: 'A3',
                pageOrientation: 'landscape',
                pageMargins: [5, 5, 5, 5],
                footer: { text: new Date().toLocaleString(), alignment: 'right', fontSize: 6 },
                content: []
            };
        
            let tableBody = [];
            
            // Add header row
            tableBody.push(columnsConfig.map(col => ({
                text: col.name.substring(0, 20),
                style: { fontSize: 6, bold: true, alignment: 'center' },
                noWrap: true,
                fillColor: '#d9d9d9',
                border: [true, false, true, true],
            })));
        
            // Add data rows
            odata.forEach(function (rowData) {
                let row = columnsConfig.map(col => ({
                    text: String(rowData[col.technical] || "-").substring(0, 60),
                    style: { fontSize: 6 },
                    noWrap: false,
                    border: [true, false, true, false],
                }));
                tableBody.push(row);
            });
        
            docDefinition.content.push({
                table: {
                    headerRows: 1,
                    widths: columnsConfig.map(col => col.width), // Use the custom widths
                    body: tableBody
                },
                layout: {
                    // No float accepted
                    hLineWidth: function() { return 1; },
                    vLineWidth: function() { return 1; },
                    paddingLeft: function() { return 2; },
                    paddingRight: function() { return 2; },
                    paddingTop: function() { return 2; },
                    paddingBottom: function() { return 2; }
                }
            });
        
            pdfMake.createPdf(docDefinition).download();
        },
        
        


        _createColumnConfig: function() {
            return this.byId("table").getColumns().map(function(oColumn) {
                const labels = oColumn.getMultiLabels();
                
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
