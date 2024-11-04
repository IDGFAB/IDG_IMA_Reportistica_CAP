sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/Spreadsheet",
    "sap/ui/thirdparty/jquery",
    "sap/m/ObjectAttribute",
    "sap/ui/model/Sorter",
], function (Controller, JSONModel, Spreadsheet, jQuery, ObjectAttribute, Sorter) {
    "use strict";

    return Controller.extend("imareport9.controller.Homepage", {
        onInit: function () {
            // Initialize filters and data
            this.getView().setModel(new JSONModel(), 'selectedFiltersModel')

            this._initializeFilters();
            // this.getDataMock(); // Load mock data for table

            this.osUrl = this.getOwnerComponent().getModel().sServiceUrl;

            this._createFiltersModel()

            this._getDataFilters()

            // this.getTableData() //funzione per dati dinamici

            this.getView().setModel(new JSONModel(), 'DataIMA9')
            // this._bindToolbarText();
            let oSelectedFiltersModel = this.getView().getModel('selectedFiltersModel');

            oSelectedFiltersModel.setProperty("/matchData", false);

            this.entityKeys;
            this.typeContractKeys;
            this.contractKeys;
            this.cdcKeys;
            this.annoKey;
            this.periodoKey;
        },

        onAfterRendering: function () {
            this.makeTitleObjAttrBold();
            this.disableFilterStart();

            const oDataMocked = [{ "ASSET_CLASS": "Guest quarters in benefit", "INTERCOMPANY": "NO", "CDC": "000175AT00", "CDC_CODE": null, "LEASE_N": "", "CONTRACT_CODE": "0000000400001", "ACC_SECTOR": "ATOP", "CONTRACT_DESCRIPTION": "x", "MERGED_ENTITY": "", "RIGHT_OF_USE": "0e+0", "ACCUMULATED_DEPRECIATION": "3.286478e+4", "NET_RIGHT_OF_USE": "0e+0", "CLOSING_LEASES_LIABILITIES": "0e+0", "LEASE_LIABILITIES_SHORT_TERM": "0e+0", "LEASE_LIABILITIES_LONG_TERM": "0e+0", "YTD_INTEREST": "3.331e+1", "LEASE_COST": "3.6e+3", "DEPRECIATION": "3.24323e+3", "GAIN_FX_RATES": 0, "LOSS_FX_RATES": 0}];
        },

        getTableMockData: function() {
            return [
                {
                  "Data": {
                    "Entity": "ILAPAK INTERNATIONAL SA",
                    "Scenario": "Actua",
                    "Period": "December",
                    "Year": 2023,
                    "Currency": "EUR",
                    "Opening": {
                      "Right of Use": {
                        "Total": 99999999,
                        "Building": 17910324,
                        "Cars_in_pool": 278436,
                        "Cars_in_benefit": 450944
                      },
                      "Accumulated Depreciation": {
                        "Total": 6560981,
                        "Building": 6097132,
                        "Cars_in_pool": 223233,
                        "Cars_in_benefit": 240616
                      },
                      "Net Right of Use": {
                        "Total": 12078722,
                        "Building": 11813193,
                        "Cars_in_pool": 55203,
                        "Cars_in_benefit": 210327
                      }
                    },
                    "Movements": {
                      "Amount at transition date": {
                        "Total": null,
                        "Building": null,
                        "Cars_in_pool": null,
                        "Cars_in_benefit": null
                      },
                      "Increase for new contract": {
                        "Total": 28901,
                        "Building": null,
                        "Cars_in_pool": null,
                        "Cars_in_benefit": 28901
                      },
                      "Revaluation (increase for remeasurement)": {
                        "Total": 39253,
                        "Building": null,
                        "Cars_in_pool": 39047,
                        "Cars_in_benefit": 205
                      },
                      "Decrease - Right of Use": {
                        "Total": 58949,
                        "Building": null,
                        "Cars_in_pool": 14984,
                        "Cars_in_benefit": 43965
                      },
                      "Decrease - Accumulated Depreciation": {
                        "Total": 58949,
                        "Building": null,
                        "Cars_in_pool": 14984,
                        "Cars_in_benefit": 43965
                      },
                      "Depreciation": {
                        "Total": 1695290,
                        "Building": 1524283,
                        "Cars_in_pool": 64381,
                        "Cars_in_benefit": 106626
                      }
                    },
                    "Totale": {
                      "Totale": {
                        "Total": 1627137,
                        "Building": 1524283,
                        "Cars_in_pool": 25334,
                        "Cars_in_benefit": 77520
                      }
                    },
                    "Closing": {
                      "Right of Use": {
                        "Total": 18648908,
                        "Building": 17910324,
                        "Cars_in_pool": 302499,
                        "Cars_in_benefit": 436085
                      },
                      "Accumulated Depreciation": {
                        "Total": 8197322,
                        "Building": 7621415,
                        "Cars_in_pool": 272631,
                        "Cars_in_benefit": 303277
                      },
                      "Net Right of Use": {
                        "Total": 10451586,
                        "Building": 10288910,
                        "Cars_in_pool": 29869,
                        "Cars_in_benefit": 132807
                      }
                    }
                  }
                },
                {
                  "Data": {
                    "Entity": "prova 1",
                    "Scenario": "Prova 1",
                    "Period": "November",
                    "Year": 2022,
                    "Currency": "EUR",
                    "Opening": {
                      "Right of Use": {
                        "Total": 888888888,
                        "Building": 345678987678,
                        "Cars_in_pool": 567617200,
                        "Cars_in_benefit": 32422322
                      },
                      "Accumulated Depreciation": {
                        "Total": 6560981,
                        "Building": 6097132,
                        "Cars_in_pool": 999999999,
                        "Cars_in_benefit": 111111111
                      },
                      "Net Right of Use": {
                        "Total": 12078722,
                        "Building": 11813193,
                        "Cars_in_pool": 899999,
                        "Cars_in_benefit": 210327
                      }
                    },
                    "Movements": {
                      "Amount at transition date": {
                        "Total": null,
                        "Building": null,
                        "Cars_in_pool": null,
                        "Cars_in_benefit": null
                      },
                      "Increase for new contract": {
                        "Total": 28901,
                        "Building": null,
                        "Cars_in_pool": null,
                        "Cars_in_benefit": 28901
                      },
                      "Revaluation (increase for remeasurement)": {
                        "Total": 39253,
                        "Building": null,
                        "Cars_in_pool": 39047,
                        "Cars_in_benefit": 205
                      },
                      "Decrease - Right of Use": {
                        "Total": 58949,
                        "Building": null,
                        "Cars_in_pool": 14984,
                        "Cars_in_benefit": 43965
                      },
                      "Decrease - Accumulated Depreciation": {
                        "Total": 58949,
                        "Building": null,
                        "Cars_in_pool": 55555555555555,
                        "Cars_in_benefit": 43965
                      },
                      "Depreciation": {
                        "Total": 1695290,
                        "Building": 999999999999,
                        "Cars_in_pool": 64381,
                        "Cars_in_benefit": 106626
                      }
                    },
                    "Totale": {
                      "Totale": {
                        "Total": 1627137,
                        "Building": 1524283,
                        "Cars_in_pool": 25334,
                        "Cars_in_benefit": 77520
                      }
                    },
                    "Closing": {
                      "Right of Use": {
                        "Total": 18648908,
                        "Building": 17910324,
                        "Cars_in_pool": 302499,
                        "Cars_in_benefit": 436085
                      },
                      "Accumulated Depreciation": {
                        "Total": 8197322,
                        "Building": 7621415,
                        "Cars_in_pool": 272631,
                        "Cars_in_benefit": 303277
                      },
                      "Net Right of Use": {
                        "Total": 10451586,
                        "Building": 10288910,
                        "Cars_in_pool": 29869,
                        "Cars_in_benefit": 132807
                      }
                    }
                  }
                },
                {
                  "Data": {
                    "Entity": "prova 2",
                    "Scenario": "prova 2",
                    "Period": "June",
                    "Year": 2021,
                    "Currency": "EUR",
                    "Opening": {
                      "Right of Use": {
                        "Total": 77777777777,
                        "Building": 17910324,
                        "Cars_in_pool": 278436,
                        "Cars_in_benefit": 450944
                      },
                      "Accumulated Depreciation": {
                        "Total": 6560981,
                        "Building": 6097132,
                        "Cars_in_pool": 223233,
                        "Cars_in_benefit": 240616
                      },
                      "Net Right of Use": {
                        "Total": 12078722,
                        "Building": 11813193,
                        "Cars_in_pool": 55203,
                        "Cars_in_benefit": 210327
                      }
                    },
                    "Movements": {
                      "Amount at transition date": {
                        "Total": null,
                        "Building": null,
                        "Cars_in_pool": null,
                        "Cars_in_benefit": null
                      },
                      "Increase for new contract": {
                        "Total": 28901,
                        "Building": null,
                        "Cars_in_pool": null,
                        "Cars_in_benefit": 28901
                      },
                      "Revaluation (increase for remeasurement)": {
                        "Total": 39253,
                        "Building": null,
                        "Cars_in_pool": 39047,
                        "Cars_in_benefit": 205
                      },
                      "Decrease - Right of Use": {
                        "Total": 58949,
                        "Building": null,
                        "Cars_in_pool": 14984,
                        "Cars_in_benefit": 43965
                      },
                      "Decrease - Accumulated Depreciation": {
                        "Total": 58949,
                        "Building": null,
                        "Cars_in_pool": 14984,
                        "Cars_in_benefit": 43965
                      },
                      "Depreciation": {
                        "Total": 1695290,
                        "Building": 1524283,
                        "Cars_in_pool": 64381,
                        "Cars_in_benefit": 106626
                      }
                    },
                    "Totale": {
                      "Totale": {
                        "Total": 1627137,
                        "Building": 1524283,
                        "Cars_in_pool": 25334,
                        "Cars_in_benefit": 77520
                      }
                    },
                    "Closing": {
                      "Right of Use": {
                        "Total": 18648908,
                        "Building": 17910324,
                        "Cars_in_pool": 302499,
                        "Cars_in_benefit": 436085
                      },
                      "Accumulated Depreciation": {
                        "Total": 8197322,
                        "Building": 7621415,
                        "Cars_in_pool": 272631,
                        "Cars_in_benefit": 303277
                      },
                      "Net Right of Use": {
                        "Total": 10451586,
                        "Building": 10288910,
                        "Cars_in_pool": 29869,
                        "Cars_in_benefit": 132807
                      }
                    }
                  }
                },
                {
                  "Data": {
                    "Entity": "prova 3",
                    "Scenario": "prova 3",
                    "Period": "Febrary",
                    "Year": 2020,
                    "Currency": "EUR",
                    "Opening": {
                      "Right of Use": {
                        "Total": 6666666666,
                        "Building": 17910324,
                        "Cars_in_pool": 278436,
                        "Cars_in_benefit": 450944
                      },
                      "Accumulated Depreciation": {
                        "Total": 6560981,
                        "Building": 6097132,
                        "Cars_in_pool": 223233,
                        "Cars_in_benefit": 240616
                      },
                      "Net Right of Use": {
                        "Total": 12078722,
                        "Building": 11813193,
                        "Cars_in_pool": 55203,
                        "Cars_in_benefit": 210327
                      }
                    },
                    "Movements": {
                      "Amount at transition date": {
                        "Total": null,
                        "Building": null,
                        "Cars_in_pool": null,
                        "Cars_in_benefit": null
                      },
                      "Increase for new contract": {
                        "Total": 28901,
                        "Building": null,
                        "Cars_in_pool": null,
                        "Cars_in_benefit": 28901
                      },
                      "Revaluation (increase for remeasurement)": {
                        "Total": 39253,
                        "Building": null,
                        "Cars_in_pool": 39047,
                        "Cars_in_benefit": 205
                      },
                      "Decrease - Right of Use": {
                        "Total": 58949,
                        "Building": null,
                        "Cars_in_pool": 14984,
                        "Cars_in_benefit": 43965
                      },
                      "Decrease - Accumulated Depreciation": {
                        "Total": 58949,
                        "Building": null,
                        "Cars_in_pool": 14984,
                        "Cars_in_benefit": 43965
                      },
                      "Depreciation": {
                        "Total": 1695290,
                        "Building": 1524283,
                        "Cars_in_pool": 64381,
                        "Cars_in_benefit": 106626
                      }
                    },
                    "Totale": {
                      "Totale": {
                        "Total": 1627137,
                        "Building": 1524283,
                        "Cars_in_pool": 25334,
                        "Cars_in_benefit": 77520
                      }
                    },
                    "Closing": {
                      "Right of Use": {
                        "Total": 18648908,
                        "Building": 17910324,
                        "Cars_in_pool": 302499,
                        "Cars_in_benefit": 436085
                      },
                      "Accumulated Depreciation": {
                        "Total": 8197322,
                        "Building": 7621415,
                        "Cars_in_pool": 272631,
                        "Cars_in_benefit": 303277
                      },
                      "Net Right of Use": {
                        "Total": 10451586,
                        "Building": 10288910,
                        "Cars_in_pool": 29869,
                        "Cars_in_benefit": 132807
                      }
                    }
                  }
                }
              ];
        },

        createSorter: function() {
            return new Sorter("description", false); // false for ascending order
        },

        _createFiltersModel: function () {
            let oFiltersModel = new JSONModel({
                Entity: null,
              //  TipoContratto: null,
              //  Contratto: null,
                Anno: null,
                Periodo: null,
              //  CostCenter: null,
              //  Id_storico:null,
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
                    console.log(response.data);  // Handle the response array
                    let oFiltersModel = this.getView().getModel('oFiltersModel')
                    oFiltersModel.setData(
                        {
                            Entity: this._elaborateEntities(response.data.BUKRS, response.data.BUTXT),
                           // TipoContratto: this._sortStringArray(response.data.RECNTYPE),
                           // Contratto: this._sortStringArray(response.data.RECNNR),
                            Periodo: this._elaboratedMonths(response.data.PERIODDUEDATE),
                            Anno: this._sortStringArray(response.data.YEARDUEDATE),
                           // CostCenter: this._sortStringArray(response.data.CDC),
                           // Id_storico: this._sortStringArray(response.data.ID_STORICO)
                        }
                    )
                    console.log('Filters data: ', oFiltersModel.getData());
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



            console.log(Object.values(oSelectedFilters.entity));
            const requestData = {
                entity: Object.values(oSelectedFilters.entity),
              //  tipoContratto: Object.values(oSelectedFilters.tipoContratto),
              //  contratto: oSelectedFilters.contratto ? Object.values(oSelectedFilters.contratto) : null, // Campo opzionale
                year: oSelectedFilters.year,
                period: oSelectedFilters.period,
              //  costCenter: oSelectedFilters.costCenter ? Object.values(oSelectedFilters.costCenter) : null, // Campo opzionale
              //  Id_storico: oSelectedFilters.ID_STORICO,
            }

            const servicePath = `${this.osUrl}GetTabellaFiltrata9`;  // Append the action name with a trailing slash
            axios.post(servicePath,  requestData)
                .then((response) => {
                    this.getView().byId("table").setBusy(false)
                    oSelectedFiltersModel.setProperty("/matchData", true);
                    console.log(response.data);  // Handle the response array
                    let dataFiltered = this.getView().getModel('DataIMA9');
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
            console.log("selected control", selectedControl)
            console.log("control name", controlName)

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

            // Check if all required filters are selected
            let allSelected =
                oSelectedFilters.Periodo &&
                    oSelectedFilters.Anno &&
                    //oSelectedFilters.ID_STORICO &&
                 //   (oSelectedFilters.TipoContratto && oSelectedFilters.TipoContratto.length > 0) &&
                    (oSelectedFilters.Entity && oSelectedFilters.Entity.length > 0) ? true : false;

            // Update allSelected property
            oSelectedFiltersModel.setProperty("/allSelected", allSelected);



            this.clearFilter(oEvent)



            this.selectFiltering();

            // this._bindToolbarText(); // Update toolbar text

            // if (allSelected) {
            //     this.setEnabledDownload(true);
            // } else {
            //     this.setEnabledDownload(false);
            // }
        },

       clearFilter: function(oEvent) {

            let oSelectedFiltersModel = this.getView().getModel('selectedFiltersModel');
            let filtriSelezionati = oSelectedFiltersModel.getData();

            const selectedControl = oEvent.getSource();
            const controlName = selectedControl.getName();

            let aPreviousSelectedKeys = filtriSelezionati[controlName] || [];
            console.log("vecchie chiavi", aPreviousSelectedKeys)

            switch (controlName) {
                case "Entity":
                    if(this.entityKeys == undefined){
                        let aSelectedKeys = selectedControl.getSelectedKeys();
                        this.entityKeys = aSelectedKeys.length
                    } else {
                        const els = [
                         //   this.getView().byId("TipoContrattoBox"),
                         //   this.getView().byId("ContrattoBox"),
                            this.getView().byId("AnnoSelect"),
                            this.getView().byId("PeriodoSelect"),
                         //   this.getView().byId("CostCenterBox"),
                         //   this.getView().byId("IdStoricoSelect")
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
                //     if(this.typeContractKeys == undefined){
                //         let aSelectedKeys = selectedControl.getSelectedKeys();
                //         this.typeContractKeys = aSelectedKeys.length

                //     } else {
                //         const els = [
                //             this.getView().byId("ContrattoBox"),
                //             this.getView().byId("AnnoSelect"),
                //             this.getView().byId("PeriodoSelect"),
                //             this.getView().byId("CostCenterBox"),
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
        
                // case "Contratto":                    
                //     if(this.contractKeys == undefined){
                //         let aSelectedKeys = selectedControl.getSelectedKeys();
                //         this.contractKeys = aSelectedKeys.length
                //     } else {
                //         const els = [
                //             this.getView().byId("AnnoSelect"),
                //             this.getView().byId("PeriodoSelect"),
                //             this.getView().byId("CostCenterBox"),
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
        
                case "Anno":
                    if(this.annoKey == undefined){
                        let aSelectedKey = selectedControl.getSelectedKey();
                        this.annoKey = aSelectedKey
                    } else {
                        const els = [
                            this.getView().byId("PeriodoSelect"),
                            // this.getView().byId("CostCenterBox"),
                            // this.getView().byId("IdStoricoSelect")
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
                    if(this.periodoKey == undefined){
                        let aSelectedKey = selectedControl.getSelectedKey();
                        this.periodoKey = aSelectedKey
                    } else {
                        const els = [
                            // this.getView().byId("CostCenterBox"),
                            // this.getView().byId("IdStoricoSelect")
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
                //     if(this.cdcKeys == undefined){
                //         let aSelectedKeys = selectedControl.getSelectedKeys();
                //         this.cdcKeys = aSelectedKeys.length
                //     } else {
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
                
                // case "ID_STORICO":
                // break;
                default:
                    console.error("default, errore nello switch")
                    break;
            }

        }, 

        selectFiltering: function() {
            
            const servicePath = `${this.osUrl}applyFilters9`;

            let oSelectedFilters = this.getView().getModel('selectedFiltersModel').getData();

            console.log(Object.values(oSelectedFilters.entity));
            const requestData = {
                entity: Object.values(oSelectedFilters.entity),
                // tipoContratto: oSelectedFilters.tipoContratto ? Object.values(oSelectedFilters.tipoContratto) : null,
                // contratto: oSelectedFilters.contratto ? Object.values(oSelectedFilters.contratto) : null, // Campo opzionale
                year: oSelectedFilters.year,
                period: oSelectedFilters.period,
                // costCenter: oSelectedFilters.costCenter ? Object.values(oSelectedFilters.costCenter) : null, // Campo opzionale
                // Id_storico: oSelectedFilters.ID_STORICO,
            }

            axios.post(servicePath, requestData)
            .then((response) => {
                console.log("dati filtrati test", response.data);  // Handle the response array
                let oFiltersModel = this.getView().getModel('oFiltersModel')
              
                // if(!requestData.tipoContratto || requestData.tipoContratto.length == 0){
                // oFiltersModel.getData().TipoContratto = this._sortStringArray(response.data.RECNTYPE)
                // oFiltersModel.getData().Contratto = this._sortStringArray(response.data.RECNNR)
                // oFiltersModel.getData().Anno = this._sortStringArray(response.data.YEARDUEDATE)
                // oFiltersModel.getData().Periodo = this._elaboratedMonths(response.data.PERIODDUEDATE)
                // oFiltersModel.getData().CostCenter = this._sortStringArray(response.data.CDC)
                // oFiltersModel.getData().Id_storico = this._sortStringArray(response.data.ID_STORICO)
                
                // }
                
                // if(!requestData.contratto || requestData.contratto.length == 0){
                //     oFiltersModel.getData().Contratto = this._sortStringArray(response.data.RECNNR)
                //     oFiltersModel.getData().Anno = this._sortStringArray(response.data.YEARDUEDATE)
                //     oFiltersModel.getData().Periodo = this._elaboratedMonths(response.data.PERIODDUEDATE)
                //     oFiltersModel.getData().CostCenter = this._sortStringArray(response.data.CDC)
                //     oFiltersModel.getData().Id_storico = this._sortStringArray(response.data.ID_STORICO)
                    
                //     }

                    if(!requestData.year){
                        oFiltersModel.getData().Anno = this._sortStringArray(response.data.YEARDUEDATE)
                        oFiltersModel.getData().Periodo = this._elaboratedMonths(response.data.PERIODDUEDATE)
                        // oFiltersModel.getData().CostCenter = this._sortStringArray(response.data.CDC)
                        // oFiltersModel.getData().Id_storico = this._sortStringArray(response.data.ID_STORICO)
                        
                        }

                if(!requestData.period){
                    oFiltersModel.getData().Periodo = this._elaboratedMonths(response.data.PERIODDUEDATE)
                    // oFiltersModel.getData().CostCenter = this._sortStringArray(response.data.CDC)
                    // oFiltersModel.getData().Id_storico = this._sortStringArray(response.data.ID_STORICO)
                    
                    }

                // if(!requestData.costCenter || requestData.costCenter.length == 0){
                //     oFiltersModel.getData().CostCenter = this._sortStringArray(response.data.CDC)
                //     oFiltersModel.getData().Id_storico = this._sortStringArray(response.data.ID_STORICO)
                    
                //     }
                // if(!requestData.Id_storico){
                //     oFiltersModel.getData().Id_storico = this._sortStringArray(response.data.ID_STORICO)
                    
                //     }
                   
                console.log(oFiltersModel.getData().Entity)


                

               // console.log("Tipo Contratto",oFiltersModel.getData().TipoContratto)
                
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
                console.log('Filters data: ', oFiltersModel.getData());
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
                // Set the text for the selected item and the concatenated element
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
            console.log("Filters data: ", this.getView().getModel('oFiltersModel'));


        },

        _matchData: function () {
            let dataFilter = this.getView().getModel('selectedFiltersModel').getData();
            // let dataFromJSON = this.getView().getModel('tableModel').getData();

            // console.log(dataFilter, dataFromJSON);
            this.getView().setModel(new JSONModel(), "DataIMA9");
            var arrayFiltrato = []

            // dataFromJSON.allTableData
            //     .filter(el => {
            //         if (el.IDENTASSET === dataFilter.entity &&
            //             el.YEARDUEDATE === dataFilter.year &&
            //             el.PERIODDUEDATE === dataFilter.period) {
            //             arrayFiltrato.push(el)
            //         }
            //     });
            this.getView().getModel("DataIMA9").setData(arrayFiltrato)
            this.getView().getModel("DataIMA9").refresh()
            console.log(this.getView().getModel("DataIMA9"))

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

            //     const dataFromJSON = this.getView().getModel('DataIMA9');
            //     this._loadData(dataFromJSON); // Load filtered data into table

            // }


            // TOBE re-enabled later with actual data comes
            this.getTableData();
            
            const oData = this.getTableMockData(); // Getting the array of the mock data
            
            // To print  checks if the filters are being filled
            const areFiltersFilled = this.getView().getModel("selectedFiltersModel").getData().allSelected
            var oTable = this.byId("table");
            
            if (areFiltersFilled) {
                this.makeGeneratedTableMockData(oData);
                this.setTableHeight(null, oTable);
            } else {
                var oEmptyModel = new JSONModel({ rows: [] });
                oTable.setModel(oEmptyModel);
                oTable.bindRows("/rows");

            }
        },

        makeGeneratedTableMockData: function(oData) {
            var oTable = this.byId("table");
            const objData = this._prepareData(oData[0].Data);
            
            // Clear existing columns
            oTable.removeAllColumns();
            
            // Define columns
            const columns = [
                { key: "Section", label: "Section", width: "150px", freeze: true },
                { key: "Description", label: "Description", width: "350px", freeze: true },
                { key: "Total", label: "Total", width: "150px" },
                { key: "Building", label: "Building", width: "150px" },
                { key: "Cars_in_pool", label: "Cars_in_pool", width: "150px" },
                { key: "Cars_in_benefit", label: "Cars_in_benefit", width: "150px" }
            ];
        
            // Add columns
            columns.forEach(column => {
                oTable.addColumn(new sap.ui.table.Column({
                    label: new sap.m.Label({ text: column.label }),
                    template: new sap.m.Text({ text: "{" + column.key + "}" }),
                    width: column.width,
                    sorted: false,
                    filtered: false,
                    freezed: column.freeze
                }));
            });
        
            // Create and set model
            const oTableModel = new JSONModel({
                rows: objData
            });
            
            // Set size limit to handle all rows
            oTableModel.setSizeLimit(objData.length + 100);
            
            oTable.setModel(oTableModel);
            oTable.bindRows("/rows");
            
            // Adjust visible row count based on data
            const visibleRowCount = Math.min(objData.length, 20); // Maximum 20 rows visible
            oTable.setVisibleRowCount(visibleRowCount);
            
            this.getView().getModel("selectedFiltersModel").setProperty("/matchData", true);
            this._colorTotalRows();

            console.log("Table found:", !!oTable, "Table ID:", oTable?.getId());
        },
        
        _prepareData: function (oData) {
            var aRows = [];
            var lastSection = "";
        
            var sectionsMap = {
                "Opening": ["Right of Use", "Accumulated Depreciation", "Net Right of Use", ""],
                "Movements": [
                    "Amount at transition date", "Increase for new contract", 
                    "Revaluation (increase for remeasurement)",
                    "Decrease - Right of Use", "Decrease - Accumulated Depreciation",
                    "Increase for Mergers - Right of Use", 
                    "Increase for Mergers - Accumulated Depreciation",
                    "Decrease for Mergers - Right of Use", 
                    "Decrease for Mergers - Accumulated Depreciation",
                    "Reverse for Change CDC - Right of Use", 
                    "Recognition for Change CDC - Right of Use",
                    "Reverse for Change CDC - Accumulated Depreciation",
                    "Recognition for Change CDC - Accumulated Depreciation", 
                    "Depreciation"
                ],
                "Totale": ["Totale", ""],
                "Closing": ["Right of Use", "Accumulated Depreciation", "Net Right of Use"]
            };
        
            // Process sections
            Object.keys(sectionsMap).forEach(function (section) {
                sectionsMap[section].forEach(function (description) {
                    // Safely access nested properties
                    var sectionData = oData[section] || {};
                    var descriptionData = sectionData[description] || {};
        
                    // Format number function
                    const formatNumber = (value) => {
                        if (value === undefined || value === null) return "-";
                        if (typeof value === 'number') {
                            return value.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            });
                        }
                        return value;
                    };
        
                    aRows.push({
                        "Section": section === lastSection ? "" : section,
                        "Description": description,
                        "Total": formatNumber(descriptionData.Total),
                        "Building": formatNumber(descriptionData.Building),
                        "Cars_in_pool": formatNumber(descriptionData["Cars_in_pool"]),
                        "Cars_in_benefit": formatNumber(descriptionData["Cars_in_benefit"])
                    });
                    
                    lastSection = section;
                });
            });
        
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
            
            // Separate event handler
            var fnEventHandler = function(oEvent) {
                applyRowStyles();
            };
        
            // Separate styling function
            var applyRowStyles = function() {
                var aRows = oTable.getRows();
                aRows.forEach(function (oRow) {
                    var oContext = oRow.getBindingContext();
                    var $rowDom = oRow._mDomRefs.jQuery.row[1];
                    var $rowDomFix = oRow._mDomRefs.jQuery.row[0];
                    
                    if (oContext && ($rowDom || $rowDomFix)) {
                        var sAssetCategory = oContext.getProperty("Description");
                        var bIsTotalCategory = sAssetCategory === "";
                        
                        if (bIsTotalCategory) {
                            $($rowDom).addClass("highlightRow");
                            $($rowDomFix).addClass("highlightRow");
                        } else {
                            $($rowDom).removeClass("highlightRow");
                            $($rowDomFix).removeClass("highlightRow");
                        }
                    }
                });
            };
        
            // Attach event handler
            oTable.attachEvent("rowsUpdated", fnEventHandler);
            
            // Initial styling
            applyRowStyles();
            this.getView().byId("table").setBusy(false)
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
                            width: "200px",
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
                            width: "200px",
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
          var odata = oBinding.getContexts().map(function (oContext) {
              return oContext.getObject();
          });
      
          // Definiamo le colonne per la nuova tabella
          var columns = [
              "Section", "Description", "Total", "Building", "Cars_in_pool", "Cars_in_benefit"
          ];
      
          var docDefinition = {
              pageSize: 'A4',
              pageOrientation: 'landscape',
              pageMargins: [5, 5, 5, 5],  // Margini minimi
              footer: { text: new Date().toLocaleString(), alignment: 'right', fontSize: 6 },
              content: []
          };
      
          // Creiamo il corpo della tabella
          let tableBody = [];
          
          // Aggiungiamo la riga di intestazione
          tableBody.push(columns.map(col => ({
              text: col.replace(/_/g, " "), // Rimpiazziamo gli underscore con spazi per i titoli
              style: { fontSize: 8, bold: true, alignment: 'center' },
              noWrap: true  // Impedisce il wrapping del testo nelle intestazioni
          })));
      
          // Aggiungiamo le righe di dati
          odata.forEach(function (rowData) {
              let row = columns.map(col => ({
                  text: String(rowData[col] || "-").substring(0, 20), // Limitiamo la lunghezza del testo
                  style: { fontSize: 8 },
                  noWrap: true  // Impedisce il wrapping del testo nelle celle
              }));
              tableBody.push(row);
          });
      
          // Aggiungiamo la tabella al documento
          docDefinition.content.push({
              table: {
                  headerRows: 1,
                  widths: Array(columns.length).fill(90),  // Larghezza fissa per tutte le colonne
                  body: tableBody
              },
              layout: {
                  paddingLeft: function() { return 2; },
                  paddingRight: function() { return 2; },
                  paddingTop: function() { return 2; },
                  paddingBottom: function() { return 2; }
              }
          });
      
          pdfMake.createPdf(docDefinition).download();
      },
      

        _createColumnConfig: function () {
            var oTable = this.byId("table");
            var aColumns = oTable.getColumns();
            return aColumns.map(oColumn => ({
                label: oColumn.getLabel().getText(),
                property: oColumn.getLabel().getText(),
                type: 'string'
            }));
        },
    
    });
});
