using ima_report as my from '../db/data-model';
using {ima_report.types as type} from '../db/types';

service CatalogService {

    entity primoDeploy as projection on my.primoDeploy;
    entity View_All_Data as projection on my.View_All_Data;
    entity GV_FILTRI_ID22 as projection on my.GV_FILTRI_ID22;
    entity View_All_Data_v2 as projection on my.View_All_Data_v2;
    entity View_IMA_Lettura as projection on my.View_IMA_Lettura;
    entity View_Lease_Liabilities__Long__Term as projection on my.View_Lease_Liabilities__Long__Term;
    entity View_Lease_Liabilities__Short__Term as projection on my.View_Lease_Liabilities__Short__Term;
    entity VIEW_ALL_UNION_ID23 as projection on my.VIEW_ALL_UNION_ID23;
    entity View_CAP_REPORT23_LT as projection on my.View_CAP_REPORT23_LT;
    entity View_CAP_REPORT_23_EQ as projection on my.View_CAP_REPORT_23_EQ;
    action GetTabellaFiltrata(entity: array of String , tipoContratto: array of String, contratto: array of String, year: String, period:String, costCenter: array of String, Id_storico: String) returns array of String;
    action GetTabellaFiltrata23(entity: array of String, contratto: array of String, year: String, period:String, Id_storico: String) returns array of String;
    action GetTabellaFiltrata9(entity: array of String , contratto: array of String, year: String, period:String, costCenter: array of String, Id_storico: String) returns array of String;
    action GetTabellaFiltrata19(entity: array of String , contratto: array of String, year: String, period:String, costCenter: array of String, Id_storico: String) returns array of String;
    action applyFilters(entity: array of String , tipoContratto: array of String, contratto: array of String, year: String, period:String, costCenter: array of String, Id_storico: String) returns type.Filters;
    action applyFilters23(entity: array of String , contratto: array of String, year: String, period:String, Id_storico: String) returns type.Filters;
    action applyFilters9(entity: array of String , contratto: array of String, year: String, period:String, costCenter: array of String, Id_storico: String) returns type.Filters;
    action applyFilters19(entity: array of String , contratto: array of String, year: String, period:String, costCenter: array of String, Id_storico: String) returns type.Filters;
    action Filters() returns type.Filters;
    action FilterControl(entity: array of String, tipoContratto: array of String) returns type.Filters;
}