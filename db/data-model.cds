namespace ima_report;


using {cuid} from '@sap/cds/common';

entity primoDeploy : cuid {
    nome : String;
}

@cds.persistence.exists
entity View_All_Data {
    key YEARDUEDATE                : String(4);
    key PERIODDUEDATE              : String(3);
        RECNNR                     : String(13);
    key INTRENO                    : String(13);
        CERULE                     : String(10);
        RECNTYPE                   : String(4);
        IDENTOBJNR                 : String(10);
        ZZPARTNER                  : String(6);
        UDATE                      : String(8);
        UTIME                      : String(6);
        IDENTASSET                 : String(12);
        GSBER                      : String(4);
        RECNTXT                    : String(80);
        ZZSOCIETA                  : String(4);
        PRICE_SROU                 : Decimal(19, 6);
        BBWHR_ACQUISITION          : Decimal(23, 2);
        RECNBEG                    : String(8);
        RECNDPO                    : String(8);
        FONDO_AMM_CUM              : Decimal(23, 2);
        BBWHR_DEPRECIATION_SUM_END : Decimal(23, 2);
        BBWHR_LIABILITY_SUM_END    : Decimal(23, 2);
        BBWHR_INTEREST             : Decimal(23, 2);
        BBWHR_PAYMENT              : Decimal(23, 2);
        BBWHR_DEPRECIATION         : Decimal(23, 2);
    key SPRAS                      : String(1);
        KTEXT                      : String(20);
    key KOSTL                      : String(10);
        DEBITO_MTERM               : Decimal(23, 2);
        DEBITO_BTERM               : Decimal(23, 2);
        DEBITO_LTERM               : Decimal(23, 2);
        SWHRKOND                   : String(5);
        RECNCNCURR                 : String(5);
        TXK20                      : String(20);
    key ANLN1                      : String(12);
    key BUKRS                      : String(4);
    key ANLKL                      : String(8);
        RECNTXTOLD                 : String(20);
    key ID_STORICO                 : String(20);
        BUTXT                      : String(28);
}

@cds.persistence.exists
entity View_All_Data_v2 {
        XMBEZ                      : String(30);
    key YEARDUEDATE                : String(4);
    key PERIODDUEDATE              : String(3);
        RECNNR                     : String(13);
        CERULE                     : String(10);
        RECNTYPE                   : String(4);
        IDENTOBJNR                 : String(10);
        ZZPARTNER                  : String(6);
        UDATE                      : String(8);
        UTIME                      : String(6);
        GSBER                      : String(4);
        RECNTXT                    : String(80);
        ZZSOCIETA                  : String(4);
        PRICE_SROU                 : Decimal(19, 6);
        BBWHR_ACQUISITION          : Decimal(23, 2);
        RECNDPO                    : String(8);
        RECNBEG                    : String(8);
        FONDO_AMM_CUM              : Decimal(23, 2);
        BBWHR_DEPRECIATION_SUM_END : Decimal(23, 2);
        BBWHR_LIABILITY_SUM_END    : Decimal(23, 2);
        BBWHR_INTEREST             : Decimal(23, 2);
        BBWHR_PAYMENT              : Decimal(23, 2);
        BBWHR_DEPRECIATION         : Decimal(23, 2);
    key SPRAS                      : String(1);
        KTEXT                      : String(20);
    key KOSTL                      : String(10);
        DEBITO_MTERM               : Decimal(23, 2);
        DEBITO_BTERM               : Decimal(23, 2);
        DEBITO_LTERM               : Decimal(23, 2);
        SWHRKOND                   : String(5);
        RECNCNCURR                 : String(5);
        RECNTXTOLD                 : String(20);
    key INTRENO                    : String(13);
    key ID_STORICO                 : String(20);
    key BUKRS                      : String(4);
        BUTXT                      : String(25);
        IDENTASSET                 : String(12);
        BBWHR_REPAYMENT_DIF        : Decimal(23, 2);
        RECNNOTPER                 : String(8);
        GJAHR                      : String(4);
        PERIODO                    : String(2);
        BELNR                      : String(10);
        GAIN                       : Decimal(18, 2);
        LOSS                       : Decimal(18, 2);
        PRICE_EROU                 : Decimal(19, 6);

}

@cds.persistence.exists
entity GV_FILTRI_ID22 {
    key YEARDUEDATE   : String(4);
    key PERIODDUEDATE : String(3);
    key BUKRS         : String(4);
    key ID_STORICO    : String(20);
        BUTXT         : String(25);
        IDENTOBJNR    : String(10);
        RECNTYPE      : String(4);
        RECNNR        : String(13);
}

@cds.persistence.exists
entity View_IMA_Lettura {
    key YEARDUEDATE                : String(4);
        BUKRS                      : String(4);
    key PERIODDUEDATE              : String(3);
        RECNNR                     : String(13);
    key INTRENO                    : String(13);
        CERULE                     : String(10);
        RECNTYPE                   : String(4);
        IDENTOBJNR                 : String(10);
        ZZPARTNER                  : String(6);
        UDATE                      : String(8);
        UTIME                      : String(6);
        IDENTASSET                 : String(12);
        GSBER                      : String(4);
        RECNTXT                    : String(80);
        ZZSOCIETA                  : String(4);
        BBWHR_ACQUISITION          : Decimal(23, 2);
        RECNDPO                    : String(8);
        RECNBEG                    : String(8);
        FONDO_AMM_CUM              : Decimal(23, 2);
        BBWHR_DEPRECIATION_SUM_END : Decimal(23, 2);
        BBWHR_LIABILITY_SUM_END    : Decimal(23, 2);
        BBWHR_INTEREST             : Decimal(23, 2);
        BBWHR_PAYMENT              : Decimal(23, 2);
        BBWHR_DEPRECIATION         : Decimal(23, 2);
    key SPRAS                      : String(1);
    key KOSTL                      : String(10);
        DEBITO_MTERM               : Decimal(23, 2);
        DEBITO_BTERM               : Decimal(23, 2);
        DEBITO_LTERM               : Decimal(23, 2);
        SWHRKOND                   : String(5);
        RECNCNCURR                 : String(5);
        RECNTXTOLD                 : String(20);
    key ID_STORICO                 : String(20);
        BBWHR_REPAYMENT_DIF        : Decimal(23, 2);
        RECNNOTPER                 : String(8);
        BBWHR_DEPRECIATION_SUM_BEG : Decimal(23, 2);
        KTEXT                      : String(20);
        PRICE_ZFAM                 : Decimal(19, 6);
        PRICE_EROU                 : Decimal(19, 6);
        PRICE_SROU                 : Decimal(19, 6);
        RECNNOTREASON              : String(2);
        RECNENDABS                 : String(8);
        CFPOSTINGFROM              : String(8);
}


@cds.persistence.exists
entity View_Lease_Liabilities__Short__Term {
        JOURNAL_TYPE               : String(20);
        ACCOUNT                    : String(27);
        IDENTOBJNR                 : String(10);
        RECNTXTOLD                 : String(20);
        XMBEZ                      : String(30);
        DEBIT                      : Decimal(10, 2);
        CREDIT                     : Decimal(28, 2);
    key YEARDUEDATE                : String(4);
    key PERIODDUEDATE              : String(3);
        RECNNR                     : String(13);
    key BUKRS                      : String(4);
        CERULE                     : String(10);
        RECNTYPE                   : String(4);
        ZZPARTNER                  : String(6);
    key ID_STORICO                 : String(20);
    key INTRENO                    : String(13);
        DEBIT_CURR                 : Decimal(5, 2);
        CREDIT_CURR                : Decimal(5, 2);
}

@cds.persistence.exists
entity View_Lease_Liabilities__Long__Term {
        JOURNAL_TYPE               : String(20);
        ACCOUNT                    : String(27);
        IDENTOBJNR                 : String(10);
        RECNTXTOLD                 : String(20);
        XMBEZ                      : String(30);
        DEBIT                      : Decimal(10, 2);
        CREDIT                     : Decimal(28, 2);
    key YEARDUEDATE                : String(4);
    key PERIODDUEDATE              : String(3);
        RECNNR                     : String(13);
    key BUKRS                      : String(4);
        CERULE                     : String(10);
        RECNTYPE                   : String(4);
        ZZPARTNER                  : String(6);
    key ID_STORICO                 : String(20);
    key INTRENO                    : String(13);
        DEBIT_CURR                 : Decimal(5, 2);
        CREDIT_CURR                : Decimal(5, 2);
}

@cds.persistence.exists
entity VIEW_ALL_UNION_ID23 {
        JOURNAL_TYPE               : String(29);
        ACCOUNT                    : String(27);
        IDENTOBJNR                 : String(10);
        RECNTXTOLD                 : String(20);
        XMBEZ                      : String(30);
        DEBIT                      : Decimal(23, 2);
        CREDIT                     : Decimal(10, 2);
    key YEARDUEDATE                : String(4);
    key PERIODDUEDATE              : String(3);
        RECNNR                     : String(13);
    key BUKRS                      : String(4);
        CERULE                     : String(10);
        RECNTYPE                   : String(4);
        ZZPARTNER                  : String(6);
    key ID_STORICO                 : String(20);
    key INTRENO                    : String(13);
        DEBIT_CURR                 : Decimal(5, 2);
        CREDIT_CURR                : Decimal(5, 2);
}


@cds.persistence.exists
entity View_CAP_REPORT_23_EQ {
        JOURNAL_TYPE               : String(29);
        ACCOUNT                    : String(27);
        IDENTOBJNR                 : String(10);
        RECNTXTOLD                 : String(20);
        XMBEZ                      : String(30);
        DEBIT                      : Decimal(23, 2);
        CREDIT                     : Decimal(10, 2);
    key YEARDUEDATE                : String(4);
    key PERIODDUEDATE              : String(3);
        RECNNR                     : String(13);
    key BUKRS                      : String(4);
        CERULE                     : String(10);
        RECNTYPE                   : String(4);
        ZZPARTNER                  : String(6);
    key ID_STORICO                 : String(20);
    key INTRENO                    : String(13);
        DEBIT_CURR                 : Decimal(5, 2);
        CREDIT_CURR                : Decimal(5, 2);
}

@cds.persistence.exists
entity View_CAP_REPORT23_LT {
        JOURNAL_TYPE               : String(29);
        ACCOUNT                    : String(27);
        IDENTOBJNR                 : String(10);
        RECNTXTOLD                 : String(20);
        XMBEZ                      : String(30);
        DEBIT                      : Decimal(23, 2);
        CREDIT                     : Decimal(10, 2);
    key YEARDUEDATE                : String(4);
    key PERIODDUEDATE              : String(3);
        RECNNR                     : String(13);
    key BUKRS                      : String(4);
        CERULE                     : String(10);
        RECNTYPE                   : String(4);
        ZZPARTNER                  : String(6);
    key ID_STORICO                 : String(20);
    key INTRENO                    : String(13);
        DEBIT_CURR                 : Decimal(5, 2);
        CREDIT_CURR                : Decimal(5, 2);
}


@cds.persistence.exists
entity View_ZRE_SUMDEP {
    key MANDT                      : String(3);
    key BUKRS                      : String(4);
    key RECNTYPE                   : String(4);
    key RECNNR                     : String(13);
    key CPUDT                      : String(8);
    key ZZNDOC                     : String(20);
    ZZDEPR_FUND_INT                : Decimal(23, 2);
    ZZDEPR_FUND_VAL                : Decimal(23, 2);
}


@cds.persistence.exists
entity View_VICEPROCESS {
    key INTRENO                    : String(13);
        CEFROM                     : String(8);
    key MANDT                      : String(3);
    key RULEGUID                   : Binary(16);
    key PROCESSGUID                : Binary(16);
        CNVALUE                    : Decimal(15, 2);
        ABSOLUTEEND                : String(8);

}

@cds.persistence.exists
entity View_VICDCOND {
    key INTRENO                    : String(13);
    CONDVALIDFROM                  : String(8);
    CONDVALIDTO                    : String(8);
    CONDTYPE                       : String(4);

}