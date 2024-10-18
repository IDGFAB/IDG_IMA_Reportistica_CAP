sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/CustomData",
    "sap/ui/model/json/JSONModel",
    "sap/ui/table/Table",
    "sap/ui/table/RowSettings",
    "sap/ui/table/Column",
    "sap/m/Text",
    "sap/ui/core/Item",
    "sap/m/ObjectAttribute",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator", 
    "sap/ui/core/util/ExportTypeCSV",
],
function (Controller, CustomData, JSONModel, Table, RowSettings, Column, Text, Item, ObjectAttribute, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("imareport23.controller.Homepage", {
        onInit: function () {
             var oModel = new JSONModel();
             this.getView().setModel(new JSONModel(), 'selectedFiltersModel')
             // Loading the mock data that Steve has built

             // Setting the model with the new incoming data
            this.getView().setModel(new JSONModel(), 'DataIMA23')
            // Making the "/matchDataFIlter" to check before the data are printed
            let oSelectedFiltersModel = this.getView().getModel('selectedFiltersModel');

            oSelectedFiltersModel.setProperty("/matchData", false);
 
            // Creating the filters model
            this._createFiltersModel()
            this._getDataFilters();
            
             // Set the data to the model
             this.getView().setModel(oModel, "repo23Model");
 
         },

         onAfterRendering: function () {
            // this.addEmptyToSelect();
            this.makeTitleObjAttrBold();
        },

         // TODO: adapt the datas to be filtered for the report 23
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

        // TODO: Adapt the report 23 data values from the incoming Hana table action
        _getDataFilters: function () {
            this.osUrl = this.getOwnerComponent().getModel().sServiceUrl;
            const servicePath = `${this.osUrl}Filters`;  // Append the action name with a trailing slash

            axios.post(servicePath)
                .then((response) => {
                    console.log(response.data);  // Handle the response array
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
 
         _initializeTables: function () {
             var aTableData = this.getview().getModel("repo23Model").getData();
             // this._createDynamicTable(aTableData); // Temporary disabled
         },

         // TODO: Probably uneuseful
         addEmptyToSelect: function () {
             const oView = this.getView();
             const idsToLog = [
                 "scenarioSelection",
                 "entitySelection",
                 "yearSelection",
                 "periodSelection",
                 "icpSelection",
                 "lease_nSelection",
                 "costCenterSelection",
             ]
 
             idsToLog.forEach(id => {
                 const oscenarioSelection = oView.byId(id);
                 oscenarioSelection.insertItem(new Item({
                     key: "",
                     text: ""  // Empty item
                 }), 0);
                 oscenarioSelection.setSelectedKey("");
             })
         },
 
         // TOBEupdated: with the new incoming table data
         _createDynamicTable: function (aTableData) {
             var oTable=this.getView().byId("reportTable")
             oTable.removeAllColumns();
             // var oTable = new Table({
             //     id: "reportTable",
             //     title: null,
             //     visibleRowCount: aTableData.length > 0 ? 18 : 0,
             //     selectionMode: "None"
             // });
 
             // Define the columns dynamically based on the structure
             var aColumns = [
                 { label: "Journal Type", property: "journalType", width: '200px' },
                 { label: "Account", property: "account", width: '230px' },
                 { label: "Debit", property: "debit", width: '150px' },
                 { label: "Credit", property: "credit", width: '150px' },
             ];
 
             // Add columns to the table dynamically
             aColumns.forEach(column => {
                 oTable.addColumn(new Column({
                     label: new Text({ text: column.label }),
                     template: new Text().bindText(column.property),
                     width: column.width
                 }));
             });
 
             // Set the model for the table
             var oTableModel = new JSONModel({ tableRows: aTableData });
             oTable.setModel(oTableModel);
             oTable.bindRows("/tableRows");
             this.setTableHeight(null, oTable)
             // Add the table to the view
             // this.getView().byId("tableContainer").addItem(oTable);
 
             // Call the function to color total rows after the table is created and bound
             this._colorTotalRows();
         },
 
         // TOBeupdated: when the filter data are available
         onSelectionChange: function (oEvent) {
             this.assignReportResume(oEvent);
             this.makeTitleObjAttrBold();

             
            let oSelectedFiltersModel = this.getView().getModel('selectedFiltersModel');
            let oSelectedFilters = oSelectedFiltersModel.getData();
             
            // Make the "/allSelected" to enable the buttons 
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

            // Check if all required filters are selected
            let allSelected =
                oSelectedFilters.Periodo &&
                    oSelectedFilters.Anno &&
                    oSelectedFilters.ID_STORICO &&
                    (oSelectedFilters.TipoContratto && oSelectedFilters.TipoContratto.length > 0) &&
                    (oSelectedFilters.Entity && oSelectedFilters.Entity.length > 0) ? true : false;

            // Update allSelected property
            oSelectedFiltersModel.setProperty("/allSelected", allSelected);
 
         },
 
         assignReportResume: function (oEvent) {
            const selectedSelectObj = oEvent.getSource();
            const selectedNameString = selectedSelectObj ? selectedSelectObj.getLabels()[0].getText() : "";
            let selectedItemsText = "";

            if (selectedSelectObj.getMetadata().getName() === "sap.m.MultiComboBox") {
                // Handle MultiComboBox
                selectedItemsText = selectedSelectObj.getSelectedItems()
                    .map(item => item.getText())
                    .join(", ");
            } else if (selectedSelectObj.getMetadata().getName() === "sap.m.Select") {
                // Handle Select
                const selectedItem = selectedSelectObj.getSelectedItem();
                selectedItemsText = selectedItem ? selectedItem.getText() : "";
            } else if (selectedSelectObj.getMetadata().getName() === "sap.m.ComboBox") {
                // Handle ComboBox
                const selectedItem = selectedSelectObj.getSelectedItem();
                selectedItemsText = selectedItem ? selectedItem.getText() : "";
            }

            // Entering in the elements of the resume in the header of the DynamicPage 
            const resumeAttributesWrapperElements = this.getView().byId("hLayout");
            const attributesContent = resumeAttributesWrapperElements.getContent();

            attributesContent.forEach(content => {
                const objectAttributes = content.getContent();

                objectAttributes.forEach(objAttr => {
                    if (objAttr instanceof ObjectAttribute) {

                        // Checks between the name of the ObjectAttribute {text:""} and the <Select label="">
                        if (objAttr.getTitle().toLowerCase() === selectedNameString.toLowerCase()) {
                            objAttr.setText(selectedItemsText);

                            // This .rerender() forces the element to be rendered right away (try removing it)
                            objAttr.rerender();
                        }

                    }
                })

            })
 
         },
 
         // TOBEchanged
         applyFilters: function () {
             const oTable = this.getView().byId("tableContainer").getItems()[0];
             const aFilters = [];
 
             this.filterArray.forEach(obj => {
                 const filterParent = Object.keys(obj)[0];
                 const filterValue = obj[filterParent];
 
                 if (filterValue) {
                     let newFilter = new Filter({
                         path: filterParent,
                         value1: filterValue,
                         FilterOperator: FilterOperator.EQ,
                     })
                     aFilters.push(newFilter)
                 }
             });
 
             const combinedFilter = new Filter({
                 filters: aFilters,
                 and: true,
             })
 
             const binding = oTable.getBinding("rows");
             binding.filter(combinedFilter)
         },
 
         //TOBEfixed
         _colorTotalRows: function () {
             var oTable = this.getView().byId("tableContainer").getItems()[0]; // Get the first table in the container
             var fnApplyStyles = function () {
                 var aRows = oTable.getRows(); // Get all rows in the table
                 var bIsTotalCategory = false; // Flag to track if it's a total category row
 
                 aRows.forEach(function (oRow) {
                     var oContext = oRow.getBindingContext(); // Get the row's context
                     var $rowDomFix = oRow._mDomRefs.jQuery.row[0]; // Get the DOM reference of the fixed column
                     if (oContext && $rowDomFix) {
                         var sAssetCategory = oContext.getProperty("journalType"); // Get the 'account' property
 
                         // New Asset Category encountered
                         if (sAssetCategory === " ") {
                             bIsTotalCategory = true;
                         } else {
                             bIsTotalCategory = false;
                         }
                         // Apply styles based on whether it's a total row
                         if (bIsTotalCategory) {
 
                             $($rowDomFix).addClass("highlightRow");
                         } else {
                             $($rowDomFix).removeClass("highlightRow");
                         }
                     }
                 });
             };
 
             // Attach the event handler to the rowsUpdated event
             oTable.attachEvent("rowsUpdated", fnApplyStyles);
 
             // Apply styles initially
             fnApplyStyles();
         },
 
         onCloseLegend: function (oEvent) {
             var oPanel = this.byId("legendPanel");
             oPanel.setVisible(false);  // Collapse the panel (similar to closing it)
         },
 
         //TOBEupdated: with the "/allSelected" model
         enableDownloadButtons: function(oEvent, bool) {
             const excelBtn = this.getView().byId("excelBtn");
             const pdfBtn = this.getView().byId("pdfBtn");
 
             
                 excelBtn.setEnabled(bool)
                 pdfBtn.setEnabled(bool)
          
             
         },
 
         // TOBEupdated: with the new data
         onSearch: function () {
              
            this.getTableData()
            
            // Old way to be deleted
            
            /* var sSelectedEntity = this.byId("entitySelection").getSelectedKey();
            var sSelectedPeriod = this.byId("periodSelection").getSelectedKey();
            var sSelectedYear = this.byId("yearSelection").getSelectedKey();
            var sSelectedScenario = this.byId("scenarioSelection").getSelectedKey();
            var sSelectedIcp = this.byId("icpSelection").getSelectedKey();
            var sSelectedLease_n = this.byId("lease_nSelection").getSelectedKey();
            var sSelectedCostCenter= this.byId("costCenterSelection").getSelectedKey();
            var oTable = this.byId("tableContainer");
            var AllIma = this.getView().getModel('repo23Model').getData();
        
            var aFilteredData = AllIma.filter(function(item) {
            console.log(item.Lease_N);
            return (item.Entity == sSelectedEntity) &&
                    (item.Period == sSelectedPeriod) &&
                    (item.Year == sSelectedYear) &&
                    (item.Scenario == sSelectedScenario)&&
                    (item.Icp == sSelectedIcp)&&
                    (item.Lease_N == sSelectedLease_n)&&
                    (item.Cost_Center == sSelectedCostCenter)
            });
        
            
        
            if (aFilteredData.length > 0) {
                var aData = this.transformJsonData(aFilteredData[0]);
        
                this._createDynamicTable(aData);
                // oTable.setModel(oTableModel);
                // oTable.bindRows("/rows");
                this.enableDownloadButtons(null, true);
        
        
                
            } else{
                
                // var oEmptyModel = new JSONModel({ rows: [] });
                // this._createDynamicTable(oEmptyModel);
                var oTable=this.getView().byId("reportTable")
                    oTable.removeAllColumns();
        
                // oTable.setModel(oEmptyModel);
                // oTable.bindRows("/rows");
        
                
                oSelectedFiltersModel.setProperty("/allSelected", false);
            } */
        
 
         },


         getTableData: function () {

            this.getView().byId("tableContainer").setBusy(true)

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
                    this.getView().byId("tableContainer").setBusy(false)
                    oSelectedFiltersModel.setProperty("/matchData", true);
                    console.log(response.data);  // Handle the response array
                    let dataFiltered = this.getView().getModel('DataIMA22');
                    if(typeof response.data === 'object'){
                        let dataArray = []
                        dataArray.push(response.data)
                        
                        if (dataArray && Array.isArray(dataArray)) {
                            // Convert each object in the array
                            if (dataArray[0].value.length > 0) {
                                let processedData = dataArray[0].value.map(this.convertExponentialValues);
                                dataFiltered.setData(processedData);
                                dataFiltered.refresh();
                            } else {
                                console.error("The response contains no data.")
                                sap.m.MessageBox.warning(
                                    "Non ci sono dati con i filtri selezionati.",
                                    {
                                        title: "Nessun risultato",
                                        actions: [sap.m.MessageBox.Action.OK],
                                        onClose: function(oAction) {
                                            // Optional: Add any action to be performed when the message box is closed
                                        }
                                    }
                                );
                            }
                            
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
 
         setTableHeight: function(oEvent, oTable) {
             let iScreenHeight = window.innerHeight;
             let iScreenWidth = window.innerWidth;
 
             oTable.setVisibleRowCountMode("Interactive")
             oTable.setMinAutoRowCount(5)
             
             if (iScreenWidth < 450) {
                 let iRowCount = Math.floor(iScreenHeight / 120);  // Assuming each row is around 120px in height
                 oTable.setVisibleRowCount(iRowCount);
             } else {
                 let iRowCount = Math.floor(iScreenHeight / 80);
                 oTable.setVisibleRowCount(iRowCount);
             }
         },
 
         
        onDownloadExcelPress: function () {
            var oTable = this.byId("tableContainer");  // Reference to the table control
            // var oModel = oTable.getModel();  // Access the model of the table
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
                fileName: 'ExportedData_Reportistica_23.xlsx',  // File name for the exported file
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
             var oTableContainer = this.getView().byId("tableContainer");
             var oTable = oTableContainer.getItems()[0]; // Get the first table in the container
             if (!oTable) {
                 console.error("Table not found!");
                 return;
             }
 
             var oModel = oTable.getModel();
             var aTableRows = oModel.getProperty("/tableRows");
 
             // Define the PDF document structure
             var docDefinition = {
                 pageSize: 'A4',
                 pageOrientation: 'landscape',
                 header: { text: "Report Periodo di Dicembre", style: 'headerStyle' },
                 footer: function (currentPage, pageCount) {
                     return { text: currentPage.toString() + ' of ' + pageCount, alignment: 'right', style: 'footerStyle' };
                 },
                 content: [
                     {
                         table: {
                             headerRows: 1,
                             widths: ['auto', 'auto', 'auto', 'auto'],
                             body: []
                         }
                     }
                 ],
                 styles: {
                     headerStyle: {
                         fontSize: 16,
                         bold: true,
                         alignment: 'center',
                         margin: [0, 10, 0, 10]
                     },
                     columnHeaderStyle: {
                         fontSize: 12,
                         bold: true,
                         fillColor: '#eeeeee',
                         alignment: 'center',
                         margin: [0, 5, 0, 5]
                     },
                     cellStyle: {
                         fontSize: 10,
                         margin: [0, 5, 0, 5]
                     },
                     footerStyle: {
                         fontSize: 8,
                         margin: [0, 10, 10, 0]
                     }
                 }
             };
 
             // Define the table headers
             docDefinition.content[0].table.body.push([
                 { text: "Journal Type", style: 'columnHeaderStyle' },
                 { text: "Account", style: 'columnHeaderStyle' },
                 { text: "Debit", style: 'columnHeaderStyle' },
                 { text: "Credit", style: 'columnHeaderStyle' }
             ]);
 
             // Populate the table with data
             aTableRows.forEach(function (row) {
                 docDefinition.content[0].table.body.push([
                     { text: row.journalType || "", style: 'cellStyle' },
                     { text: row.account || "", style: 'cellStyle' },
                     { text: row.debit || "", style: 'cellStyle' },
                     { text: row.credit || "", style: 'cellStyle' }
                 ]);
             });
 
             // Generate and download the PDF
             pdfMake.createPdf(docDefinition).download("Report.pdf");
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

         /* UTILITIES FNs */
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
        /* UTILITIES FNs */
         
    });
});
