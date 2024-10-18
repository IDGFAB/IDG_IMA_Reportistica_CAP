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
            var jsonData = [
             {
                 "Scenario": "Actual",
                   "Entity": "ILAPAK INTERNATIONAL SA",
                   "Year": 2023,
                   "Period": "December",
                   "Icp": "ICP Top",
                   "Lease_N": "Totale Custom2",
                   "Cost_Center": "Totale Custom5",
                   "Data": {
                      "Land": null,
                     "Building": {
                       "FX Effect on Opening": {
                         "Lease Liabilities Long Term": {
                           "Debit": null,
                           "Credit": 99999999999999
                         },
                         "Loss FX Rates": {
                           "Debit": 913643,
                           "Credit": null
                         }
                       },
                       "Depreciation RoU": {
                         "Depreciation": {
                           "Debit": 1767562,
                           "Credit": null
                         },
                         "Accumulated Depreciation": {
                           "Debit": null,
                           "Credit": 1524283
                         },
                         "Gain FX Rates": {
                           "Debit": null,
                           "Credit": 243280
                         }
                       },
                       "Reclass Liab. Current Portion": {
                         "Lease Liabilities Long Term": {
                           "Debit": 1819554,
                           "Credit": null
                         },
                         "Lease Liabilities Short Term": {
                           "Debit": null,
                           "Credit": 1819554
                         }
                       },
                       "Interest Accrued": {
                         "YTD Interest": {
                           "Debit": 470162,
                           "Credit": null
                         },
                         "Interest Accrued": {
                           "Debit": null,
                           "Credit": 493414
                         },
                         "Loss FX Rates": {
                           "Debit": 23252,
                           "Credit": null
                         }
                       },
                       "Reverse Lease Cost": {
                         "Lease Cost": {
                           "Debit": null,
                           "Credit": 2146149
                         },
                         "Other Liabilities": {
                           "Debit": 2252287,
                           "Credit": null
                         }
                       },
                       "Payment Interest": {
                         "Lease Liabilities Long Term": {
                           "Debit": null,
                           "Credit": 493414
                         },
                         "Interest Accrued": {
                           "Debit": 493414,
                           "Credit": null
                         }
                       },
                       "Payment & Liab. Amortization": {
                         "Lease Liabilities Long Term": {
                           "Debit": 2252287,
                           "Credit": null
                         },
                         "Other Liabilities": {
                           "Debit": null,
                           "Credit": 2252287
                         }
                       },
                       "Guest quarters in pool": null,
                       "Guest quarters in benefit": null,
                       "Garage in pool": null,
                       "Garage in benefit": null
                     },
                     "Cars in pool":{
                         "FX Effect on Opening":{
                             "Lease Liabilities Long Term":{
                                 "Debit": null,
                                 "Credit": 3724
                             },
                             "Loss FX Rates":{
                                 "Debit": 3724,
                                 "Credit": null
                             }
                         },
                         "R.o.U Remeasurement":{
                             "Right of Use":{
                                 "Debit": 42711,
                                 "Credit": null
                             },
                             "Lease Liabilities Long Term":{
                                 "Debit": null,
                                 "Credit": 42711
                             }
                         },
                         "R.o.U Remeasurement Inflaction":{
                             "Right of Use":{
                                 "Debit": null,
                                 "Credit": 3664
                             },
                             "Lease Liabilities Long Term":{
                                 "Debit": 3664,
                                 "Credit": null
                             }
                         },
                         "RoU & Accumulated Depreciation DeRecognition":{
                             "Right of Use":{
                                 "Debit": null,
                                 "Credit": 14984
                             },
                             "Accumulated Depreciation":{
                                 "Debit": 14984,
                                 "Credit": null
                             }
                         },
                         "Depreciation RoU":{
                             "Depreciation":{
                                 "Debit": 62657,
                                 "Credit": null
                             },
                             "Accumulated Depreciation":{
                                 "Debit": null,
                                 "Credit": 64381
                             },
                             "Gain FX Rates":{
                                 "Debit": null,
                                 "Credit": 276
                             },
                             "Loss FX Rates":{
                                 "Debit": 2000,
                                 "Credit": null
                             }
                         },
                         "Reclass Liab. Current Portion":{
                             "Lease Liabilities Long Term":{
                                 "Debit": 40070,
                                 "Credit": null
                             },
                             "Lease Liabilities Short Term":{
                                 "Debit": null,
                                 "Credit": 40070
                             }
                         },
                         "Interest Accrued":{
                             "YTD Interest":{
                                 "Debit": 904,
                                 "Credit": null
                             },
                             "Interest Accrued":{
                                 "Debit": null,
                                 "Credit": 948
                             },
                             "Loss FX Rates":{
                                 "Debit": 43,
                                 "Credit": null
                             }
                         },
                         "Reverse Lease Cost":{
                             "Lease Cost":{
                                 "Debit": null,
                                 "Credit": 63652
                             },
                             "Other Liabilities":{
                                 "Debit": 66688,
                                 "Credit": null
                             },
                             "Gain FX Rates":{
                                 "Debit": null,
                                 "Credit": 3036
                             }
                         },
                         "Payment Interest":{
                             "Lease Liabilities Long Term":{
                                 "Debit": null,
                                 "Credit": 948
                             },
                             "Interest Accrued":{
                                 "Debit": 948,
                                 "Credit": null
                             }
                         },
                         "Payment & Liab. Amortization":{
                             "Lease Liabilities Long Term":{
                                 "Debit": 66688,
                                 "Credit": null
                             },
                             "Other Liabilities":{
                                 "Debit": null,
                                 "Credit": 66688
                             }
                         },
                     },
                     "Cars in benefit":{
                         "RoU initial Recognition":{
                             "Right of Use": {
                                 "Debit": 28901,
                                 "Credit": null
                             },
                             "Lease Liabilities Long Term": {
                                 "Debit": null,
                                 "Credit": 28901
                             }
                         },
                         "FX Effect on Opening":{
                             "Lease Liabilities Long Term": {
                                 "Debit": null,
                                 "Credit": 6338
                             },
                             "Loss FX Rates": {
                                 "Debit": 6338,
                                 "Credit": null
                             }
                         },
                         "R.o.U Remeasurement":{
                             "Right of Use": {
                                 "Debit": 9435,
                                 "Credit": 8924
                             },
                             "Lease Liabilities Long Term": {
                                 "Debit": 8924,
                                 "Credit": 9435
                             }
                         },
                         "R.o.U Remeasurement Inflaction":{
                             "Right of Use": {
                                 "Debit": null,
                                 "Credit": 305
                             },
                             "Lease Liabilities Long Term": {
                                 "Debit": 305,
                                 "Credit": null
                             }
                         },
                         "RoU & Accumulated Depreciation DeRecognition":{
                             "Right of Use": {
                                 "Debit": null,
                                 "Credit": 26278
                             },
                             "Accumulated Depreciation": {
                                 "Debit": 26278,
                                 "Credit": null
                             }
                         },
                         "Depreciation RoU":{
                             "Depreciation": {
                                 "Debit": 107380,
                                 "Credit": null
                             },
                             "Accumulated Depreciation": {
                                 "Debit": null,
                                 "Credit": 106626
                             },
                             "Gain FX Rates": {
                                 "Debit": null,
                                 "Credit": 1012
                             },
                             "Loss FX Rates": {
                                 "Debit": 258,
                                 "Credit": null
                             }
                         },
                         "Reclass Liab. Current Portion":{
                             "Lease Liabilities Long Term": {
                                 "Debit": 79680,
                                 "Credit": null
                             },
                             "Lease Liabilities Short Term": {
                                 "Debit": null,
                                 "Credit": 79680
                             }
                         },
                         "Interest Accrued":{
                             "YTD Interest": {
                                 "Debit": 2703,
                                 "Credit": null
                             },
                             "Interest Accrued": {
                                 "Debit": null,
                                 "Credit": 2790
                             },
                             "Loss FX Rates": {
                                 "Debit": 87,
                                 "Credit": null
                             }
                         },
                         "Reverse Lease Cost":{
                             "Lease Cost": {
                                 "Debit": null,
                                 "Credit": 110076
                             },
                             "Other Liabilities": {
                                 "Debit": 112192,
                                 "Credit": null
                             },
                             "Gain FX Rates": {
                                 "Debit": null,
                                 "Credit": 2116
                             }
                         },
                         "Earlier Termination":{
                             "Right of Use": {
                                 "Debit": null,
                                 "Credit": 17687
                             },
                             "Accumulated Depreciation": {
                                 "Debit": 17687,
                                 "Credit": null
                             }
                         },
                         "Payment Interest":{
                             "Lease Liabilities Long Term": {
                                 "Debit": null,
                                 "Credit": 2790
                             },
                             "Interest Accrued": {
                                 "Debit": 2790,
                                 "Credit": null
                             }
                         },
                         "Payment & Liab. Amortization":{
                             "Lease Liabilities Long Term":{
                                 "Debit": 112192,
                                 "Credit": null
                             },
                             "Other Liabilities":{
                                 "Debit": null,
                                 "Credit": 112192
                             }
                         },
                         "Other motor vehicles": null,
                         "In house handling equipment": null,
                         "Productive machinery": null,
                         "Other productive equipment": null,
                         "Hardware": null,
                         "Other Asset": null
                         },
                         "Total Asset Category": {
                             "RoU initial Recognition":{
                                 "Right of Use":{
                                     "Debit": 28901,
                                     "Credit": null
                                 },
                                 "Lease Liabilities Long Term":{
                                     "Debit": null,
                                     "Credit": 28901
                                 },
                                 "Initial maxi rent-quota":{
                                     "Debit": null,
                                     "Credit": null
                                 },
                                 "Initial direct costs or takeover costs":{
                                     "Debit": null,
                                     "Credit": null
                                 },
                                 "Incentives received -":{
                                     "Debit": null,
                                     "Credit": null
                                 },
                                 "Other Initial Costs not included in Liabilities":{
                                     "Debit": null,
                                     "Credit": null
                                 },
                                 "Removal / dismantling Cost":{
                                     "Debit": null,
                                     "Credit": null
                                 },
                                 "Gain FX Rates":{
                                     "Debit": null,
                                     "Credit": null
                                 },
                                 "Loss FX Rates":{
                                     "Debit": null,
                                     "Credit": null
                                 },
                                 "Equity Account for Asset Retrospective":{
                                     "Debit": null,
                                     "Credit": null
                                 }
                             },
                             "FX Effect on Opening":{
                                 "Lease Liabilities Long Term":{
                                     "Debit": null,
                                     "Credit": 923705
                                 },
                                 "Loss FX Rates":{
                                     "Debit": 923705,
                                     "Credit": null
                                 }
                             },
                             "R.o.U Remeasurement":{
                                 "Right of Use":{
                                     "Debit": 52146,
                                     "Credit": 8924
                                 },
                                 "Lease Liabilities Long Term":{
                                     "Debit": 8924,
                                     "Credit": 52146
                                 }
                             },
                             "R.o.U Remeasurement Inflaction":{
                                 "Right of Use":{
                                     "Debit": null,
                                     "Credit": 3969
                                 },
                                 "Lease Liabilities Long Term":{
                                     "Debit": 3969,
                                     "Credit": null
                                 }
                             },
                             "RoU & Accumulated Depreciation DeRecognition":{
                                 "Right of Use":{
                                     "Debit": null,
                                     "Credit": 41262
                                 },
                                 "Accumulated Depreciation":{
                                     "Debit": 41262,
                                     "Credit": null
                                 }
                             },
                             "Depreciation RoU":{
                                 "Depreciation":{
                                     "Debit": 1937599,
                                     "Credit": null
                                 },
                                 "Accumulated Depreciation":{
                                     "Debit": null,
                                     "Credit": 1695290
                                 },
                                 "Gain FX Rates":{
                                     "Debit": null,
                                     "Credit": 244568
                                 },
                                 "Loss FX Rates":{
                                     "Debit": 2259,
                                     "Credit": null
                                 },
                                 "Difference for Mergers":{
                                     "Debit": null,
                                     "Credit": null
                                 }
                             },
                             "Reclass Liab. Current Portion":{
                                 "Lease Liabilities Long Term":{
                                     "Debit": 1939304,
                                     "Credit": null
                                 },
                                 "Lease Liabilities Short Term":{
                                     "Debit": null,
                                     "Credit": 1939304
                                 }
                             },
                             "Interest Accrued":{
                                 "YTD Interest":{
                                     "Debit": 473769,
                                     "Credit": null
                                 },
                                 "Interest Accrued":{
                                     "Debit": null,
                                     "Credit": 497151
                                 },
                                 "Gain FX Rates":{
                                     "Debit": null,
                                     "Credit": null
                                 },
                                 "Loss FX Rates":{
                                     "Debit": 23382,
                                     "Credit": null
                                 },
                                 "Difference for Mergers":{
                                     "Debit": null,
                                     "Credit": null
                                 }
                             },
                             "Reverse Lease Cost":{
                                 "Lease Cost":{
                                     "Debit": null,
                                     "Credit": 2319877
                                 },
                                 "Other Liabilities":{
                                     "Debit": 2431166,
                                     "Credit": null
                                 },
                                 "Gain FX Rates":{
                                     "Debit": null,
                                     "Credit": 111290
                                 },
                                 "Loss FX Rates":{
                                     "Debit": null,
                                     "Credit": null
                                 }
                             },
                             "Payment & Liab. Amortization":{
                                 "Lease Liabilities Long Term":{
                                     "Debit": 2431166,
                                     "Credit": null
                                 },
                                 "Other Liabilities":{
                                     "Debit": null,
                                     "Credit": 2431166
                                 }
                             },
                             "Payment Interest":{
                                 "Lease Liabilities Long Term":{
                                     "Debit": null,
                                     "Credit": 497151
                                 },
                                 "Interest Accrued":{
                                     "Debit": 497151,
                                     "Credit": null
                                 }
                             },
                             "Earlier Termination":{
                                 "Right of Use":{
                                     "Debit": null,
                                     "Credit": 17687
                                 },
                                 "Accumulated Depreciation":{
                                     "Debit": 17687,
                                     "Credit": null
                                 },
                                 "Lease Liabilities Long Term":{
                                     "Debit": null,
                                     "Credit": null
                                 },
                                 "Lease Liabilities Short Term":{
                                     "Debit": null,
                                     "Credit": null
                                 },
                                 "Gain/Loss for Earlier Termination":{
                                     "Debit": null,
                                     "Credit": null
                                 }
                             }
                         }
                   }
             },
             {
                 "Scenario": "Actual",
                   "Entity": "ILAPAK INTERNATIONAL SA",
                   "Year": 2021,
                   "Period": "Febrary",
                   "Icp": "ICP Top",
                   "Lease_N": "Totale Custom2",
                   "Cost_Center": "Totale Custom5",
                   "Data": {
                      "Land": null,
                     "Building": {
                       "FX Effect on Opening": {
                         "Lease Liabilities Long Term": {
                           "Debit": null,
                           "Credit": 1111111111111111
                         },
                         "Loss FX Rates": {
                           "Debit": 913643,
                           "Credit": null
                         }
                       },
                       "Depreciation RoU": {
                         "Depreciation": {
                           "Debit": 1767562,
                           "Credit": null
                         },
                         "Accumulated Depreciation": {
                           "Debit": null,
                           "Credit": 1524283
                         },
                         "Gain FX Rates": {
                           "Debit": null,
                           "Credit": 243280
                         }
                       },
                       "Reclass Liab. Current Portion": {
                         "Lease Liabilities Long Term": {
                           "Debit": 1819554,
                           "Credit": null
                         },
                         "Lease Liabilities Short Term": {
                           "Debit": null,
                           "Credit": 1819554
                         }
                       },
                       "Interest Accrued": {
                         "YTD Interest": {
                           "Debit": 470162,
                           "Credit": null
                         },
                         "Interest Accrued": {
                           "Debit": null,
                           "Credit": 493414
                         },
                         "Loss FX Rates": {
                           "Debit": 23252,
                           "Credit": null
                         }
                       },
                       "Reverse Lease Cost": {
                         "Lease Cost": {
                           "Debit": null,
                           "Credit": 2146149
                         },
                         "Other Liabilities": {
                           "Debit": 2252287,
                           "Credit": null
                         }
                       },
                       "Payment Interest": {
                         "Lease Liabilities Long Term": {
                           "Debit": null,
                           "Credit": 493414
                         },
                         "Interest Accrued": {
                           "Debit": 493414,
                           "Credit": null
                         }
                       },
                       "Payment & Liab. Amortization": {
                         "Lease Liabilities Long Term": {
                           "Debit": 2252287,
                           "Credit": null
                         },
                         "Other Liabilities": {
                           "Debit": null,
                           "Credit": 2252287
                         }
                       },
                       "Guest quarters in pool": null,
                       "Guest quarters in benefit": null,
                       "Garage in pool": null,
                       "Garage in benefit": null
                     },
                     "Cars in pool":{
                         "FX Effect on Opening":{
                             "Lease Liabilities Long Term":{
                                 "Debit": null,
                                 "Credit": 3724
                             },
                             "Loss FX Rates":{
                                 "Debit": 3724,
                                 "Credit": null
                             }
                         },
                         "R.o.U Remeasurement":{
                             "Right of Use":{
                                 "Debit": 42711,
                                 "Credit": null
                             },
                             "Lease Liabilities Long Term":{
                                 "Debit": null,
                                 "Credit": 42711
                             }
                         },
                         "R.o.U Remeasurement Inflaction":{
                             "Right of Use":{
                                 "Debit": null,
                                 "Credit": 3664
                             },
                             "Lease Liabilities Long Term":{
                                 "Debit": 3664,
                                 "Credit": null
                             }
                         },
                         "RoU & Accumulated Depreciation DeRecognition":{
                             "Right of Use":{
                                 "Debit": null,
                                 "Credit": 14984
                             },
                             "Accumulated Depreciation":{
                                 "Debit": 14984,
                                 "Credit": null
                             }
                         },
                         "Depreciation RoU":{
                             "Depreciation":{
                                 "Debit": 62657,
                                 "Credit": null
                             },
                             "Accumulated Depreciation":{
                                 "Debit": null,
                                 "Credit": 64381
                             },
                             "Gain FX Rates":{
                                 "Debit": null,
                                 "Credit": 276
                             },
                             "Loss FX Rates":{
                                 "Debit": 2000,
                                 "Credit": null
                             }
                         },
                         "Reclass Liab. Current Portion":{
                             "Lease Liabilities Long Term":{
                                 "Debit": 40070,
                                 "Credit": null
                             },
                             "Lease Liabilities Short Term":{
                                 "Debit": null,
                                 "Credit": 40070
                             }
                         },
                         "Interest Accrued":{
                             "YTD Interest":{
                                 "Debit": 904,
                                 "Credit": null
                             },
                             "Interest Accrued":{
                                 "Debit": null,
                                 "Credit": 948
                             },
                             "Loss FX Rates":{
                                 "Debit": 43,
                                 "Credit": null
                             }
                         },
                         "Reverse Lease Cost":{
                             "Lease Cost":{
                                 "Debit": null,
                                 "Credit": 63652
                             },
                             "Other Liabilities":{
                                 "Debit": 66688,
                                 "Credit": null
                             },
                             "Gain FX Rates":{
                                 "Debit": null,
                                 "Credit": 3036
                             }
                         },
                         "Payment Interest":{
                             "Lease Liabilities Long Term":{
                                 "Debit": null,
                                 "Credit": 948
                             },
                             "Interest Accrued":{
                                 "Debit": 948,
                                 "Credit": null
                             }
                         },
                         "Payment & Liab. Amortization":{
                             "Lease Liabilities Long Term":{
                                 "Debit": 66688,
                                 "Credit": null
                             },
                             "Other Liabilities":{
                                 "Debit": null,
                                 "Credit": 66688
                             }
                         },
                     },
                     "Cars in benefit":{
                         "RoU initial Recognition":{
                             "Right of Use": {
                                 "Debit": 28901,
                                 "Credit": null
                             },
                             "Lease Liabilities Long Term": {
                                 "Debit": null,
                                 "Credit": 28901
                             }
                         },
                         "FX Effect on Opening":{
                             "Lease Liabilities Long Term": {
                                 "Debit": null,
                                 "Credit": 6338
                             },
                             "Loss FX Rates": {
                                 "Debit": 6338,
                                 "Credit": null
                             }
                         },
                         "R.o.U Remeasurement":{
                             "Right of Use": {
                                 "Debit": 9435,
                                 "Credit": 8924
                             },
                             "Lease Liabilities Long Term": {
                                 "Debit": 8924,
                                 "Credit": 9435
                             }
                         },
                         "R.o.U Remeasurement Inflaction":{
                             "Right of Use": {
                                 "Debit": null,
                                 "Credit": 305
                             },
                             "Lease Liabilities Long Term": {
                                 "Debit": 305,
                                 "Credit": null
                             }
                         },
                         "RoU & Accumulated Depreciation DeRecognition":{
                             "Right of Use": {
                                 "Debit": null,
                                 "Credit": 26278
                             },
                             "Accumulated Depreciation": {
                                 "Debit": 26278,
                                 "Credit": null
                             }
                         },
                         "Depreciation RoU":{
                             "Depreciation": {
                                 "Debit": 107380,
                                 "Credit": null
                             },
                             "Accumulated Depreciation": {
                                 "Debit": null,
                                 "Credit": 106626
                             },
                             "Gain FX Rates": {
                                 "Debit": null,
                                 "Credit": 1012
                             },
                             "Loss FX Rates": {
                                 "Debit": 258,
                                 "Credit": null
                             }
                         },
                         "Reclass Liab. Current Portion":{
                             "Lease Liabilities Long Term": {
                                 "Debit": 79680,
                                 "Credit": null
                             },
                             "Lease Liabilities Short Term": {
                                 "Debit": null,
                                 "Credit": 79680
                             }
                         },
                         "Interest Accrued":{
                             "YTD Interest": {
                                 "Debit": 2703,
                                 "Credit": null
                             },
                             "Interest Accrued": {
                                 "Debit": null,
                                 "Credit": 2790
                             },
                             "Loss FX Rates": {
                                 "Debit": 87,
                                 "Credit": null
                             }
                         },
                         "Reverse Lease Cost":{
                             "Lease Cost": {
                                 "Debit": null,
                                 "Credit": 110076
                             },
                             "Other Liabilities": {
                                 "Debit": 112192,
                                 "Credit": null
                             },
                             "Gain FX Rates": {
                                 "Debit": null,
                                 "Credit": 2116
                             }
                         },
                         "Earlier Termination":{
                             "Right of Use": {
                                 "Debit": null,
                                 "Credit": 17687
                             },
                             "Accumulated Depreciation": {
                                 "Debit": 17687,
                                 "Credit": null
                             }
                         },
                         "Payment Interest":{
                             "Lease Liabilities Long Term": {
                                 "Debit": null,
                                 "Credit": 2790
                             },
                             "Interest Accrued": {
                                 "Debit": 2790,
                                 "Credit": null
                             }
                         },
                         "Payment & Liab. Amortization":{
                             "Lease Liabilities Long Term":{
                                 "Debit": 112192,
                                 "Credit": null
                             },
                             "Other Liabilities":{
                                 "Debit": null,
                                 "Credit": 112192
                             }
                         },
                         "Other motor vehicles": null,
                         "In house handling equipment": null,
                         "Productive machinery": null,
                         "Other productive equipment": null,
                         "Hardware": null,
                         "Other Asset": null
                         },
                         "Total Asset Category": {
                             "RoU initial Recognition":{
                                 "Right of Use":{
                                     "Debit": 28901,
                                     "Credit": null
                                 },
                                 "Lease Liabilities Long Term":{
                                     "Debit": null,
                                     "Credit": 28901
                                 },
                                 "Initial maxi rent-quota":{
                                     "Debit": null,
                                     "Credit": null
                                 },
                                 "Initial direct costs or takeover costs":{
                                     "Debit": null,
                                     "Credit": null
                                 },
                                 "Incentives received -":{
                                     "Debit": null,
                                     "Credit": null
                                 },
                                 "Other Initial Costs not included in Liabilities":{
                                     "Debit": null,
                                     "Credit": null
                                 },
                                 "Removal / dismantling Cost":{
                                     "Debit": null,
                                     "Credit": null
                                 },
                                 "Gain FX Rates":{
                                     "Debit": null,
                                     "Credit": null
                                 },
                                 "Loss FX Rates":{
                                     "Debit": null,
                                     "Credit": null
                                 },
                                 "Equity Account for Asset Retrospective":{
                                     "Debit": null,
                                     "Credit": null
                                 }
                             },
                             "FX Effect on Opening":{
                                 "Lease Liabilities Long Term":{
                                     "Debit": null,
                                     "Credit": 923705
                                 },
                                 "Loss FX Rates":{
                                     "Debit": 923705,
                                     "Credit": null
                                 }
                             },
                             "R.o.U Remeasurement":{
                                 "Right of Use":{
                                     "Debit": 52146,
                                     "Credit": 8924
                                 },
                                 "Lease Liabilities Long Term":{
                                     "Debit": 8924,
                                     "Credit": 52146
                                 }
                             },
                             "R.o.U Remeasurement Inflaction":{
                                 "Right of Use":{
                                     "Debit": null,
                                     "Credit": 3969
                                 },
                                 "Lease Liabilities Long Term":{
                                     "Debit": 3969,
                                     "Credit": null
                                 }
                             },
                             "RoU & Accumulated Depreciation DeRecognition":{
                                 "Right of Use":{
                                     "Debit": null,
                                     "Credit": 41262
                                 },
                                 "Accumulated Depreciation":{
                                     "Debit": 41262,
                                     "Credit": null
                                 }
                             },
                             "Depreciation RoU":{
                                 "Depreciation":{
                                     "Debit": 1937599,
                                     "Credit": null
                                 },
                                 "Accumulated Depreciation":{
                                     "Debit": null,
                                     "Credit": 1695290
                                 },
                                 "Gain FX Rates":{
                                     "Debit": null,
                                     "Credit": 244568
                                 },
                                 "Loss FX Rates":{
                                     "Debit": 2259,
                                     "Credit": null
                                 },
                                 "Difference for Mergers":{
                                     "Debit": null,
                                     "Credit": null
                                 }
                             },
                             "Reclass Liab. Current Portion":{
                                 "Lease Liabilities Long Term":{
                                     "Debit": 1939304,
                                     "Credit": null
                                 },
                                 "Lease Liabilities Short Term":{
                                     "Debit": null,
                                     "Credit": 1939304
                                 }
                             },
                             "Interest Accrued":{
                                 "YTD Interest":{
                                     "Debit": 473769,
                                     "Credit": null
                                 },
                                 "Interest Accrued":{
                                     "Debit": null,
                                     "Credit": 497151
                                 },
                                 "Gain FX Rates":{
                                     "Debit": null,
                                     "Credit": null
                                 },
                                 "Loss FX Rates":{
                                     "Debit": 23382,
                                     "Credit": null
                                 },
                                 "Difference for Mergers":{
                                     "Debit": null,
                                     "Credit": null
                                 }
                             },
                             "Reverse Lease Cost":{
                                 "Lease Cost":{
                                     "Debit": null,
                                     "Credit": 2319877
                                 },
                                 "Other Liabilities":{
                                     "Debit": 2431166,
                                     "Credit": null
                                 },
                                 "Gain FX Rates":{
                                     "Debit": null,
                                     "Credit": 111290
                                 },
                                 "Loss FX Rates":{
                                     "Debit": null,
                                     "Credit": null
                                 }
                             },
                             "Payment & Liab. Amortization":{
                                 "Lease Liabilities Long Term":{
                                     "Debit": 2431166,
                                     "Credit": null
                                 },
                                 "Other Liabilities":{
                                     "Debit": null,
                                     "Credit": 2431166
                                 }
                             },
                             "Payment Interest":{
                                 "Lease Liabilities Long Term":{
                                     "Debit": null,
                                     "Credit": 497151
                                 },
                                 "Interest Accrued":{
                                     "Debit": 497151,
                                     "Credit": null
                                 }
                             },
                             "Earlier Termination":{
                                 "Right of Use":{
                                     "Debit": null,
                                     "Credit": 17687
                                 },
                                 "Accumulated Depreciation":{
                                     "Debit": 17687,
                                     "Credit": null
                                 },
                                 "Lease Liabilities Long Term":{
                                     "Debit": null,
                                     "Credit": null
                                 },
                                 "Lease Liabilities Short Term":{
                                     "Debit": null,
                                     "Credit": null
                                 },
                                 "Gain/Loss for Earlier Termination":{
                                     "Debit": null,
                                     "Credit": null
                                 }
                             }
                         }
                   }
             }
 
            ]
             var oModel = new JSONModel();
             var filtersModel = new JSONModel();
             // Loading the mock data that Steve has built
 
             // Set the data to the model
             oModel.setData(jsonData);
             this.getView().setModel(oModel, "repo23Model");
 
             var oScenarioModel = new JSONModel({ Scenarios: jsonData.map(item => item.Scenario) });
             var oEntityModel = new JSONModel({ Entities: jsonData.map(item => item.Entity) });
             var oYearModel = new JSONModel({ Years: jsonData.map(item => item.Year) });
             var oPeriodModel = new JSONModel({ Periods: jsonData.map(item => item.Period) });
             var oIcpModel = new JSONModel({ Icps: jsonData.map(item => item.Icp) });
             var oLeaseNModel = new JSONModel({ LeaseNs: jsonData.map(item => item.Lease_N) });
             var oCostCenterModel = new JSONModel({ CostCenters: jsonData.map(item => item.Cost_Center) });
 
             
             this.getView().setModel(oScenarioModel, "ScenarioModel");
             this.getView().setModel(oEntityModel, "EntityModel");
             this.getView().setModel(oYearModel, "YearModel");
             this.getView().setModel(oPeriodModel, "PeriodModel");
             this.getView().setModel(oIcpModel, "IcpModel");
             this.getView().setModel(oLeaseNModel, "LeaseNModel");
             this.getView().setModel(oCostCenterModel, "CostCenterModel");
             // filtersModel.setData(this.jsonData.active_filters);
             // this.getView().setModel(filtersModel, "activeFiltersModel");
             // this._initializeTables(jsonData);
         },
 
         _initializeTables: function (jsonData) {
             // Flatten all sections into one array
             var aTableData = this.transformJsonData(jsonData);
             this._createDynamicTable(aTableData);
         },
 
         transformJsonData: function (jsonData) {
             let aTableRows = [];
 
             // Iterate over each top-level key (e.g., Land, Building, etc.)
             Object.keys(jsonData.Data).forEach(fatherNameString => {
                 let sectionData = jsonData.Data[fatherNameString];
 
                 // Add the section (e.g., "Land" or "Building") as a header row
                 aTableRows.push({
                     journalType: fatherNameString,  // This will serve as the header for the section
                     account: "",  // Empty account field for the header row
                     debit: "",    // Empty debit field for the header row
                     credit: ""    // Empty credit field for the header row
                 });
 
                 // If the section (e.g., "Land") is null, add an empty row
                 if (!sectionData) {
                     aTableRows.push({
                         journalType: " ",  // Empty row below the section header
                         account: " ",
                         debit: " ",
                         credit: " "
                     });
                     return;  // Move to the next section
                 }
 
                 // If sectionData exists, iterate over its inner objects (e.g., "FX Effect on Opening", "Depreciation RoU")
                 let previousJournalType = null;  // Variable to track previous journal type
                 Object.keys(sectionData).forEach(journalType => {
                     let journalData = sectionData[journalType];
 
                     // If journalData is null, insert an empty row for the journal
                     if (!journalData) {
                         aTableRows.push({
                             journalType: journalType,  // Journal Type (e.g., FX Effect on Opening)
                             account: " ",  // Empty account
                             debit: "",    // Empty debit
                             credit: "",   // Empty credit
                         });
                         return;
                     }
 
                     // Iterate over the accounts inside each journal (e.g., "Lease Liabilities Long Term", "Loss FX Rates")
                     Object.keys(journalData).forEach(account => {
                         let debitCreditObjects = journalData[account];
 
                         // Safely extract Debit and Credit, and handle null values
                         const debit = debitCreditObjects?.Debit !== null ? debitCreditObjects.Debit.toLocaleString() : "-";
                         const credit = debitCreditObjects?.Credit !== null ? debitCreditObjects.Credit.toLocaleString() : "-";
 
                         // Determine if we should display the journalType or leave it blank
                         let journalTypeDisplay = previousJournalType === journalType ? "" : journalType;
                         previousJournalType = journalType;
 
                         // Push a row for each account
                         aTableRows.push({
                             journalType: journalTypeDisplay,  // Journal Type (e.g., FX Effect on Opening)
                             account: account,                 // Account (e.g., Lease Liabilities Long Term)
                             debit: debit,                     // Debit amount
                             credit: credit                    // Credit amount
                         });
                     });
                 });
 
                 // After processing a section (e.g., "Building"), insert a separator empty row if needed
                 aTableRows.push({
                     journalType: " ",  // Empty row to act as a separator
                     account: "",
                     debit: "",
                     credit: ""
                 });
             });
 
             return aTableRows;
         },
 
         onAfterRendering: function () {
             this.addEmptyToSelect();
             this.makeTitleObjAttrBold();
             this.checkFilterFieldsAllFilled();
             this.disableFilterStart();
         },
 
         checkFilterFieldsAllFilled: function () {
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
         },
 
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
 
         onSelectionChange: function (oEvent) {
             this.assignReportResume(oEvent);
             this.makeTitleObjAttrBold();
             // Process data and create tables for each section
             this.checkFilterFieldsAllFilled();
 
             if (this.checkFilterFieldsAllFilled()) {
                 this.enableFilterStart(null, true);
             } else {
                 this.enableFilterStart(null, false);
             }
 
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
 
         disableFilterStart: function (oEvent) {
 
             const filterBarEl = this.getView().byId("filterbar");
             const searchButtonEl = filterBarEl._getSearchButton();;
 
             if (searchButtonEl) {
                 searchButtonEl.setEnabled(false);  // Disable the search (or Avvio) button
             }
         },
 
         enableFilterStart: function (oEvent, bool) {
             const filterBarEl = this.getView().byId("filterbar");
             const searchButtonEl = filterBarEl._getSearchButton();;
 
             if (searchButtonEl) {
                 searchButtonEl.setEnabled(bool);  // Disable the search (or Avvio) button
             }
         },
 
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
 
         enableDownloadButtons: function(oEvent, bool) {
             const excelBtn = this.getView().byId("excelBtn");
             const pdfBtn = this.getView().byId("pdfBtn");
 
             
                 excelBtn.setEnabled(bool)
                 pdfBtn.setEnabled(bool)
          
             
         },
 
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
 
         
         this.enableDownloadButtons(null, false);
         // this.setEnabledDownload(null, false);
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
    });
});
