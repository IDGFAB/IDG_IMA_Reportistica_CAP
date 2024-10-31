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

            this._initializeFilters();
            // this.getDataMock(); // Load mock data for table

            this.osUrl = this.getOwnerComponent().getModel().sServiceUrl;

            this._createFiltersModel()

            this._getDataFilters()

            // this.getTableData()

            this.getView().setModel(new JSONModel(), 'DataIMA22')
            // this._bindToolbarText();
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
            
            // ENABLE ONLY FOR DEBUGGING PURPOSES
            // this.onDownloadPdfPress()
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

        onTableSort: function(oEvent) {
            const oColumn = oEvent.getParameter("column");
            const sSortProperty = oColumn.getSortProperty();
            const bDescending = oEvent.getParameter("sortOrder") === "Descending";
         
            // Function to clean numeric values (remove dots and convert to float)
            const cleanNumber = (value) => {
                return parseFloat(String(value).replace(/\./g, ''));
            };
         
            // Create sorter based on column type
            const oSorter = new sap.ui.model.Sorter(sSortProperty, bDescending, false, function(a, b) {
                switch(sSortProperty) {
                    // Numeric columns
                    case "LEASE_N":
                    case "RIGHT_OF_USE":
                    case "ACCUMULATED_DEPRECIATION":
                    case "NET_RIGHT_OF_USE":
                    case "CLOSING_LEASES_LIABILITIES":
                    case "LEASE_LIABILITIES_SHORT_TERM":
                    case "LEASE_LIABILITIES_LONG_TERM":
                    case "YTD_INTEREST":
                    case "LEASE_COST":
                    case "DEPRECIATION":
                    case "GAIN_FX_RATES":
                    case "LOSS_FX_RATES":
                        const valueA = cleanNumber(a);
                        const valueB = cleanNumber(b);
                        
                        if (isNaN(valueA)) return 1;
                        if (isNaN(valueB)) return -1;
                        
                        return valueA - valueB;
         
                    // String columns - case insensitive comparison
                    case "ASSET_CLASS":
                    case "INTERCOMPANY":
                    case "CDC":
                    case "CDC_CODE":
                    case "CONTRACT_CODE":
                    case "ACC_SECTOR":
                    case "CONTRACT_DESCRIPTION":
                    case "MERGED_ENTITY":
                        return String(a).toLowerCase().localeCompare(String(b).toLowerCase());
                        
                    // Default case if property is not listed
                    default:
                        // Try numeric first, fall back to string if not a valid number
                        const numA = cleanNumber(a);
                        const numB = cleanNumber(b);
                        
                        if (!isNaN(numA) && !isNaN(numB)) {
                            return numA - numB;
                        }
                        return String(a).toLowerCase().localeCompare(String(b).toLowerCase());
                }
            });
         
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

            const servicePath = `${this.osUrl}GetTabellaFiltrata`;  // Append the action name with a trailing slash
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

            let isSelectedItemFilled

            switch (controlName) {
                case "ID_STORICO":
                    isSelectedItemFilled = selectedControl.getSelectedKey().length
                    isSelectedItemFilled = true // Deselect to make optional fields upon deletion filterable based on the selected filters
                    
                    if(isSelectedItemFilled){
                        
                        // Resetting the chained models
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

                        // Resetting the chained models
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
                            oSelectedFiltersModel.setProperty("/allSelected", false);
                        })
                    }
                     
                    break;
        
                case "Periodo":                    
                    isSelectedItemFilled = selectedControl.getSelectedKey().length
                    isSelectedItemFilled = true // Deselect to make optional fields upon deletion filterable based on the selected filters
                
                    if(isSelectedItemFilled){

                        // Resetting the chained models
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
                            oSelectedFiltersModel.setProperty("/allSelected", false);
                        })
                    }
                        
                    break;
        
                case "Entity":
                    isSelectedItemFilled = selectedControl.getSelectedKeys().length
                    isSelectedItemFilled = true // Deselect to make optional fields upon deletion filterable based on the selected filters
                    
                    if(isSelectedItemFilled){

                        // Resetting the chained models
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
                            oSelectedFiltersModel.setProperty("/allSelected", false);
                        })
                    }
                     
                    break;
        
                case "CostCenter":
                    isSelectedItemFilled = selectedControl.getSelectedKeys().length
                    isSelectedItemFilled = true // Deselect to make optional fields upon deletion filterable based on the selected filters
                    
                    if(isSelectedItemFilled){
                        
                        // Resetting the chained models
                        filtriSelezionati.TipoContratto = null
                        filtriSelezionati.Contratto = null
                        oSelectedFiltersModel.refresh();

                        const els = [
                            this.getView().byId("TipoContrattoBox"),
                            this.getView().byId("ContrattoBox"),
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
                            oSelectedFiltersModel.setProperty("/allSelected", false);
                        })
                    }
                           
                    break;
        
                case "TipoContratto":                    
                    isSelectedItemFilled = selectedControl.getSelectedKeys().length
                    isSelectedItemFilled = true // Deselect to make optional fields upon deletion filterable based on the selected filters
                
                    if(isSelectedItemFilled){
                        
                        const els = [
                            this.getView().byId("ContrattoBox"),
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
            
            const servicePath = `${this.osUrl}applyFilters`;

            let oSelectedFilters = this.getView().getModel('selectedFiltersModel').getData();

          //  console.log(Object.values(oSelectedFilters.entity));
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
                    oFiltersModel.getData().TipoContratto = this._sortStringArray(response.data.RECNTYPE)
                    oFiltersModel.getData().Contratto = this._sortStringArray(response.data.RECNNR) 
                    }

                if(!requestData.tipoContratto || requestData.tipoContratto.length == 0){
                    oFiltersModel.getData().TipoContratto = this._sortStringArray(response.data.RECNTYPE)
                    oFiltersModel.getData().Contratto = this._sortStringArray(response.data.RECNNR) 
                    
                    }
                if(!requestData.contratto || requestData.contratto.length == 0){
                    oFiltersModel.getData().TipoContratto = this._sortStringArray(response.data.RECNTYPE)
                    oFiltersModel.getData().Contratto = this._sortStringArray(response.data.RECNNR) 
                    }
                   
                console.log(oFiltersModel.getData().Entity)


                

                console.log("Tipo Contratto",oFiltersModel.getData().TipoContratto)
                
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
        
            // Get text values
            const selectedItemsText = concatenatedElementObj ? 
                getSelectedText(concatenatedElementObj) : 
                getSelectedText(selectedSelectObj);
        
            // Update attributes
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

            this.getView().setModel(new JSONModel(), "DataIMA22");
            var arrayFiltrato = []

            // dataFromJSON.allTableData
            //     .filter(el => {
            //         if (el.IDENTASSET === dataFilter.entity &&
            //             el.YEARDUEDATE === dataFilter.year &&
            //             el.PERIODDUEDATE === dataFilter.period) {
            //             arrayFiltrato.push(el)
            //         }
            //     });
            this.getView().getModel("DataIMA22").setData(arrayFiltrato)
            this.getView().getModel("DataIMA22").refresh()

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

            //     const dataFromJSON = this.getView().getModel('DataIMA22');
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
            var oTable = this.byId("table");
            var oBinding = oTable.getBinding("rows");
            let odata = oBinding.getContexts().map(function (oContext) {
                return oContext.getObject();
            });
            
            // ENABLE AND UPDATE THE FOLLOWING CODE LINE ONLY FOR DEBUGGING PURPOSES
            // odata = [{ "ASSET_CLASS": "Guest quarters in benefit", "INTERCOMPANY": "NO", "CDC": "000175AT00", "CDC_CODE": null, "LEASE_N": "", "CONTRACT_CODE": "0000000400001", "ACC_SECTOR": "ATOP", "CONTRACT_DESCRIPTION": "x", "MERGED_ENTITY": "", "RIGHT_OF_USE": "0e+0", "ACCUMULATED_DEPRECIATION": "3.286478e+4", "NET_RIGHT_OF_USE": "0e+0", "CLOSING_LEASES_LIABILITIES": "0e+0", "LEASE_LIABILITIES_SHORT_TERM": "0e+0", "LEASE_LIABILITIES_LONG_TERM": "0e+0", "YTD_INTEREST": "3.331e+1", "LEASE_COST": "3.6e+3", "DEPRECIATION": "3.24323e+3", "GAIN_FX_RATES": 0, "LOSS_FX_RATES": 0}];
            
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
        
            // Create table data
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
        
            // Add table to document
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
        //     this.getView().setModel(oModel, "DataIMA22");
        // }
    });
});
