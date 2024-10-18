using {ima_report.types as type} from '../db/types';

@(path: '/OperationService')
service OperationService {

    action GetTabellaFiltrata(entity: array of String , tipoContratto: array of String, contratto: array of String, year: String, period:String, costCenter: array of String) returns type.Filters;
    action Filters() returns type.Filters
}