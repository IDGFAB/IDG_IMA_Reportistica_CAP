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
            
             // Set the data to the model
             oModel.setData(jsonData);
             this.getView().setModel(oModel, "repo23Model");
 
             this.fillFiltersData();
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

 
         onAfterRendering: function () {
             this.addEmptyToSelect();
             this.makeTitleObjAttrBold();
             this.checkFilterFieldsAllFilled();
             this.disableFilterStart();
         },
 
         // TODO: Substitute with the "/allSelected" model source

         /* checkFilterFieldsAllFilled: function () {
             // Works dynamically
 
             const oFilterBar = this.getView().byId("filterbar");
             const aFilterItems = oFilterBar.getFilterGroupItems();
             let allValid = true;
 
             this.filterArray = []
 
             aFilterItems.forEach(oFilterGroupItem => {
                 // Getting the selected filter parent `name=""` and the filter selected key 
                 // SO IS IMPORTANT THE NAME OF THE FILTERS
                 let filterParentName = oFilterGroupItem.getControl().getParent().getLabel();
                 let filterNameKey = oFilterGroupItem.getControl().getSelectedKey();
                 this.filterArray.push({ [filterParentName]: filterNameKey })
 
                 const oControl = oFilterGroupItem.getControl();
 
                 if (oControl instanceof sap.m.Select) {
                     const sSelectedKey = oControl.getSelectedKey();
 
                     if (!sSelectedKey) {
                         allValid = false;
                     }
                 }
             });
 
 
             return allValid;  // Return true if all values are valid, false if any are empty
         }, */
 
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
             // TODO: is not setting every value
 
             const selectedSelectObj = oEvent.getSource();
             const selectedNameString = selectedSelectObj ? selectedSelectObj.getName() : "";
             const selectedItemText = selectedSelectObj.getSelectedItem().getText();
 
             // Entering in the elements of the resume in the header of the DynamicPage 
             const resumeAttributesWrapperElements = this.getView().byId("hLayout");
             const attributesContent = resumeAttributesWrapperElements.getContent();
 
             attributesContent.forEach(content => {
                 const objectAttributes = content.getContent();
 
                 objectAttributes.forEach(objAttr => {
                     if (objAttr instanceof ObjectAttribute) {
 
                         // Checks between the name of the ObjectAttribute {text:""} and the <Select name="">
                         if (objAttr.getTitle().toLowerCase() === selectedNameString.toLowerCase()) {
                             objAttr.setText(selectedItemText);
 
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
              
     var sSelectedEntity = this.byId("entitySelection").getSelectedKey();
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
     }
 
             // if (this.checkFilterFieldsAllFilled()) {
             //     const tableContainer = this.getView().byId("tableContainer");
             //     // Check if the container already contains a table with ID 'reportTable'
             //     const existingTable = tableContainer.getItems().find(function (oItem) {
             //         return oItem.getId() === "reportTable";
             //     });
 
             //     // Make the table if it's not existing
             //     if (!existingTable && this.checkFilterFieldsAllFilled()) {
             //         this._initializeTables(this.jsonData);
             //         this.getView().byId("emptyTableText").setVisible(false);
             //         this.enableDownloadButtons(null, true)
             //         this.applyFilters()
             //     } else if (!existingTable && !this.checkFilterFieldsAllFilled()) {
             //         this.getView().byId("emptyTableText").setVisible(true);
             //         existingTable.destroy();
             //         this.enableDownloadButtons(null, false)
             //     } else {
             //         // this.applyFilters();
             //         return;
             //     }
             // }
 
             // const oView = this.getView();
             // const idsToLog = [
             //     "scenarioSelection",
             //     "entitySelection",
             //     "yearSelection",
             //     "periodSelection",
             //     "icpSelection",
             //     "lease_nSelection",
             //     "costCenterSelection",
             // ]
 
             // // Logging them
             // idsToLog.forEach(id => {
             //     const oscenarioSelection = oView.byId(id);
             //     const aSelectedScenarios = oscenarioSelection.getSelectedItem().getText();
 
             // })
 
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
 
         
         onDownloadExcel: function () {
             var oTable = this.getView().byId("tableContainer").getItems()[0]; // Get the table
             var oModel = oTable.getModel(); // Get the table's model data
             var aTableRows = oModel.getProperty("/tableRows"); // Fetch the rows of the table
 
             // Convert data to a worksheet format using SheetJS
             var aoa = [["Journal Type", "Account", "Debit", "Credit"]]; // Header
 
             aTableRows.forEach(function (row) {
                 aoa.push([
                     row.journalType || "",
                     row.account || "",
                     row.debit || "",
                     row.credit || ""
                 ]);
             });
 
             // Create a new Workbook
             var wb = XLSX.utils.book_new();
             var ws = XLSX.utils.aoa_to_sheet(aoa); // Convert array to worksheet
 
             // Append the worksheet to the workbook
             XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
 
             // Export the workbook
             XLSX.writeFile(wb, "tableData.xlsx");
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
