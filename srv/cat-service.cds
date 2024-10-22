using ima_report as my from '../db/data-model';
using {ima_report.types as type} from '../db/types';

service CatalogService {

    entity primoDeploy as projection on my.primoDeploy;
    entity View_All_Data as projection on my.View_All_Data;
    entity GV_FILTRI_ID22 as projection on my.GV_FILTRI_ID22;
    entity View_All_Data_v2 as projection on my.View_All_Data_v2;
    entity View_IMA_Lettura as projection on my.View_IMA_Lettura;
    action GetTabellaFiltrata(entity: array of String , tipoContratto: array of String, contratto: array of String, year: String, period:String, costCenter: array of String, Id_storico: String) returns array of String;
    action Filters() returns type.Filters;
    action FilterControl(entity: array of String, tipoContratto: array of String) returns type.Filters;
}