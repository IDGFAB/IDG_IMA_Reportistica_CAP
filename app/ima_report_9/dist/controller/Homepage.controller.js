sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/ui/export/Spreadsheet","sap/ui/thirdparty/jquery","sap/m/ObjectAttribute","sap/ui/model/Sorter"],function(e,t,o,jQuery,i,a){"use strict";return e.extend("imareport9.controller.Homepage",{onInit:function(){this.getView().setModel(new t,"selectedFiltersModel");this._initializeFilters();this.osUrl=this.getOwnerComponent().getModel().sServiceUrl;this._createFiltersModel();this._getDataFilters();this.getView().setModel(new t,"DataIMA9");let e=this.getView().getModel("selectedFiltersModel");e.setProperty("/matchData",false);this.entityKeys;this.typeContractKeys;this.contractKeys;this.cdcKeys;this.annoKey;this.periodoKey},onAfterRendering:function(){this.makeTitleObjAttrBold();this.disableFilterStart();const e=[{ASSET_CLASS:"Guest quarters in benefit",INTERCOMPANY:"NO",CDC:"000175AT00",CDC_CODE:null,LEASE_N:"",CONTRACT_CODE:"0000000400001",ACC_SECTOR:"ATOP",CONTRACT_DESCRIPTION:"x",MERGED_ENTITY:"",RIGHT_OF_USE:"0e+0",ACCUMULATED_DEPRECIATION:"3.286478e+4",NET_RIGHT_OF_USE:"0e+0",CLOSING_LEASES_LIABILITIES:"0e+0",LEASE_LIABILITIES_SHORT_TERM:"0e+0",LEASE_LIABILITIES_LONG_TERM:"0e+0",YTD_INTEREST:"3.331e+1",LEASE_COST:"3.6e+3",DEPRECIATION:"3.24323e+3",GAIN_FX_RATES:0,LOSS_FX_RATES:0}]},getTableMockData:function(){return[{Data:{Entity:"ILAPAK INTERNATIONAL SA",Scenario:"Actua",Period:"December",Year:2023,Currency:"EUR",Opening:{"Right of Use":{Total:99999999,Building:17910324,"Cars in pool":278436,"Cars in benefit":450944},"Accumulated Depreciation":{Total:6560981,Building:6097132,"Cars in pool":223233,"Cars in benefit":240616},"Net Right of Use":{Total:12078722,Building:11813193,"Cars in pool":55203,"Cars in benefit":210327}},Movements:{"Amount at transition date":{Total:null,Building:null,"Cars in pool":null,"Cars in benefit":null},"Increase for new contract":{Total:28901,Building:null,"Cars in pool":null,"Cars in benefit":28901},"Revaluation (increase for remeasurement)":{Total:39253,Building:null,"Cars in pool":39047,"Cars in benefit":205},"Decrease - Right of Use":{Total:58949,Building:null,"Cars in pool":14984,"Cars in benefit":43965},"Decrease - Accumulated Depreciation":{Total:58949,Building:null,"Cars in pool":14984,"Cars in benefit":43965},Depreciation:{Total:1695290,Building:1524283,"Cars in pool":64381,"Cars in benefit":106626}},Totale:{Totale:{Total:1627137,Building:1524283,"Cars in pool":25334,"Cars in benefit":77520}},Closing:{"Right of Use":{Total:18648908,Building:17910324,"Cars in pool":302499,"Cars in benefit":436085},"Accumulated Depreciation":{Total:8197322,Building:7621415,"Cars in pool":272631,"Cars in benefit":303277},"Net Right of Use":{Total:10451586,Building:10288910,"Cars in pool":29869,"Cars in benefit":132807}}}},{Data:{Entity:"prova 1",Scenario:"Prova 1",Period:"November",Year:2022,Currency:"EUR",Opening:{"Right of Use":{Total:888888888,Building:345678987678,"Cars in pool":567617200,"Cars in benefit":32422322},"Accumulated Depreciation":{Total:6560981,Building:6097132,"Cars in pool":999999999,"Cars in benefit":111111111},"Net Right of Use":{Total:12078722,Building:11813193,"Cars in pool":899999,"Cars in benefit":210327}},Movements:{"Amount at transition date":{Total:null,Building:null,"Cars in pool":null,"Cars in benefit":null},"Increase for new contract":{Total:28901,Building:null,"Cars in pool":null,"Cars in benefit":28901},"Revaluation (increase for remeasurement)":{Total:39253,Building:null,"Cars in pool":39047,"Cars in benefit":205},"Decrease - Right of Use":{Total:58949,Building:null,"Cars in pool":14984,"Cars in benefit":43965},"Decrease - Accumulated Depreciation":{Total:58949,Building:null,"Cars in pool":55555555555555,"Cars in benefit":43965},Depreciation:{Total:1695290,Building:999999999999,"Cars in pool":64381,"Cars in benefit":106626}},Totale:{Totale:{Total:1627137,Building:1524283,"Cars in pool":25334,"Cars in benefit":77520}},Closing:{"Right of Use":{Total:18648908,Building:17910324,"Cars in pool":302499,"Cars in benefit":436085},"Accumulated Depreciation":{Total:8197322,Building:7621415,"Cars in pool":272631,"Cars in benefit":303277},"Net Right of Use":{Total:10451586,Building:10288910,"Cars in pool":29869,"Cars in benefit":132807}}}},{Data:{Entity:"prova 2",Scenario:"prova 2",Period:"June",Year:2021,Currency:"EUR",Opening:{"Right of Use":{Total:77777777777,Building:17910324,"Cars in pool":278436,"Cars in benefit":450944},"Accumulated Depreciation":{Total:6560981,Building:6097132,"Cars in pool":223233,"Cars in benefit":240616},"Net Right of Use":{Total:12078722,Building:11813193,"Cars in pool":55203,"Cars in benefit":210327}},Movements:{"Amount at transition date":{Total:null,Building:null,"Cars in pool":null,"Cars in benefit":null},"Increase for new contract":{Total:28901,Building:null,"Cars in pool":null,"Cars in benefit":28901},"Revaluation (increase for remeasurement)":{Total:39253,Building:null,"Cars in pool":39047,"Cars in benefit":205},"Decrease - Right of Use":{Total:58949,Building:null,"Cars in pool":14984,"Cars in benefit":43965},"Decrease - Accumulated Depreciation":{Total:58949,Building:null,"Cars in pool":14984,"Cars in benefit":43965},Depreciation:{Total:1695290,Building:1524283,"Cars in pool":64381,"Cars in benefit":106626}},Totale:{Totale:{Total:1627137,Building:1524283,"Cars in pool":25334,"Cars in benefit":77520}},Closing:{"Right of Use":{Total:18648908,Building:17910324,"Cars in pool":302499,"Cars in benefit":436085},"Accumulated Depreciation":{Total:8197322,Building:7621415,"Cars in pool":272631,"Cars in benefit":303277},"Net Right of Use":{Total:10451586,Building:10288910,"Cars in pool":29869,"Cars in benefit":132807}}}},{Data:{Entity:"prova 3",Scenario:"prova 3",Period:"Febrary",Year:2020,Currency:"EUR",Opening:{"Right of Use":{Total:6666666666,Building:17910324,"Cars in pool":278436,"Cars in benefit":450944},"Accumulated Depreciation":{Total:6560981,Building:6097132,"Cars in pool":223233,"Cars in benefit":240616},"Net Right of Use":{Total:12078722,Building:11813193,"Cars in pool":55203,"Cars in benefit":210327}},Movements:{"Amount at transition date":{Total:null,Building:null,"Cars in pool":null,"Cars in benefit":null},"Increase for new contract":{Total:28901,Building:null,"Cars in pool":null,"Cars in benefit":28901},"Revaluation (increase for remeasurement)":{Total:39253,Building:null,"Cars in pool":39047,"Cars in benefit":205},"Decrease - Right of Use":{Total:58949,Building:null,"Cars in pool":14984,"Cars in benefit":43965},"Decrease - Accumulated Depreciation":{Total:58949,Building:null,"Cars in pool":14984,"Cars in benefit":43965},Depreciation:{Total:1695290,Building:1524283,"Cars in pool":64381,"Cars in benefit":106626}},Totale:{Totale:{Total:1627137,Building:1524283,"Cars in pool":25334,"Cars in benefit":77520}},Closing:{"Right of Use":{Total:18648908,Building:17910324,"Cars in pool":302499,"Cars in benefit":436085},"Accumulated Depreciation":{Total:8197322,Building:7621415,"Cars in pool":272631,"Cars in benefit":303277},"Net Right of Use":{Total:10451586,Building:10288910,"Cars in pool":29869,"Cars in benefit":132807}}}}]},createSorter:function(){return new a("description",false)},_createFiltersModel:function(){let e=new t({Entity:null,TipoContratto:null,Contratto:null,Anno:null,Periodo:null,CostCenter:null,Id_storico:null,CompanyCode:null});this.getView().setModel(e,"oFiltersModel")},_elaboratedMonths:function(e){const t=["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];return e.map(e=>parseInt(e,10)).sort((e,t)=>e-t).map(e=>({ID:e.toString().padStart(3,"0"),description:t[e-1]}))},_sortEntitiesByDescription:function(e){return e.sort((e,t)=>e.description.localeCompare(t.description))},_elaborateEntities:function(e,t){const o=e.map((e,o)=>({ID:e,description:t[o]}));return this._sortEntitiesByDescription(o)},_sortStringArray:function(e){return e.sort((e,t)=>e.localeCompare(t))},_getDataFilters:function(){const e=`${this.osUrl}Filters`;axios.post(e).then(e=>{console.log(e.data);let t=this.getView().getModel("oFiltersModel");t.setData({Entity:this._elaborateEntities(e.data.BUKRS,e.data.BUTXT),TipoContratto:this._sortStringArray(e.data.RECNTYPE),Contratto:this._sortStringArray(e.data.RECNNR),Periodo:this._elaboratedMonths(e.data.PERIODDUEDATE),Anno:this._sortStringArray(e.data.YEARDUEDATE),CostCenter:this._sortStringArray(e.data.CDC),Id_storico:this._sortStringArray(e.data.ID_STORICO)});console.log("Filters data: ",t.getData());return}).catch(e=>{console.error(e);if(e.response){console.error("Server responded with error: ",e.response.status,e.response.data)}else if(e.request){console.error("No response received from server: ",e.request)}else{console.error("Axios error: ",e.message)}})},getTableData:function(){this.getView().byId("table").setBusy(true);let e=this.getView().getModel("selectedFiltersModel").getData();let t=this.getView().getModel("selectedFiltersModel");console.log(Object.values(e.entity));const o={entity:Object.values(e.entity),tipoContratto:Object.values(e.tipoContratto),contratto:e.contratto?Object.values(e.contratto):null,year:e.year,period:e.period,costCenter:e.costCenter?Object.values(e.costCenter):null,Id_storico:e.ID_STORICO};const i=`${this.osUrl}GetTabellaFiltrata`;axios.post(i,o).then(e=>{this.getView().byId("table").setBusy(false);t.setProperty("/matchData",true);console.log(e.data);let o=this.getView().getModel("DataIMA9");if(typeof e.data==="object"){let t=[];t.push(e.data);if(t&&Array.isArray(t)){let e=t[0].value.map(this.convertExponentialValues);o.setData(e);o.refresh()}}else{o.setData(e.data);o.refresh()}return}).catch(e=>{console.error(e);if(e.response){console.error("Server responded with error: ",e.response.status,e.response.data)}else if(e.request){console.error("No response received from server: ",e.request)}else{console.error("Axios error: ",e.message)}})},convertExponentialValues:function(e){for(let t in e){if(e.hasOwnProperty(t)){if(typeof e[t]==="string"&&e[t].match(/^-?\d+\.?\d*e[+\-]?\d+$/i)){let o=parseFloat(e[t]);if(!isNaN(o)){e[t]=o.toLocaleString("it-IT",{minimumFractionDigits:2,maximumFractionDigits:2})}}}}return e},onSelectionChange:function(e){this.assignReportResume(e);this.makeTitleObjAttrBold();let t=this.getView().getModel("selectedFiltersModel");let o=t.getData();const i=e.getSource();const a=i.getName();console.log("selected control",i);console.log("control name",a);if(i.getMetadata().getName()==="sap.m.MultiComboBox"){o[a]=i.getSelectedKeys()}else{o[a]=i.getSelectedKey()}t.setData(o);let n=o.Periodo&&o.Anno&&o.ID_STORICO&&(o.TipoContratto&&o.TipoContratto.length>0)&&(o.Entity&&o.Entity.length>0)?true:false;t.setProperty("/allSelected",n);this.clearFilter(e);this.selectFiltering()},clearFilter:function(e){let t=this.getView().getModel("selectedFiltersModel");let o=t.getData();const i=e.getSource();const a=i.getName();let n=o[a]||[];console.log("vecchie chiavi",n);switch(a){case"Entity":if(this.entityKeys==undefined){let e=i.getSelectedKeys();this.entityKeys=e.length}else{const t=[this.getView().byId("TipoContrattoBox"),this.getView().byId("ContrattoBox"),this.getView().byId("AnnoSelect"),this.getView().byId("PeriodoSelect"),this.getView().byId("CostCenterBox"),this.getView().byId("IdStoricoSelect")];t.forEach(t=>{if(t.getMetadata().getName()==="sap.m.MultiComboBox"){t.setSelectedKeys(null)}else if(t.getMetadata().getName()==="sap.m.Select"){t.setSelectedKey(null)}else if(t.getMetadata().getName()==="sap.m.ComboBox"){t.setSelectedKey(null)}this.assignReportResume(e,t.getLabels()[0].getText().toLowerCase(),t);this.makeTitleObjAttrBold()})}break;case"TipoContratto":if(this.typeContractKeys==undefined){let e=i.getSelectedKeys();this.typeContractKeys=e.length}else{const t=[this.getView().byId("ContrattoBox"),this.getView().byId("AnnoSelect"),this.getView().byId("PeriodoSelect"),this.getView().byId("CostCenterBox"),this.getView().byId("IdStoricoSelect")];t.forEach(t=>{if(t.getMetadata().getName()==="sap.m.MultiComboBox"){t.setSelectedKeys(null)}else if(t.getMetadata().getName()==="sap.m.Select"){t.setSelectedKey(null)}else if(t.getMetadata().getName()==="sap.m.ComboBox"){t.setSelectedKey(null)}this.assignReportResume(e,t.getLabels()[0].getText().toLowerCase(),t);this.makeTitleObjAttrBold()})}break;case"Contratto":if(this.contractKeys==undefined){let e=i.getSelectedKeys();this.contractKeys=e.length}else{const t=[this.getView().byId("AnnoSelect"),this.getView().byId("PeriodoSelect"),this.getView().byId("CostCenterBox"),this.getView().byId("IdStoricoSelect")];t.forEach(t=>{if(t.getMetadata().getName()==="sap.m.MultiComboBox"){t.setSelectedKeys(null)}else if(t.getMetadata().getName()==="sap.m.Select"){t.setSelectedKey(null)}else if(t.getMetadata().getName()==="sap.m.ComboBox"){t.setSelectedKey(null)}this.assignReportResume(e,t.getLabels()[0].getText().toLowerCase(),t);this.makeTitleObjAttrBold()})}break;case"Anno":if(this.annoKey==undefined){let e=i.getSelectedKey();this.annoKey=e}else{const t=[this.getView().byId("PeriodoSelect"),this.getView().byId("CostCenterBox"),this.getView().byId("IdStoricoSelect")];t.forEach(t=>{if(t.getMetadata().getName()==="sap.m.MultiComboBox"){t.setSelectedKeys(null)}else if(t.getMetadata().getName()==="sap.m.Select"){t.setSelectedKey(null)}else if(t.getMetadata().getName()==="sap.m.ComboBox"){t.setSelectedKey(null)}this.assignReportResume(e,t.getLabels()[0].getText().toLowerCase(),t);this.makeTitleObjAttrBold()})}break;case"Periodo":if(this.periodoKey==undefined){let e=i.getSelectedKey();this.periodoKey=e}else{const t=[this.getView().byId("CostCenterBox"),this.getView().byId("IdStoricoSelect")];t.forEach(t=>{if(t.getMetadata().getName()==="sap.m.MultiComboBox"){t.setSelectedKeys(null)}else if(t.getMetadata().getName()==="sap.m.Select"){t.setSelectedKey(null)}else if(t.getMetadata().getName()==="sap.m.ComboBox"){t.setSelectedKey(null)}this.assignReportResume(e,t.getLabels()[0].getText().toLowerCase(),t);this.makeTitleObjAttrBold()})}break;case"CostCenter":if(this.cdcKeys==undefined){let e=i.getSelectedKeys();this.cdcKeys=e.length}else{const t=[this.getView().byId("IdStoricoSelect")];t.forEach(t=>{if(t.getMetadata().getName()==="sap.m.MultiComboBox"){t.setSelectedKeys(null)}else if(t.getMetadata().getName()==="sap.m.Select"){t.setSelectedKey(null)}else if(t.getMetadata().getName()==="sap.m.ComboBox"){t.setSelectedKey(null)}this.assignReportResume(e,t.getLabels()[0].getText().toLowerCase(),t);this.makeTitleObjAttrBold()})}break;case"ID_STORICO":break;default:console.error("default, errore nello switch");break}},selectFiltering:function(){const e=`${this.osUrl}applyFilters`;let t=this.getView().getModel("selectedFiltersModel").getData();console.log(Object.values(t.entity));const o={entity:Object.values(t.entity),tipoContratto:t.tipoContratto?Object.values(t.tipoContratto):null,contratto:t.contratto?Object.values(t.contratto):null,year:t.year,period:t.period,costCenter:t.costCenter?Object.values(t.costCenter):null,Id_storico:t.ID_STORICO};axios.post(e,o).then(e=>{console.log("dati filtrati test",e.data);let t=this.getView().getModel("oFiltersModel");if(!o.tipoContratto||o.tipoContratto.length==0){t.getData().TipoContratto=this._sortStringArray(e.data.RECNTYPE);t.getData().Contratto=this._sortStringArray(e.data.RECNNR);t.getData().Anno=this._sortStringArray(e.data.YEARDUEDATE);t.getData().Periodo=this._elaboratedMonths(e.data.PERIODDUEDATE);t.getData().CostCenter=this._sortStringArray(e.data.CDC);t.getData().Id_storico=this._sortStringArray(e.data.ID_STORICO)}if(!o.contratto||o.contratto.length==0){t.getData().Contratto=this._sortStringArray(e.data.RECNNR);t.getData().Anno=this._sortStringArray(e.data.YEARDUEDATE);t.getData().Periodo=this._elaboratedMonths(e.data.PERIODDUEDATE);t.getData().CostCenter=this._sortStringArray(e.data.CDC);t.getData().Id_storico=this._sortStringArray(e.data.ID_STORICO)}if(!o.year){t.getData().Anno=this._sortStringArray(e.data.YEARDUEDATE);t.getData().Periodo=this._elaboratedMonths(e.data.PERIODDUEDATE);t.getData().CostCenter=this._sortStringArray(e.data.CDC);t.getData().Id_storico=this._sortStringArray(e.data.ID_STORICO)}if(!o.period){t.getData().Periodo=this._elaboratedMonths(e.data.PERIODDUEDATE);t.getData().CostCenter=this._sortStringArray(e.data.CDC);t.getData().Id_storico=this._sortStringArray(e.data.ID_STORICO)}if(!o.costCenter||o.costCenter.length==0){t.getData().CostCenter=this._sortStringArray(e.data.CDC);t.getData().Id_storico=this._sortStringArray(e.data.ID_STORICO)}if(!o.Id_storico){t.getData().Id_storico=this._sortStringArray(e.data.ID_STORICO)}console.log(t.getData().Entity);console.log("Tipo Contratto",t.getData().TipoContratto);t.refresh();console.log("Filters data: ",t.getData());return}).catch(e=>{console.error(e);if(e.response){console.error("Server responded with error: ",e.response.status,e.response.data)}else if(e.request){console.error("No response received from server: ",e.request)}else{console.error("Axios error: ",e.message)}})},setEnabledDownload:function(e){const t=this.getView().byId("excelBtn");const o=this.getView().byId("pdfBtn");t.setEnabled(e);o.setEnabled(e)},disableFilterStart:function(e){const t=this.getView().byId("filterbar");const o=t._getSearchButton();if(o){o.setEnabled(false)}},makeTitleObjAttrBold:function(){const e=document.querySelectorAll(".sapFDynamicPageHeaderContent .sapUiVltCell.sapuiVltCell span");e.forEach(e=>{if(e&&e.textContent.includes(":")){const t=e.textContent.split(":");const o=document.createElement("span");o.style.fontWeight="bold";o.textContent=t[0]+": ";const i=document.createTextNode(t[1].trim());e.textContent="";e.appendChild(o);e.appendChild(i)}})},assignReportResume:function(e,t,o){const a=e.getSource();const n=a?a.getLabels()[0].getText():"";let r="";let s="";if(a.getMetadata().getName()==="sap.m.MultiComboBox"){if(o!==undefined&&o.getMetadata().getName()==="sap.m.MultiComboBox"){s=o.getSelectedKeys().map(e=>e.getText()).join(", ")}else{r=a.getSelectedItems().map(e=>e.getText()).join(", ")}}else if(a.getMetadata().getName()==="sap.m.Select"){if(o!==undefined&&o.getMetadata().getName()==="sap.m.Select"){const e=o.getSelectedItem();s=e?e.getText():""}else{const e=a.getSelectedItem();r=e?e.getText():""}}else if(a.getMetadata().getName()==="sap.m.ComboBox"){if(o!==undefined&&o.getMetadata().getName()==="sap.m.ComboBox"){const e=o.getSelectedItem();s=e?e.getText():""}else{const e=a.getSelectedItem();r=e?e.getText():""}}const l=this.getView().byId("hLayout");const c=l.getContent();c.forEach(e=>{const o=e.getContent();o.forEach(e=>{if(e instanceof i){if(e.getTitle().toLowerCase()===n.toLowerCase()){e.setText(r);e.rerender()}else if(e.getTitle().toLowerCase()===t){e.setText(s);e.rerender()}}})})},onCloseLegend:function(e){var t=this.byId("legendPanel");t.setVisible(false)},_initializeFilters:function(){console.log("Filters data: ",this.getView().getModel("oFiltersModel"))},_matchData:function(){let e=this.getView().getModel("selectedFiltersModel").getData();this.getView().setModel(new t,"DataIMA9");var o=[];this.getView().getModel("DataIMA9").setData(o);this.getView().getModel("DataIMA9").refresh();console.log(this.getView().getModel("DataIMA9"))},onSearch:function(){this.getTableData();const e=this.getTableMockData();const o=this.getView().getModel("selectedFiltersModel").getData().allSelected;var i=this.byId("table");if(o){this.makeGeneratedTableMockData(e);this.setTableHeight(null,i)}else{var a=new t({rows:[]});i.setModel(a);i.bindRows("/rows")}},makeGeneratedTableMockData:function(e){var o=this.byId("table");const i=this._prepareData(e[0].Data);o.removeAllColumns();const a=[{key:"Section",label:"Section",width:"150px",freeze:true},{key:"Description",label:"Description",width:"350px",freeze:true},{key:"Total",label:"Total",width:"150px"},{key:"Building",label:"Building",width:"150px"},{key:"Cars in pool",label:"Cars in pool",width:"150px"},{key:"Cars in benefit",label:"Cars in benefit",width:"150px"}];a.forEach(e=>{o.addColumn(new sap.ui.table.Column({label:new sap.m.Label({text:e.label}),template:new sap.m.Text({text:"{"+e.key+"}"}),width:e.width,sorted:false,filtered:false,freezed:e.freeze}))});const n=new t({rows:i});n.setSizeLimit(i.length+100);o.setModel(n);o.bindRows("/rows");const r=Math.min(i.length,20);o.setVisibleRowCount(r);this.getView().getModel("selectedFiltersModel").setProperty("/matchData",true);this._colorTotalRows();console.log("Table found:",!!o,"Table ID:",o?.getId())},_prepareData:function(e){var t=[];var o="";var i={Opening:["Right of Use","Accumulated Depreciation","Net Right of Use",""],Movements:["Amount at transition date","Increase for new contract","Revaluation (increase for remeasurement)","Decrease - Right of Use","Decrease - Accumulated Depreciation","Increase for Mergers - Right of Use","Increase for Mergers - Accumulated Depreciation","Decrease for Mergers - Right of Use","Decrease for Mergers - Accumulated Depreciation","Reverse for Change CDC - Right of Use","Recognition for Change CDC - Right of Use","Reverse for Change CDC - Accumulated Depreciation","Recognition for Change CDC - Accumulated Depreciation","Depreciation"],Totale:["Totale",""],Closing:["Right of Use","Accumulated Depreciation","Net Right of Use"]};Object.keys(i).forEach(function(a){i[a].forEach(function(i){var n=e[a]||{};var r=n[i]||{};const s=e=>{if(e===undefined||e===null)return"-";if(typeof e==="number"){return e.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}return e};t.push({Section:a===o?"":a,Description:i,Total:s(r.Total),Building:s(r.Building),"Cars in pool":s(r["Cars in pool"]),"Cars in benefit":s(r["Cars in benefit"])});o=a})});return t},_createColumns:function(e){var t=this.byId("table");var o=new Set;Object.keys(e[0]||{}).forEach(e=>{if(!o.has(e)){this._addColumn(e);o.add(e)}})},_addColumn:function(e){var t=this.byId("table");var o=new sap.ui.table.Column({label:new sap.m.Label({text:e}),template:new sap.m.Text({text:"{"+e+"}"}),width:"11rem"});t.addColumn(o)},setTableHeight:function(e,t){let o=window.innerHeight;let i=window.innerWidth;if(i<450){let e=Math.floor(o/100);t.setVisibleRowCount(e)}else{let e=Math.floor(o/80);t.setVisibleRowCount(e)}},_colorTotalRows:function(){var e=this.byId("table");var t=function(e){o()};var o=function(){var t=e.getRows();t.forEach(function(e){var t=e.getBindingContext();var o=e._mDomRefs.jQuery.row[1];var i=e._mDomRefs.jQuery.row[0];if(t&&(o||i)){var a=t.getProperty("Description");var n=a==="";if(n){$(o).addClass("highlightRow");$(i).addClass("highlightRow")}else{$(o).removeClass("highlightRow");$(i).removeClass("highlightRow")}}})};e.attachEvent("rowsUpdated",t);o();this.getView().byId("table").setBusy(false)},_bindToolbarText:function(){let e=this.getView().getModel("selectedFiltersModel").getData();let t=`Scenario: ${e.scenario||"-"} - Period: ${e.period||"-"} - Year: ${e.year||"-"} - Entity: ${e.entity||"-"}`},onDownloadExcelPress:function(){var e=this.byId("table");var t=e.getModel();var i=e.getBinding("rows").oList;var a=this._createColumnConfig();var n={workbook:{columns:a,context:{sheetName:"Exported Data"},styles:[{id:"header",fontSize:12,fontColor:"#ffffff",backgroundColor:"#808080",bold:true,hAlign:"Center",border:{top:{style:"thin",color:"#000000"},bottom:{style:"thin",color:"#000000"},left:{style:"thin",color:"#000000"},right:{style:"thin",color:"#000000"}}},{id:"content",fontSize:10,hAlign:"Left",border:{top:{style:"thin",color:"#000000"},bottom:{style:"thin",color:"#000000"},left:{style:"thin",color:"#000000"},right:{style:"thin",color:"#000000"}}}]},dataSource:i,fileName:"ExportedData.xlsx",worker:false};var r=new o(n);r.build().then(function(){sap.m.MessageToast.show("Excel export successful!")}).finally(function(){r.destroy()})},onDownloadPdfPress:function(){var e=this.byId("table");var t=e.getBinding("rows");var o=t.getContexts().map(function(e){return e.getObject()});var i=["ACC_SECTOR","ACCUMULATED_DEPRECIATION","RIGHT_OF_USE","ASSET_CLASS","BUKRS","CONTRACT_CODE","CONTRACT_DESCRIPTION","DEPRECIATION","CLOSING_LEASES_LIABILITIES","INTERCOMPANY","LEASE_COST","CDNET_RIGHT_OF_USEC","CDC","CDC_CODE","YTD_INTEREST","GAIN_FX_RATES","LOSS_FX_RATES"];var a={pageSize:"A4",pageOrientation:"landscape",pageMargins:[5,5,5,5],footer:{text:(new Date).toLocaleString(),alignment:"right",fontSize:6},content:[]};let n=[];n.push(i.map(e=>({text:e.substring(0,10),style:{fontSize:8,bold:true,alignment:"center"},noWrap:true})));o.forEach(function(e){let t=i.map(t=>({text:String(e[t]||"-").substring(0,20),style:{fontSize:8},noWrap:true}));n.push(t)});a.content.push({table:{headerRows:1,widths:Array(i.length).fill(43),body:n},layout:{paddingLeft:function(){return 2},paddingRight:function(){return 2},paddingTop:function(){return 2},paddingBottom:function(){return 2}}});pdfMake.createPdf(a).download()},_createColumnConfig:function(){var e=this.byId("table");var t=e.getColumns();return t.map(e=>({label:e.getLabel().getText(),property:e.getLabel().getText(),type:"string"}))}})});
//# sourceMappingURL=Homepage.controller.js.map