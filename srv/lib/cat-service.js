const cds = require("@sap/cds");
const { response } = require("express");
// const fetch = require("node-fetch");

// TODO: Return the value with the dynamic filters

module.exports = class CatalogService extends cds.ApplicationService {
  log;

  init() {
    this.log = cds.log("reportistica", {
      label: "reportistica.IDGFAB",
    });
    this.log.info("Service OperationService start.");
    
    return super.init();
  }


  async CreateQuery(entity = [], tipoContratto = [], contratto = [], year = null, period = null, costCenter = [], Id_storico = null) {
    let whereClauses = [];

	    // Controllo per il parametro Entity (obbligatorio e array)
		if (Array.isArray(entity) && entity.length > 0) {
			whereClauses.push('"BUKRS" IN (' + entity.map(e => `'${e}'`).join(', ') + ')');
		} else {
			throw new Error("Il parametro 'Entity' è obbligatorio e deve essere un array.");
		}
	
		// Controllo per il parametro Tipo Contratto (obbligatorio e array)
		if (Array.isArray(tipoContratto) && tipoContratto.length > 0) {
			whereClauses.push('"RECNTYPE" IN (' + tipoContratto.map(tc => `'${tc}'`).join(', ') + ')');
		} else {
			throw new Error("Il parametro 'Tipo Contratto' è obbligatorio e deve essere un array.");
		}
	
		// Controllo per il parametro Contratto (facoltativo e array)
		if (contratto) {
			if (Array.isArray(contratto)) {
				if(contratto.length > 0){
					whereClauses.push('"RECNNR" IN (' + contratto.map(c => `'${c}'`).join(', ') + ')');
				}
			} else {
				whereClauses.push('"RECNNR" = \'' + contratto + '\'');
			}
		}
	
		// Controllo per il parametro Year (obbligatorio e non array)
		if (year !== null && year !== undefined) {
			whereClauses.push('"YEARDUEDATE" = \'' + year + '\'');
		} else {
			throw new Error("Il parametro 'Year' è obbligatorio.");
		}
	
		// Controllo per il parametro Period (obbligatorio e non array)
		if (period !== null && period !== undefined) {
			whereClauses.push('TO_INT("PERIODDUEDATE") = ' + period);
		} else {
			throw new Error("Il parametro 'Period' è obbligatorio.");
		}
	
		// Controllo per il parametro Cost Center (facoltativo e array)
		if (Array.isArray(costCenter)) {
			if(costCenter.length > 0) {
				whereClauses.push('"IDENTOBJNR" IN (' + costCenter.map(cc => `'${cc}'`).join(', ') + ')');
			}
		} else if (costCenter) {
			whereClauses.push('"IDENTOBJNR" = \'' + costCenter + '\'');
		}

				// Controllo per il parametro Year (obbligatorio e non array)
		if (Id_storico !== null && Id_storico !== undefined) {
			whereClauses.push('"ID_STORICO" = \'' + Id_storico + '\'');
		} else {
			throw new Error("Il parametro 'Id_storico' è obbligatorio.");
		}
	
		// Costruzione della query finale
		let sqlQuery = ''; // Sostituisci con il nome della tua tabella
		if (whereClauses.length > 0) {
			sqlQuery += 'WHERE ' + whereClauses.join(' AND ');
		}
	
		return sqlQuery;
	}

  async CreateQueryWithMinor(entity = [], tipoContratto = [], contratto = [], year = null, period = null, costCenter = [], Id_storico = null) {
		let whereClauses = [];
	
			// Controllo per il parametro Entity (obbligatorio e array)
			if (Array.isArray(entity) && entity.length > 0) {
				whereClauses.push('"BUKRS" IN (' + entity.map(e => `'${e}'`).join(', ') + ')');
			} else {
				throw new Error("Il parametro 'Entity' è obbligatorio e deve essere un array.");
			}
		
			// Controllo per il parametro Tipo Contratto (obbligatorio e array)
			if (Array.isArray(tipoContratto) && tipoContratto.length > 0) {
				whereClauses.push('"RECNTYPE" IN (' + tipoContratto.map(tc => `'${tc}'`).join(', ') + ')');
			} else {
				throw new Error("Il parametro 'Tipo Contratto' è obbligatorio e deve essere un array.");
			}
		
			// Controllo per il parametro Contratto (facoltativo e array)
			if (contratto) {
				if (Array.isArray(contratto)) {
					if(contratto.length > 0){
						whereClauses.push('"RECNNR" IN (' + contratto.map(c => `'${c}'`).join(', ') + ')');
					}
				} else {
					whereClauses.push('"RECNNR" = \'' + contratto + '\'');
				}
			}
		
			// Controllo per il parametro Year (obbligatorio e non array)
			if (year !== null && year !== undefined) {
				whereClauses.push('"YEARDUEDATE" = \'' + year + '\'');
			} else {
				throw new Error("Il parametro 'Year' è obbligatorio.");
			}
		
			// Controllo per il parametro Period (obbligatorio e non array)
			if (period !== null && period !== undefined) {
				whereClauses.push('TO_INT("PERIODDUEDATE") <= ' + period);
			} else {
				throw new Error("Il parametro 'Period' è obbligatorio.");
			}
		
			// Controllo per il parametro Cost Center (facoltativo e array)
			if (Array.isArray(costCenter)) {
				if(costCenter.length > 0) {
					whereClauses.push('"IDENTOBJNR" IN (' + costCenter.map(cc => `'${cc}'`).join(', ') + ')');
				}
			} else if (costCenter) {
				whereClauses.push('"IDENTOBJNR" = \'' + costCenter + '\'');
			}
	
					// Controllo per il parametro Year (obbligatorio e non array)
			if (Id_storico !== null && Id_storico !== undefined) {
				whereClauses.push('"ID_STORICO" = \'' + Id_storico + '\'');
			} else {
				throw new Error("Il parametro 'Id_storico' è obbligatorio.");
			}
		
			// Costruzione della query finale
			let sqlQuery = ''; // Sostituisci con il nome della tua tabella
			if (whereClauses.length > 0) {
				sqlQuery += 'WHERE ' + whereClauses.join(' AND ');
			}
		
			return sqlQuery;
		}


async GetTabellaFiltrata(entity = [], tipoContratto = [], contratto = [], year = null, period = null, costCenter = [], Id_storico = null) {

	let query = await this.CreateQuery(entity, tipoContratto, contratto, year, period, costCenter, Id_storico)

	let queryWithMinor = await this.CreateQueryWithMinor(entity, tipoContratto, contratto, year, period, costCenter, Id_storico)

	this.log.info(query)
	this.log.info("query 2 ", queryWithMinor)



    try{
        const filteredTable = await cds.db.run(`SELECT "XMBEZ" AS "ASSET_CLASS",
    "INTERCOMPANY",
    "IDENTOBJNR" AS "CDC",
    "KTEXT" AS "CDC_CODE",
    "RECNTXTOLD" AS "LEASE_N",
    "RECNNR" AS "CONTRACT_CODE",
    "GSBER" AS "ACC_SECTOR",
    "RECNTXT" AS "CONTRACT_DESCRIPTION",
    "ZZSOCIETA" AS "MERGED_ENTITY",
    SUM("RIGHT_OF_USE") AS "RIGHT_OF_USE",
    SUM("ACCUMULATED_DEPRECIATION") AS "ACCUMULATED_DEPRECIATION",
    SUM("NET_RIGHT_OF_USE") AS "NET_RIGHT_OF_USE",
    SUM("CLOSING_LEASES_LIABILITIES") AS "CLOSING_LEASES_LIABILITIES",
    SUM("LEASE_LIABILITIES_SHORT_TERM") AS "LEASE_LIABILITIES_SHORT_TERM",
    SUM("LEASE_LIABILITIES_LONG_TERM") AS "LEASE_LIABILITIES_LONG_TERM",
    SUM("YTD_INTEREST") AS "YTD_INTEREST",
    SUM("LEASE_COST") AS "LEASE_COST",
    SUM("DEPRECIATION") AS "DEPRECIATION",
    SUM("GAIN_FX_RATES") AS "GAIN_FX_RATES",
    SUM("LOSS_FX_RATES") AS "LOSS_FX_RATES"
FROM (
-- Prima query

    SELECT "XMBEZ",
        CASE WHEN "ZZPARTNER" = '' THEN 'NO' ELSE 'YES' END AS "INTERCOMPANY",
        "IDENTOBJNR",
        "KTEXT",
        "RECNTXTOLD",
        "RECNNR",
        "GSBER",
        "RECNTXT",
        "ZZSOCIETA",
        TO_DECIMAL('0') AS "RIGHT_OF_USE",
        SUM("FONDO_AMM_CUM") AS "ACCUMULATED_DEPRECIATION",
        SUM("BBWHR_DEPRECIATION_SUM_END") AS "NET_RIGHT_OF_USE",
        SUM("BBWHR_LIABILITY_SUM_END") AS "CLOSING_LEASES_LIABILITIES",
        SUM(DEBITO_BTERM) AS "LEASE_LIABILITIES_SHORT_TERM",
        SUM(DEBITO_LTERM) + SUM("DEBITO_MTERM") AS "LEASE_LIABILITIES_LONG_TERM",
        TO_DECIMAL('0') AS "YTD_INTEREST",
        TO_DECIMAL('0') AS "LEASE_COST",
        TO_DECIMAL('0') AS "DEPRECIATION",
        TO_DECIMAL('0') AS "GAIN_FX_RATES",
        TO_DECIMAL('0') AS "LOSS_FX_RATES"
    FROM "CATALOGSERVICE_VIEW_ALL_DATA_V2"
    ${query}
       
    GROUP BY "XMBEZ",
        "ZZPARTNER",
        "IDENTOBJNR",
        "KTEXT",
        "RECNTXTOLD",
        "RECNNR",
        "GSBER",
        "RECNTXT",
        "ZZSOCIETA"
    UNION ALL 
-- Seconda query

    SELECT "XMBEZ",
        CASE WHEN "ZZPARTNER" = '' THEN 'NO' ELSE 'YES' END AS "INTERCOMPANY",
        "IDENTOBJNR",
        "KTEXT",
        "RECNTXTOLD",
        "RECNNR",
        "GSBER",
        "RECNTXT",
        "ZZSOCIETA",
        TO_DECIMAL('0') AS "RIGHT_OF_USE",
        TO_DECIMAL('0') AS "ACCUMULATED_DEPRECIATION",
        TO_DECIMAL('0') AS "NET_RIGHT_OF_USE",
        TO_DECIMAL('0') AS "CLOSING_LEASES_LIABILITIES",
        TO_DECIMAL('0') AS "LEASE_LIABILITIES_SHORT_TERM",
        TO_DECIMAL('0') AS "LEASE_LIABILITIES_LONG_TERM",
        SUM("BBWHR_INTEREST") AS "YTD_INTEREST",
        SUM("BBWHR_PAYMENT") AS "LEASE_COST",
        SUM("BBWHR_DEPRECIATION") AS "DEPRECIATION",
        SUM("GAIN") AS "GAIN_FX_RATES",
        SUM("LOSS") AS "LOSS_FX_RATES"
    FROM "CATALOGSERVICE_VIEW_ALL_DATA_V2"
    ${queryWithMinor}
         
    GROUP BY "XMBEZ",
        "ZZPARTNER",
        "IDENTOBJNR",
        "KTEXT",
        "RECNTXTOLD",
        "RECNNR",
        "GSBER",
        "RECNTXT",
        "ZZSOCIETA"
    UNION ALL
-- Terza query per il calcolo del RIGHT OF USE

    SELECT "XMBEZ",
        "INTERCOMPANY",
        "IDENTOBJNR",
        "KTEXT",
        "RECNTXTOLD",
        "RECNNR",
        "GSBER",
        "RECNTXT",
        "ZZSOCIETA",
        SUM("PRICE_EROU") + SUM("BBWHR_ACQUISITION") AS "RIGHT_OF_USE",
        TO_DECIMAL('0') AS "ACCUMULATED_DEPRECIATION",
        TO_DECIMAL('0') AS "NET_RIGHT_OF_USE",
        TO_DECIMAL('0') AS "CLOSING_LEASES_LIABILITIES",
        TO_DECIMAL('0') AS "LEASE_LIABILITIES_SHORT_TERM",
        TO_DECIMAL('0') AS "LEASE_LIABILITIES_LONG_TERM",
        TO_DECIMAL('0') AS "YTD_INTEREST",
        TO_DECIMAL('0') AS "LEASE_COST",
        TO_DECIMAL('0') AS "DEPRECIATION",
        TO_DECIMAL('0') AS "GAIN_FX_RATES",
        TO_DECIMAL('0') AS "LOSS_FX_RATES"
    FROM (
        SELECT t1."XMBEZ",
            CASE WHEN t1."ZZPARTNER" = '' THEN 'NO' ELSE 'YES' END AS "INTERCOMPANY",
            t1."IDENTOBJNR",
            t1."KTEXT",
            t1."RECNTXTOLD",
            t1."RECNNR",
            t1."GSBER",
            t1."RECNTXT",
            t1."ZZSOCIETA",
            CASE WHEN ((t1."PRICE_EROU" > 0.00) AND (NOT (t1."RECNDPO" = t1."RECNBEG")) AND (t1."RECNTXTOLD" != '')) THEN t1."BBWHR_ACQUISITION" * -1 ELSE 0 END AS "BBWHR_ACQUISITION",
            t1."PRICE_EROU"
        FROM "CATALOGSERVICE_VIEW_ALL_DATA_V2" t1
        JOIN (
            SELECT RECNNR,
                "IDENTOBJNR",
                "YEARDUEDATE",
                MIN("PERIODDUEDATE") AS min_period
            FROM "CATALOGSERVICE_VIEW_ALL_DATA_V2"
            ${queryWithMinor}
                  
            GROUP BY "RECNNR",
                "IDENTOBJNR",
                "YEARDUEDATE"
        ) t2 ON t1.RECNNR = t2.RECNNR AND t1."IDENTOBJNR" = t2."IDENTOBJNR" AND t1."PERIODDUEDATE" = t2.min_period AND t1."YEARDUEDATE" = t2."YEARDUEDATE"
        UNION ALL
        SELECT t1."XMBEZ",
            CASE WHEN t1."ZZPARTNER" = '' THEN 'NO' ELSE 'YES' END AS "INTERCOMPANY",
            t1."IDENTOBJNR",
            t1."KTEXT",
            t1."RECNTXTOLD",
            t1."RECNNR",
            t1."GSBER",
            t1."RECNTXT",
            t1."ZZSOCIETA",
            t1."BBWHR_ACQUISITION",
            t1."PRICE_EROU"
        FROM "CATALOGSERVICE_VIEW_ALL_DATA_V2" t1
         ${queryWithMinor}
               
    ) AS CalcRightOfUse
    GROUP BY "XMBEZ",
        "INTERCOMPANY",
        "IDENTOBJNR",
        "KTEXT",
        "RECNTXTOLD",
        "RECNNR",
        "GSBER",
        "RECNTXT",
        "ZZSOCIETA"
) AS all_results
GROUP BY "XMBEZ",
    "INTERCOMPANY",
    "IDENTOBJNR",
    "KTEXT",
    "RECNTXTOLD",
    "RECNNR",
    "GSBER",
    "RECNTXT",
    "ZZSOCIETA";`);
  

			console.log(filteredTable);
            return filteredTable

    }
    catch(error){
        this.log.error
        throw error
    }
}


async Filters() {
	console.log("Filters action invoked");
	
	const {GV_FILTRI_ID22} = cds.entities();

	this.log.info({GV_FILTRI_ID22});
	
	// Esegui la query con DISTINCT e logga i risultati
	const distinctData = await cds.run(
		SELECT.distinct.from('CATALOGSERVICE_GV_FILTRI_ID22').columns('BUTXT', 'RECNTYPE', 'RECNNR', 'YEARDUEDATE', 'PERIODDUEDATE', 'IDENTOBJNR', 'BUKRS', 'ID_STORICO')
	);
	
	console.log("Query executed, result:", distinctData);
	
	if (!distinctData || distinctData.length === 0) {
		console.warn("No data found.");
		return [];
	}
	
        // Usa Set per rimuovere automaticamente i duplicati
        const butxt = new Set();
        const recntype = new Set();
        const recnnr = new Set();
        const yearduedate = new Set();
        const periodduedate = new Set();
        const cdc = new Set();
        const bukrs = new Set();
		const id_storico = new Set();

        
        // Loop attraverso i dati distinti e popola i set
        distinctData.forEach(row => {
            butxt.add(row.BUTXT);
            recntype.add(row.RECNTYPE);
            recnnr.add(row.RECNNR);
            yearduedate.add(row.YEARDUEDATE);
            periodduedate.add(row.PERIODDUEDATE);
            cdc.add(row.IDENTOBJNR);
            bukrs.add(row.BUKRS);
			id_storico.add(row.ID_STORICO);

        });
        
        // Converte i set in array
        const BUTXT = Array.from(butxt);
        const RECNTYPE = Array.from(recntype);
        const RECNNR = Array.from(recnnr);
        const YEARDUEDATE = Array.from(yearduedate);
        const PERIODDUEDATE = Array.from(periodduedate);
        const CDC = Array.from(cdc);
        const BUKRS = Array.from(bukrs);
		const ID_STORICO = Array.from(id_storico);

        
        console.log("butxt array:", BUTXT);
        console.log("recntype array:", RECNTYPE);
        console.log("recnnr array:", RECNNR);
        console.log("yearduedate array:", YEARDUEDATE);
        console.log("periodduedate array:", PERIODDUEDATE);
        console.log("cdc array:", CDC);
        console.log("bukrs array:", BUKRS);
		console.log("Id_storico array:", ID_STORICO);
        
        // Ritorna gli array
        return {
            BUTXT: BUTXT,
            RECNTYPE: RECNTYPE,
            RECNNR: RECNNR,
            YEARDUEDATE: YEARDUEDATE,
            PERIODDUEDATE: PERIODDUEDATE,
            CDC: CDC,
            BUKRS: BUKRS,
			ID_STORICO: ID_STORICO
        };
}



async applyFilters(
    Id_storico = null,
    year = null, 
    period = null, 
    entity = [], 
    costCenter = [], 
    tipoContratto = [], 
    contratto = [], 
) {


    // Array che conterrà i valori
    let arrayNumeri = [];

    // Convertiamo il numero in intero
    let numero = parseInt(period);

    // Ciclo for che riempe l'array
    for (let i = numero; i >= 1; i--) {
        // Convertiamo il numero di nuovo in stringa e aggiungiamo gli zeri iniziali
        let stringaNumero = i.toString().padStart(3, '0');
        // Aggiungiamo la stringa all'array
        arrayNumeri.push(stringaNumero);
    }


    // Definizione dei filtri progressivi
    const whereClause = {};

    //primo filtro: entity (BUTXT)
    if (entity?.length > 0) {
        whereClause.BUKRS = entity;
    }

    // secondo filtro: tipoContratto (RECNTYPE), solo se il primo è stato selezionato
    if (tipoContratto?.length > 0) {
        whereClause.RECNTYPE = tipoContratto;
    }

    // Filtro per contratto (RECNNR), opzionale ma deve considerare i filtri precedenti
    if (contratto?.length > 0) {
        whereClause.RECNNR = contratto;
    }

    // Filtro per anno (YEARDUEDATE)
    if (year) {
        whereClause.YEARDUEDATE = year;
    }

    // Filtro per periodo (PERIODDUEDATE)
    if (period) {
        whereClause.PERIODDUEDATE = arrayNumeri;
    }

    // Filtro per centro di costo (IDENTOBJNR), si sblocca solo dopo year e period
    if (costCenter?.length > 0) {
        whereClause.IDENTOBJNR = costCenter;
    }

    // Filtro per storico (ID_STORICO), si sblocca dopo year e period
    if (Id_storico) {
        whereClause.ID_STORICO = Id_storico;
    }

    // Esegui la query di selezione con i filtri dinamici
    const filteredData = await cds.run(
        SELECT.distinct
            .from('CATALOGSERVICE_GV_FILTRI_ID22')
            .columns('BUTXT', 'RECNTYPE', 'RECNNR', 'YEARDUEDATE', 'PERIODDUEDATE', 'IDENTOBJNR', 'BUKRS', 'ID_STORICO')
            .where(whereClause)  // Inserisci la clausola WHERE dinamica
    );


    this.log.info("dati filtrati cascade", filteredData)
    this.log.info("clausola where per cascade", whereClause)

    // Usa Set per rimuovere automaticamente i duplicati dai risultati
    const butxt = new Set();
    const recntype = new Set();
    const recnnr = new Set();
    const yearduedate = new Set();
    const periodduedate = new Set();
    const cdc = new Set();
    const bukrs = new Set();
    const id_storico = new Set();

    // Popola i set con i risultati filtrati
    filteredData.forEach(row => {
        butxt.add(row.BUTXT);
        recntype.add(row.RECNTYPE);
        recnnr.add(row.RECNNR);
        yearduedate.add(row.YEARDUEDATE);
        periodduedate.add(row.PERIODDUEDATE);
        cdc.add(row.IDENTOBJNR);
        bukrs.add(row.BUKRS);
        id_storico.add(row.ID_STORICO);
    });

    // Converte i set in array
    const BUTXT = Array.from(butxt);
    const RECNTYPE = Array.from(recntype);
    const RECNNR = Array.from(recnnr);
    const YEARDUEDATE = Array.from(yearduedate);
    const PERIODDUEDATE = Array.from(periodduedate);
    const CDC = Array.from(cdc);
    const BUKRS = Array.from(bukrs);
    const ID_STORICO = Array.from(id_storico);

    console.log("butxt array:", BUTXT);
    console.log("recntype array:", RECNTYPE);
    console.log("recnnr array:", RECNNR);
    console.log("yearduedate array:", YEARDUEDATE);
    console.log("periodduedate array:", PERIODDUEDATE);
    console.log("cdc array:", CDC);
    console.log("bukrs array:", BUKRS);
    console.log("Id_storico array:", ID_STORICO);

    // Ritorna gli array filtrati
    return {
        BUTXT: BUTXT,
        RECNTYPE: RECNTYPE,
        RECNNR: RECNNR,
        YEARDUEDATE: YEARDUEDATE,
        PERIODDUEDATE: PERIODDUEDATE,
        CDC: CDC,
        BUKRS: BUKRS,
        ID_STORICO: ID_STORICO
    };
}


async applyFilters23(
    Id_storico = null,
    entity = [], 
    year = null, 
    period = null, 
    contratto = []
) {
    // Definizione dei filtri progressivi
    const whereClause = {};

        // Filtro per storico (ID_STORICO), si sblocca dopo year e period
    if (Id_storico) {
        whereClause.ID_STORICO = Id_storico;
    }

    //primo filtro: entity (BUTXT)
    if (entity?.length > 0) {
        whereClause.BUKRS = entity;
    }



    // Filtro per anno (YEARDUEDATE)
    if (year) {
        whereClause.YEARDUEDATE = year;
    }

    // Filtro per periodo (PERIODDUEDATE)
    if (period) {
        whereClause.PERIODDUEDATE = period;
    }

    // Filtro per contratto (RECNNR), opzionale ma deve considerare i filtri precedenti
    if (contratto?.length > 0) {
        whereClause.RECNNR = contratto;
    }


    // Esegui la query di selezione con i filtri dinamici
    const filteredData = await cds.run(
        SELECT.distinct
            .from('CATALOGSERVICE_GV_FILTRI_ID22')
            .columns('BUTXT', 'RECNTYPE', 'RECNNR', 'YEARDUEDATE', 'PERIODDUEDATE', 'IDENTOBJNR', 'BUKRS', 'ID_STORICO')
            .where(whereClause)  // Inserisci la clausola WHERE dinamica
    );


    this.log.info(filteredData)

    console.log("wherefiltri 23", whereClause)


    // Usa Set per rimuovere automaticamente i duplicati dai risultati
    const butxt = new Set();
    const recntype = new Set();
    const recnnr = new Set();
    const yearduedate = new Set();
    const periodduedate = new Set();
    const cdc = new Set();
    const bukrs = new Set();
    const id_storico = new Set();

    // Popola i set con i risultati filtrati
    filteredData.forEach(row => {
        butxt.add(row.BUTXT);
        recntype.add(row.RECNTYPE);
        recnnr.add(row.RECNNR);
        yearduedate.add(row.YEARDUEDATE);
        periodduedate.add(row.PERIODDUEDATE);
        cdc.add(row.IDENTOBJNR);
        bukrs.add(row.BUKRS);
        id_storico.add(row.ID_STORICO);
    });

    // Converte i set in array
    const BUTXT = Array.from(butxt);
    const RECNTYPE = Array.from(recntype);
    const RECNNR = Array.from(recnnr);
    const YEARDUEDATE = Array.from(yearduedate);
    const PERIODDUEDATE = Array.from(periodduedate);
    const CDC = Array.from(cdc);
    const BUKRS = Array.from(bukrs);
    const ID_STORICO = Array.from(id_storico);

    console.log("butxt array:", BUTXT);
    console.log("recntype array:", RECNTYPE);
    console.log("recnnr array:", RECNNR);
    console.log("yearduedate array:", YEARDUEDATE);
    console.log("periodduedate array:", PERIODDUEDATE);
    console.log("cdc array:", CDC);
    console.log("bukrs array:", BUKRS);
    console.log("Id_storico array:", ID_STORICO);

    // Ritorna gli array filtrati
    return {
        BUTXT: BUTXT,
        RECNTYPE: RECNTYPE,
        RECNNR: RECNNR,
        YEARDUEDATE: YEARDUEDATE,
        PERIODDUEDATE: PERIODDUEDATE,
        CDC: CDC,
        BUKRS: BUKRS,
        ID_STORICO: ID_STORICO
    };
}


async CreateQuery23(entity = [], contratto = [], year = null, period = null, Id_storico = null) {
    let whereClauses = [];

	    // Controllo per il parametro Entity (obbligatorio e array)
		if (Array.isArray(entity) && entity.length > 0) {
			whereClauses.push('"BUKRS" IN (' + entity.map(e => `'${e}'`).join(', ') + ')');
		} else {
			throw new Error("Il parametro 'Entity' è obbligatorio e deve essere un array.");
		}
	
		// Controllo per il parametro Contratto (facoltativo e array)
		if (contratto) {
			if (Array.isArray(contratto)) {
				if(contratto.length > 0){
					whereClauses.push('"RECNNR" IN (' + contratto.map(c => `'${c}'`).join(', ') + ')');
				}
			} else {
				whereClauses.push('"RECNNR" = \'' + contratto + '\'');
			}
		}
	
		// Controllo per il parametro Year (obbligatorio e non array)
		if (year !== null && year !== undefined) {
			whereClauses.push('"YEARDUEDATE" = \'' + year + '\'');
		} else {
			throw new Error("Il parametro 'Year' è obbligatorio.");
		}
	
		// Controllo per il parametro Period (obbligatorio e non array)
		if (period !== null && period !== undefined) {
			whereClauses.push('TO_INT("PERIODDUEDATE") = ' + period);
		} else {
			throw new Error("Il parametro 'Period' è obbligatorio.");
		}

		// Controllo per il parametro Year (obbligatorio e non array)
		if (Id_storico !== null && Id_storico !== undefined) {
			whereClauses.push('"ID_STORICO" = \'' + Id_storico + '\'');
		} else {
			throw new Error("Il parametro 'Id_storico' è obbligatorio.");
		}
	
		// Costruzione della query finale
		let sqlQuery = ''; // Sostituisci con il nome della tua tabella
		if (whereClauses.length > 0) {
			sqlQuery += 'WHERE ' + whereClauses.join(' AND ');
		}
	
		return sqlQuery;
	}

    async CreateQuery23WithMinor(entity = [], contratto = [], year = null, period = null, Id_storico = null) {
        let whereClauses = [];
    
            // Controllo per il parametro Entity (obbligatorio e array)
            if (Array.isArray(entity) && entity.length > 0) {
                whereClauses.push('"BUKRS" IN (' + entity.map(e => `'${e}'`).join(', ') + ')');
            } else {
                throw new Error("Il parametro 'Entity' è obbligatorio e deve essere un array.");
            }
        
            // Controllo per il parametro Contratto (facoltativo e array)
            if (contratto) {
                if (Array.isArray(contratto)) {
                    if(contratto.length > 0){
                        whereClauses.push('"RECNNR" IN (' + contratto.map(c => `'${c}'`).join(', ') + ')');
                    }
                } else {
                    whereClauses.push('"RECNNR" = \'' + contratto + '\'');
                }
            }
        
            // Controllo per il parametro Year (obbligatorio e non array)
            if (year !== null && year !== undefined) {
                whereClauses.push('"YEARDUEDATE" = \'' + year + '\'');
            } else {
                throw new Error("Il parametro 'Year' è obbligatorio.");
            }
        
            // Controllo per il parametro Period (obbligatorio e non array)
            if (period !== null && period !== undefined) {
                whereClauses.push('TO_INT("PERIODDUEDATE") <= ' + period);
            } else {
                throw new Error("Il parametro 'Period' è obbligatorio.");
            }
    
            // Controllo per il parametro Year (obbligatorio e non array)
            if (Id_storico !== null && Id_storico !== undefined) {
                whereClauses.push('"ID_STORICO" = \'' + Id_storico + '\'');
            } else {
                throw new Error("Il parametro 'Id_storico' è obbligatorio.");
            }
        
            // Costruzione della query finale
            let sqlQuery = ''; // Sostituisci con il nome della tua tabella
            if (whereClauses.length > 0) {
                sqlQuery += 'WHERE ' + whereClauses.join(' AND ');
            }
        
            return sqlQuery;
        }


async GetTabellaFiltrata23(entity = [], contratto = [], year = null, period = null, Id_storico = null){

    var test = []
    var test2=[]

    let query23 =await this.CreateQuery23(entity,  contratto, year, period, Id_storico)
    let queryMinor23 =await this.CreateQuery23WithMinor(entity,  contratto, year, period, Id_storico)


    try{
    const filteredTable = await cds.db.run(`SELECT "JOURNAL_TYPE",
    "ACCOUNT",
    "IDENTOBJNR",
    "RECNTXTOLD",
    "XMBEZ",
    "DEBIT",
    "CREDIT",
    "DEBIT_CURR",
    "CREDIT_CURR"
FROM (
        SELECT UPPER("JOURNAL_TYPE") "JOURNAL_TYPE",
            UPPER("ACCOUNT") "ACCOUNT",
            "IDENTOBJNR",
            "RECNTXTOLD",
            "XMBEZ",
            SUM("DEBIT") "DEBIT",
            SUM("CREDIT") "CREDIT",
            SUM("DEBIT_CURR") "DEBIT_CURR",
            SUM("CREDIT_CURR") "CREDIT_CURR"
        FROM "CATALOGSERVICE_VIEW_CAP_REPORT_23_EQ"
        ${query23}
        GROUP BY "JOURNAL_TYPE",
            "ACCOUNT",
            "IDENTOBJNR",
            "RECNTXTOLD",
            "XMBEZ"
        UNION ALL
        SELECT UPPER("JOURNAL_TYPE") "JOURNAL_TYPE",
            UPPER("ACCOUNT") "ACCOUNT",
            "IDENTOBJNR",
            "RECNTXTOLD",
            "XMBEZ",
            SUM("DEBIT") "DEBIT",
            SUM("CREDIT") "CREDIT",
            SUM("DEBIT_CURR") "DEBIT_CURR",
            SUM("CREDIT_CURR") "CREDIT_CURR"
        FROM "CATALOGSERVICE_VIEW_CAP_REPORT23_LT"
        ${queryMinor23}
        GROUP BY "JOURNAL_TYPE",
            "ACCOUNT",
            "IDENTOBJNR",
            "RECNTXTOLD",
            "XMBEZ")
ORDER BY "JOURNAL_TYPE",
    "ACCOUNT"`)

console.log(filteredTable);

console.log("query 23 ",query23)
console.log("query 23 minor ",queryMinor23)
return filteredTable

}
catch(error){
this.log.error
throw error
}


    
}

async applyFilters9(
    Id_storico = null,
    entity = [], 
    year = null, 
    period = null, 
    costCenter = [],
    contratto = []
) {
 
    // Array che conterrà i valori
    let arrayNumeri = [];

    // Convertiamo il numero in intero
    let numero = parseInt(period);

    // Ciclo for che riempe l'array
    for (let i = numero; i >= 1; i--) {
        // Convertiamo il numero di nuovo in stringa e aggiungiamo gli zeri iniziali
        let stringaNumero = i.toString().padStart(3, '0');
        // Aggiungiamo la stringa all'array
        arrayNumeri.push(stringaNumero);
    }


    // Definizione dei filtri progressivi
    const whereClause = {};

    //primo filtro: entity (BUTXT)
    if (entity?.length > 0) {
        whereClause.BUKRS = entity;
    }

    // Filtro per contratto (RECNNR), opzionale ma deve considerare i filtri precedenti
    if (contratto?.length > 0) {
        whereClause.RECNNR = contratto;
    }

    // Filtro per anno (YEARDUEDATE)
    if (year) {
        whereClause.YEARDUEDATE = year;
    }

    // Filtro per periodo (PERIODDUEDATE)
    if (period) {
        whereClause.PERIODDUEDATE = arrayNumeri;
    }

    // Filtro per centro di costo (IDENTOBJNR), si sblocca solo dopo year e period
    if (costCenter?.length > 0) {
        whereClause.IDENTOBJNR = costCenter;
    }

    // Filtro per storico (ID_STORICO), si sblocca dopo year e period
    if (Id_storico) {
        whereClause.ID_STORICO = Id_storico;
    }

    // Esegui la query di selezione con i filtri dinamici
    const filteredData = await cds.run(
        SELECT.distinct
            .from('CATALOGSERVICE_GV_FILTRI_ID22')
            .columns('BUTXT', 'RECNTYPE', 'RECNNR', 'YEARDUEDATE', 'PERIODDUEDATE', 'IDENTOBJNR', 'BUKRS', 'ID_STORICO')
            .where(whereClause)  // Inserisci la clausola WHERE dinamica
    );


    this.log.info(filteredData)

    // Usa Set per rimuovere automaticamente i duplicati dai risultati
    const butxt = new Set();
    const yearduedate = new Set();
    const periodduedate = new Set();
    const bukrs = new Set();
    const id_storico = new Set();
    const cdc = new Set();
    const recnnr = new Set();

    // Popola i set con i risultati filtrati
    filteredData.forEach(row => {
        butxt.add(row.BUTXT);
        yearduedate.add(row.YEARDUEDATE);
        periodduedate.add(row.PERIODDUEDATE);
        bukrs.add(row.BUKRS);
        cdc.add(row.IDENTOBJNR);
        id_storico.add(row.ID_STORICO)
        recnnr.add(row.RECNNR)
    });

    // Converte i set in array
    const BUTXT = Array.from(butxt);
    const YEARDUEDATE = Array.from(yearduedate);
    const PERIODDUEDATE = Array.from(periodduedate);
    const BUKRS = Array.from(bukrs);
    const ID_STORICO = Array.from(id_storico);
    const CDC = Array.from(cdc);
    const RECNNR = Array.from(recnnr);


    console.log("butxt array:", BUTXT);
    console.log("yearduedate array:", YEARDUEDATE);
    console.log("periodduedate array:", PERIODDUEDATE);
    console.log("bukrs array:", BUKRS);
    console.log("bukrs array:", ID_STORICO);
    console.log("bukrs array:", CDC);
    console.log("bukrs array:", RECNNR);

    // Ritorna gli array filtrati
    return {
        BUTXT: BUTXT,
        YEARDUEDATE: YEARDUEDATE,
        PERIODDUEDATE: PERIODDUEDATE,
        BUKRS: BUKRS,
        ID_STORICO: ID_STORICO,
        CDC: CDC,
        RECNNR: RECNNR,
    };
}


async CreateQuery9(entity = [], contratto = [], year = null, period = null, costCenter = [], Id_storico = null) {
    let whereClauses = [];

	    // Controllo per il parametro Entity (obbligatorio e array)
		if (Array.isArray(entity) && entity.length > 0) {
			whereClauses.push('"BUKRS" IN (' + entity.map(e => `'${e}'`).join(', ') + ')');
		} else {
			throw new Error("Il parametro 'Entity' è obbligatorio e deve essere un array.");
		}
	
		// Controllo per il parametro Contratto (facoltativo e array)
		if (contratto) {
			if (Array.isArray(contratto)) {
				if(contratto.length > 0){
					whereClauses.push('"RECNNR" IN (' + contratto.map(c => `'${c}'`).join(', ') + ')');
				}
			} else {
				whereClauses.push('"RECNNR" = \'' + contratto + '\'');
			}
		}
	
		// Controllo per il parametro Year (obbligatorio e non array)
		if (year !== null && year !== undefined) {
			whereClauses.push('"YEARDUEDATE" = \'' + year + '\'');
		} else {
			throw new Error("Il parametro 'Year' è obbligatorio.");
		}
	
		// Controllo per il parametro Period (obbligatorio e non array)
		if (period !== null && period !== undefined) {
			whereClauses.push('TO_INT("PERIODDUEDATE") = ' + period);
		} else {
			throw new Error("Il parametro 'Period' è obbligatorio.");
		}
	
		// Controllo per il parametro Cost Center (facoltativo e array)
		if (Array.isArray(costCenter)) {
			if(costCenter.length > 0) {
				whereClauses.push('"IDENTOBJNR" IN (' + costCenter.map(cc => `'${cc}'`).join(', ') + ')');
			}
		} else if (costCenter) {
			whereClauses.push('"IDENTOBJNR" = \'' + costCenter + '\'');
		}

				// Controllo per il parametro Year (obbligatorio e non array)
		if (Id_storico !== null && Id_storico !== undefined) {
			whereClauses.push('"ID_STORICO" = \'' + Id_storico + '\'');
		} else {
			throw new Error("Il parametro 'Id_storico' è obbligatorio.");
		}
	
		// Costruzione della query finale
		let sqlQuery = ''; // Sostituisci con il nome della tua tabella
		if (whereClauses.length > 0) {
			sqlQuery += 'WHERE ' + whereClauses.join(' AND ');
		}
	
		return sqlQuery;
	}


    async GetTabellaFiltrata9(entity = [], contratto = [], year = null, period = null, costCenter = [], Id_storico = null){
    
        let query9 =await this.CreateQuery9(entity, contratto, year, period, costCenter, Id_storico)

        let bukrs = entity.map(e => `'${e}'`).join(', ')
        let recnnr = contratto.map(e => `'${e}'`).join(', ')
        let cdc = costCenter.map(e => `'${e}'`).join(', ')
       
    
    
        try{
        const filteredTable = await cds.db.run(`SELECT "Journal_Type",
	"Account",
	SUM("Land") AS "Land",
	SUM("Building") AS "Building",
	SUM("Guest_quarters_in_pool") AS "Guest_quarters_in_pool",
	SUM("Guest_quarters_in_benefit") AS "Guest_quarters_in_benefit",
	SUM("Garage_in_pool") AS "Garage_in_pool",
	SUM("Garage_in_benefit") AS "Garage_in_benefit",
	SUM("Productive_machinery") AS "Productive_machinery",
	SUM("Plants") AS "Plants",
	SUM("Other_productive_equipment") AS "Other_productive_equipment",
	SUM("Other_motor_vehicles") AS "Other_motor_vehicles",
	SUM("In_house_handling_equipment") AS "In_house_handling_equipment",
	SUM("Hardware") AS "Hardware",
	SUM("Other_assets") AS "Other_assets",
	SUM("Cars_in_pool") AS "Cars_in_pool",
	SUM("Cars_in_benefit") AS "Cars_in_benefit"
FROM (
		SELECT 'Opening' AS "Journal_Type",
			'Right_of_Use' AS "Account",
			YEARDUEDATE,
			MIN(PERIODDUEDATE) AS "Period",
			SUM(CASE WHEN RECNTYPE = 'I001' THEN ((BBWHR_DEPRECIATION_SUM_BEG + FONDO_AMM_CUM) - BBWHR_DEPRECIATION) ELSE 0 END) AS "Land",
			SUM(CASE WHEN RECNTYPE = 'I002' THEN ((BBWHR_DEPRECIATION_SUM_BEG + FONDO_AMM_CUM) - BBWHR_DEPRECIATION) ELSE 0 END) AS "Building",
			SUM(CASE WHEN RECNTYPE = 'I003' THEN ((BBWHR_DEPRECIATION_SUM_BEG + FONDO_AMM_CUM) - BBWHR_DEPRECIATION) ELSE 0 END) AS "Guest_quarters_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I004' THEN ((BBWHR_DEPRECIATION_SUM_BEG + FONDO_AMM_CUM) - BBWHR_DEPRECIATION) ELSE 0 END) AS "Guest_quarters_in_benefit",
			SUM(CASE WHEN RECNTYPE = 'I005' THEN ((BBWHR_DEPRECIATION_SUM_BEG + FONDO_AMM_CUM) - BBWHR_DEPRECIATION) ELSE 0 END) AS "Garage_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I006' THEN ((BBWHR_DEPRECIATION_SUM_BEG + FONDO_AMM_CUM) - BBWHR_DEPRECIATION) ELSE 0 END) AS "Garage_in_benefit",
			SUM(CASE WHEN RECNTYPE = 'I007' THEN ((BBWHR_DEPRECIATION_SUM_BEG + FONDO_AMM_CUM) - BBWHR_DEPRECIATION) ELSE 0 END) AS "Productive_machinery",
			SUM(CASE WHEN RECNTYPE = 'I008' THEN ((BBWHR_DEPRECIATION_SUM_BEG + FONDO_AMM_CUM) - BBWHR_DEPRECIATION) ELSE 0 END) AS "Plants",
			SUM(CASE WHEN RECNTYPE = 'I009' THEN ((BBWHR_DEPRECIATION_SUM_BEG + FONDO_AMM_CUM) - BBWHR_DEPRECIATION) ELSE 0 END) AS "Other_productive_equipment",
			SUM(CASE WHEN RECNTYPE = 'I010' THEN ((BBWHR_DEPRECIATION_SUM_BEG + FONDO_AMM_CUM) - BBWHR_DEPRECIATION) ELSE 0 END) AS "Other_motor_vehicles",
			SUM(CASE WHEN RECNTYPE = 'I011' THEN ((BBWHR_DEPRECIATION_SUM_BEG + FONDO_AMM_CUM) - BBWHR_DEPRECIATION) ELSE 0 END) AS "In_house_handling_equipment",
			SUM(CASE WHEN RECNTYPE = 'I012' THEN ((BBWHR_DEPRECIATION_SUM_BEG + FONDO_AMM_CUM) - BBWHR_DEPRECIATION) ELSE 0 END) AS "Hardware",
			SUM(CASE WHEN RECNTYPE = 'I013' THEN ((BBWHR_DEPRECIATION_SUM_BEG + FONDO_AMM_CUM) - BBWHR_DEPRECIATION) ELSE 0 END) AS "Other_assets",
			SUM(CASE WHEN RECNTYPE = 'I014' THEN ((BBWHR_DEPRECIATION_SUM_BEG + FONDO_AMM_CUM) - BBWHR_DEPRECIATION) ELSE 0 END) AS "Cars_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I015' THEN ((BBWHR_DEPRECIATION_SUM_BEG + FONDO_AMM_CUM) - BBWHR_DEPRECIATION) ELSE 0 END) AS "Cars_in_benefit"
		FROM "CATALOGSERVICE_VIEW_IMA_LETTURA"
		GROUP BY YEARDUEDATE
		UNION ALL
		SELECT 'Opening' AS "Journal_Type",
			'Fondo_ammortamento' AS "Account",
			YEARDUEDATE,
			MIN(PERIODDUEDATE) AS "Period",
			SUM(CASE WHEN RECNTYPE = 'I001' THEN FONDO_AMM_CUM ELSE 0 END) AS "Land",
			SUM(CASE WHEN RECNTYPE = 'I002' THEN FONDO_AMM_CUM ELSE 0 END) AS "Building",
			SUM(CASE WHEN RECNTYPE = 'I003' THEN FONDO_AMM_CUM ELSE 0 END) AS "Guest_quarters_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I004' THEN FONDO_AMM_CUM ELSE 0 END) AS "Guest_quarters_in_benefit",
			SUM(CASE WHEN RECNTYPE = 'I005' THEN FONDO_AMM_CUM ELSE 0 END) AS "Garage_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I006' THEN FONDO_AMM_CUM ELSE 0 END) AS "Garage_in_benefit",
			SUM(CASE WHEN RECNTYPE = 'I007' THEN FONDO_AMM_CUM ELSE 0 END) AS "Productive_machinery",
			SUM(CASE WHEN RECNTYPE = 'I008' THEN FONDO_AMM_CUM ELSE 0 END) AS "Plants",
			SUM(CASE WHEN RECNTYPE = 'I009' THEN FONDO_AMM_CUM ELSE 0 END) AS "Other_productive_equipment",
			SUM(CASE WHEN RECNTYPE = 'I010' THEN FONDO_AMM_CUM ELSE 0 END) AS "Other_motor_vehicles",
			SUM(CASE WHEN RECNTYPE = 'I011' THEN FONDO_AMM_CUM ELSE 0 END) AS "In_house_handling_equipment",
			SUM(CASE WHEN RECNTYPE = 'I012' THEN FONDO_AMM_CUM ELSE 0 END) AS "Hardware",
			SUM(CASE WHEN RECNTYPE = 'I013' THEN FONDO_AMM_CUM ELSE 0 END) AS "Other_assets",
			SUM(CASE WHEN RECNTYPE = 'I014' THEN FONDO_AMM_CUM ELSE 0 END) AS "Cars_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I015' THEN FONDO_AMM_CUM ELSE 0 END) AS "Cars_in_benefit"
		FROM "CATALOGSERVICE_VIEW_IMA_LETTURA"
		GROUP BY YEARDUEDATE
		UNION ALL
		SELECT 'Opening' AS "Journal_Type",
			'Rou_a_inizio_anno' AS "Account",
			YEARDUEDATE,
			MIN(PERIODDUEDATE) AS "Period",
			SUM(CASE WHEN RECNTYPE = 'I001' THEN BBWHR_DEPRECIATION_SUM_BEG ELSE 0 END) AS "Land",
			SUM(CASE WHEN RECNTYPE = 'I002' THEN BBWHR_DEPRECIATION_SUM_BEG ELSE 0 END) AS "Building",
			SUM(CASE WHEN RECNTYPE = 'I003' THEN BBWHR_DEPRECIATION_SUM_BEG ELSE 0 END) AS "Guest_quarters_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I004' THEN BBWHR_DEPRECIATION_SUM_BEG ELSE 0 END) AS "Guest_quarters_in_benefit",
			SUM(CASE WHEN RECNTYPE = 'I005' THEN BBWHR_DEPRECIATION_SUM_BEG ELSE 0 END) AS "Garage_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I006' THEN BBWHR_DEPRECIATION_SUM_BEG ELSE 0 END) AS "Garage_in_benefit",
			SUM(CASE WHEN RECNTYPE = 'I007' THEN BBWHR_DEPRECIATION_SUM_BEG ELSE 0 END) AS "Productive_machinery",
			SUM(CASE WHEN RECNTYPE = 'I008' THEN BBWHR_DEPRECIATION_SUM_BEG ELSE 0 END) AS "Plants",
			SUM(CASE WHEN RECNTYPE = 'I009' THEN BBWHR_DEPRECIATION_SUM_BEG ELSE 0 END) AS "Other_productive_equipment",
			SUM(CASE WHEN RECNTYPE = 'I010' THEN BBWHR_DEPRECIATION_SUM_BEG ELSE 0 END) AS "Other_motor_vehicles",
			SUM(CASE WHEN RECNTYPE = 'I011' THEN BBWHR_DEPRECIATION_SUM_BEG ELSE 0 END) AS "In_house_handling_equipment",
			SUM(CASE WHEN RECNTYPE = 'I012' THEN BBWHR_DEPRECIATION_SUM_BEG ELSE 0 END) AS "Hardware",
			SUM(CASE WHEN RECNTYPE = 'I013' THEN BBWHR_DEPRECIATION_SUM_BEG ELSE 0 END) AS "Other_assets",
			SUM(CASE WHEN RECNTYPE = 'I014' THEN BBWHR_DEPRECIATION_SUM_BEG ELSE 0 END) AS "Cars_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I015' THEN BBWHR_DEPRECIATION_SUM_BEG ELSE 0 END) AS "Cars_in_benefit"
		FROM "CATALOGSERVICE_VIEW_IMA_LETTURA"
		GROUP BY YEARDUEDATE
		UNION ALL
		SELECT 'Movements' AS "Journal_Type",
			'Increase_for_new_contract' AS "Account",
			YEARDUEDATE,
			MIN(PERIODDUEDATE) AS "Period",
			SUM(CASE WHEN RECNTYPE = 'I001' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Land",
			SUM(CASE WHEN RECNTYPE = 'I002' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Building",
			SUM(CASE WHEN RECNTYPE = 'I003' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Guest_quarters_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I004' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Guest_quarters_in_benefit",
			SUM(CASE WHEN RECNTYPE = 'I005' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Garage_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I006' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Garage_in_benefit",
			SUM(CASE WHEN RECNTYPE = 'I007' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Productive_machinery",
			SUM(CASE WHEN RECNTYPE = 'I008' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Plants",
			SUM(CASE WHEN RECNTYPE = 'I009' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Other_productive_equipment",
			SUM(CASE WHEN RECNTYPE = 'I010' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Other_motor_vehicles",
			SUM(CASE WHEN RECNTYPE = 'I011' THEN BBWHR_ACQUISITION ELSE 0 END) AS "In_house_handling_equipment",
			SUM(CASE WHEN RECNTYPE = 'I012' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Hardware",
			SUM(CASE WHEN RECNTYPE = 'I013' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Other_assets",
			SUM(CASE WHEN RECNTYPE = 'I014' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Cars_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I015' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Cars_in_benefit"
		FROM "CATALOGSERVICE_VIEW_IMA_LETTURA"
		WHERE SUBSTRING(RECNBEG, 1, 4) = '${year}' -- Confronta anno

			AND TO_INT(SUBSTRING(RECNBEG, 5, 2)) <= ${period} -- Confronta mese, aggiungendo uno zero se necessario

            AND BUKRS IN (${bukrs})
            AND RECNNR IN (${recnnr})
            AND IDENTOBJNR IN (${cdc})
            AND ID_STORICO = '${Id_storico}'

			AND (RECNTXTOLD = 'NULL'
			OR RECNTXTOLD = '')
		GROUP BY YEARDUEDATE
		UNION ALL
		SELECT 'Movements' AS "Journal_Type",
			'Increase_for_Extraordinary_operation_Right_of_Use' AS "Account",
			YEARDUEDATE,
			MIN(PERIODDUEDATE) AS "Period",
			SUM(CASE WHEN RECNTYPE = 'I001' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Land",
			SUM(CASE WHEN RECNTYPE = 'I002' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Building",
			SUM(CASE WHEN RECNTYPE = 'I003' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Guest_quarters_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I004' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Guest_quarters_in_benefit",
			SUM(CASE WHEN RECNTYPE = 'I005' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Garage_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I006' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Garage_in_benefit",
			SUM(CASE WHEN RECNTYPE = 'I007' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Productive_machinery",
			SUM(CASE WHEN RECNTYPE = 'I008' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Plants",
			SUM(CASE WHEN RECNTYPE = 'I009' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Other_productive_equipment",
			SUM(CASE WHEN RECNTYPE = 'I010' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Other_motor_vehicles",
			SUM(CASE WHEN RECNTYPE = 'I011' THEN BBWHR_ACQUISITION ELSE 0 END) AS "In_house_handling_equipment",
			SUM(CASE WHEN RECNTYPE = 'I012' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Hardware",
			SUM(CASE WHEN RECNTYPE = 'I013' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Other_assets",
			SUM(CASE WHEN RECNTYPE = 'I014' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Cars_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I015' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Cars_in_benefit"
		FROM "CATALOGSERVICE_VIEW_IMA_LETTURA"
		WHERE SUBSTRING(RECNBEG, 1, 4) = '${year}' -- Confronta anno

			AND TO_INT(SUBSTRING(RECNBEG, 5, 2)) <= ${period} -- Confronta mese, aggiungendo uno zero se necessario

            AND BUKRS IN (${bukrs})
            AND RECNNR IN (${recnnr})
            AND IDENTOBJNR IN (${cdc})
            AND ID_STORICO = '${Id_storico}'

			AND (RECNTXTOLD = 'NULL'
			OR RECNTXTOLD = '')
			AND (ZZSOCIETA IS NOT NULL
			OR ZZSOCIETA != '')
		GROUP BY YEARDUEDATE
		UNION ALL
		SELECT 'Movements' AS "Journal_Type",
			'Decrease for early termination- Accumulated Depreciation' AS "Account",
			YEARDUEDATE,
			"PERIODDUEDATE",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I001' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Land",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I002' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Building",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I003' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Guest_quarters_in_pool",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I004' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Guest_quarters_in_benefit",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I005' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Garage_in_pool",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I006' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Garage_in_benefit",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I007' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Productive_machinery",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I008' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Plants",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I009' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Other_productive_equipment",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I010' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Other_motor_vehicles",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I011' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "In_house_handling_equipment",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I012' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Hardware",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I013' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Other_assets",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I014' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Cars_in_pool",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I015' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Cars_in_benefit"
		FROM "CATALOGSERVICE_VIEW_IMA_LETTURA",
			"CATALOGSERVICE_VIEW_ZRE_SUMDEP"
		WHERE "CATALOGSERVICE_VIEW_IMA_LETTURA"."BUKRS" = "CATALOGSERVICE_VIEW_ZRE_SUMDEP"."BUKRS"
			AND "CATALOGSERVICE_VIEW_IMA_LETTURA"."RECNNR" = "CATALOGSERVICE_VIEW_ZRE_SUMDEP"."RECNNR"
			AND "RECNNOTPER" IS NOT NULL
			AND SUBSTRING(RECNENDABS, 0, 4) = '${year}'
			AND TO_INT(SUBSTRING(RECNENDABS, 5, 2)) <= ${period}
            AND "CATALOGSERVICE_VIEW_IMA_LETTURA"."BUKRS" IN (${bukrs})
            AND "CATALOGSERVICE_VIEW_IMA_LETTURA"."RECNNR" IN (${recnnr})
            AND IDENTOBJNR IN (${cdc})
            AND ID_STORICO = '${Id_storico}'
		GROUP BY YEARDUEDATE,
			"PERIODDUEDATE"
		UNION ALL
		SELECT 'Movements' AS "Journal_Type",
			'Decrease for early termination- Accumulated Depreciation' AS "Account",
			YEARDUEDATE,
			"PERIODDUEDATE",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I001' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Land",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I002' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Building",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I003' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Guest_quarters_in_pool",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I004' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Guest_quarters_in_benefit",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I005' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Garage_in_pool",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I006' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Garage_in_benefit",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I007' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Productive_machinery",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I008' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Plants",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I009' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Other_productive_equipment",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I010' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Other_motor_vehicles",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I011' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "In_house_handling_equipment",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I012' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Hardware",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I013' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Other_assets",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I014' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Cars_in_pool",
			SUM(CASE WHEN CATALOGSERVICE_VIEW_IMA_LETTURA.RECNTYPE = 'I015' THEN (CASE WHEN "RECNCNCURR" = 'T001-WAERS' THEN "ZZDEPR_FUND_INT" ELSE "ZZDEPR_FUND_VAL" END) ELSE 0 END) AS "Cars_in_benefit"
		FROM "CATALOGSERVICE_VIEW_IMA_LETTURA",
			"CATALOGSERVICE_VIEW_ZRE_SUMDEP"
		WHERE "CATALOGSERVICE_VIEW_IMA_LETTURA"."BUKRS" = "CATALOGSERVICE_VIEW_ZRE_SUMDEP"."BUKRS"
			AND "CATALOGSERVICE_VIEW_IMA_LETTURA"."RECNNR" = "CATALOGSERVICE_VIEW_ZRE_SUMDEP"."RECNNR"
			AND "RECNNOTPER" IS NULL
			AND SUBSTRING(RECNENDABS, 0, 4) = '${year}'
			AND TO_INT(SUBSTRING(RECNENDABS, 5, 2)) <= ${period}
            AND "CATALOGSERVICE_VIEW_IMA_LETTURA"."BUKRS" IN (${bukrs})
            AND "CATALOGSERVICE_VIEW_IMA_LETTURA"."RECNNR" IN (${recnnr})
            AND IDENTOBJNR IN (${cdc})
            AND ID_STORICO = '${Id_storico}'
		GROUP BY YEARDUEDATE,
			"PERIODDUEDATE"
		UNION ALL
		SELECT 'Movements' AS "Journal_Type",
			'Increase for Extraordinary operation- Right of Use' AS "Account",
			YEARDUEDATE,
			"PERIODDUEDATE",
			SUM(CASE WHEN RECNTYPE = 'I001' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Land",
			SUM(CASE WHEN RECNTYPE = 'I002' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Building",
			SUM(CASE WHEN RECNTYPE = 'I003' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Guest_quarters_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I004' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Guest_quarters_in_benefit",
			SUM(CASE WHEN RECNTYPE = 'I005' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Garage_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I006' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Garage_in_benefit",
			SUM(CASE WHEN RECNTYPE = 'I007' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Productive_machinery",
			SUM(CASE WHEN RECNTYPE = 'I008' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Plants",
			SUM(CASE WHEN RECNTYPE = 'I009' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Other_productive_equipment",
			SUM(CASE WHEN RECNTYPE = 'I010' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Other_motor_vehicles",
			SUM(CASE WHEN RECNTYPE = 'I011' THEN BBWHR_ACQUISITION ELSE 0 END) AS "In_house_handling_equipment",
			SUM(CASE WHEN RECNTYPE = 'I012' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Hardware",
			SUM(CASE WHEN RECNTYPE = 'I013' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Other_assets",
			SUM(CASE WHEN RECNTYPE = 'I014' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Cars_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I015' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Cars_in_benefit"
		FROM "CATALOGSERVICE_VIEW_IMA_LETTURA"
		WHERE "ZZSOCIETA" != NULL 
        AND BUKRS IN (${bukrs})
        AND RECNNR IN (${recnnr})
        AND IDENTOBJNR IN (${cdc})
        AND ID_STORICO = '${Id_storico}'
        AND YEARDUEDATE = '${year}'
        AND TO_INT(PERIODDUEDATE) <= ${period}

		GROUP BY YEARDUEDATE,
			"PERIODDUEDATE"
		UNION ALL
		SELECT 'Movements' AS "Journal_Type",
			'Increase for Extraordinary operation - Accumulated Depreciation' AS "Account",
			YEARDUEDATE,
			"PERIODDUEDATE",
			SUM(CASE WHEN RECNTYPE = 'I001' THEN PRICE_ZFAM ELSE 0 END) AS "Land",
			SUM(CASE WHEN RECNTYPE = 'I002' THEN PRICE_ZFAM ELSE 0 END) AS "Building",
			SUM(CASE WHEN RECNTYPE = 'I003' THEN PRICE_ZFAM ELSE 0 END) AS "Guest_quarters_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I004' THEN PRICE_ZFAM ELSE 0 END) AS "Guest_quarters_in_benefit",
			SUM(CASE WHEN RECNTYPE = 'I005' THEN PRICE_ZFAM ELSE 0 END) AS "Garage_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I006' THEN PRICE_ZFAM ELSE 0 END) AS "Garage_in_benefit",
			SUM(CASE WHEN RECNTYPE = 'I007' THEN PRICE_ZFAM ELSE 0 END) AS "Productive_machinery",
			SUM(CASE WHEN RECNTYPE = 'I008' THEN PRICE_ZFAM ELSE 0 END) AS "Plants",
			SUM(CASE WHEN RECNTYPE = 'I009' THEN PRICE_ZFAM ELSE 0 END) AS "Other_productive_equipment",
			SUM(CASE WHEN RECNTYPE = 'I010' THEN PRICE_ZFAM ELSE 0 END) AS "Other_motor_vehicles",
			SUM(CASE WHEN RECNTYPE = 'I011' THEN PRICE_ZFAM ELSE 0 END) AS "In_house_handling_equipment",
			SUM(CASE WHEN RECNTYPE = 'I012' THEN PRICE_ZFAM ELSE 0 END) AS "Hardware",
			SUM(CASE WHEN RECNTYPE = 'I013' THEN PRICE_ZFAM ELSE 0 END) AS "Other_assets",
			SUM(CASE WHEN RECNTYPE = 'I014' THEN PRICE_ZFAM ELSE 0 END) AS "Cars_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I015' THEN PRICE_ZFAM ELSE 0 END) AS "Cars_in_benefit"
		FROM "CATALOGSERVICE_VIEW_IMA_LETTURA"
		WHERE "ZZSOCIETA" != NULL 
        AND BUKRS IN (${bukrs})
        AND RECNNR IN (${recnnr})
        AND IDENTOBJNR IN (${cdc})
        AND ID_STORICO = '${Id_storico}'
        AND YEARDUEDATE = '${year}'
        AND TO_INT(PERIODDUEDATE) <= ${period}

		GROUP BY YEARDUEDATE,
			"PERIODDUEDATE"
		UNION ALL
		SELECT 'Movements' AS "Journal_Type",
			'Decrease for Extraordinary operation - Accumulated Depreciation' AS "Account",
			YEARDUEDATE,
			"PERIODDUEDATE",
			SUM(CASE WHEN RECNTYPE = 'I001' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Land",
			SUM(CASE WHEN RECNTYPE = 'I002' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Building",
			SUM(CASE WHEN RECNTYPE = 'I003' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Guest_quarters_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I004' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Guest_quarters_in_benefit",
			SUM(CASE WHEN RECNTYPE = 'I005' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Garage_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I006' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Garage_in_benefit",
			SUM(CASE WHEN RECNTYPE = 'I007' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Productive_machinery",
			SUM(CASE WHEN RECNTYPE = 'I008' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Plants",
			SUM(CASE WHEN RECNTYPE = 'I009' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Other_productive_equipment",
			SUM(CASE WHEN RECNTYPE = 'I010' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Other_motor_vehicles",
			SUM(CASE WHEN RECNTYPE = 'I011' THEN BBWHR_ACQUISITION ELSE 0 END) AS "In_house_handling_equipment",
			SUM(CASE WHEN RECNTYPE = 'I012' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Hardware",
			SUM(CASE WHEN RECNTYPE = 'I013' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Other_assets",
			SUM(CASE WHEN RECNTYPE = 'I014' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Cars_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I015' THEN BBWHR_ACQUISITION ELSE 0 END) AS "Cars_in_benefit"
		FROM "CATALOGSERVICE_VIEW_IMA_LETTURA"
		WHERE "RECNNOTREASON" = '02' 
        AND BUKRS IN (${bukrs})
        AND RECNNR IN (${recnnr})
        AND IDENTOBJNR IN (${cdc})
        AND ID_STORICO = '${Id_storico}'
        AND YEARDUEDATE = '${year}'
        AND TO_INT(PERIODDUEDATE) <= ${period}

		GROUP BY YEARDUEDATE,
			"PERIODDUEDATE"
		UNION ALL
		SELECT 'Movements' AS "Journal_Type",
			'Decrease for Extraordinary operation - Accumulated Depreciation' AS "Account",
			YEARDUEDATE,
			"PERIODDUEDATE",
			SUM(CASE WHEN RECNTYPE = 'I001' THEN PRICE_ZFAM ELSE 0 END) AS "Land",
			SUM(CASE WHEN RECNTYPE = 'I002' THEN PRICE_ZFAM ELSE 0 END) AS "Building",
			SUM(CASE WHEN RECNTYPE = 'I003' THEN PRICE_ZFAM ELSE 0 END) AS "Guest_quarters_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I004' THEN PRICE_ZFAM ELSE 0 END) AS "Guest_quarters_in_benefit",
			SUM(CASE WHEN RECNTYPE = 'I005' THEN PRICE_ZFAM ELSE 0 END) AS "Garage_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I006' THEN PRICE_ZFAM ELSE 0 END) AS "Garage_in_benefit",
			SUM(CASE WHEN RECNTYPE = 'I007' THEN PRICE_ZFAM ELSE 0 END) AS "Productive_machinery",
			SUM(CASE WHEN RECNTYPE = 'I008' THEN PRICE_ZFAM ELSE 0 END) AS "Plants",
			SUM(CASE WHEN RECNTYPE = 'I009' THEN PRICE_ZFAM ELSE 0 END) AS "Other_productive_equipment",
			SUM(CASE WHEN RECNTYPE = 'I010' THEN PRICE_ZFAM ELSE 0 END) AS "Other_motor_vehicles",
			SUM(CASE WHEN RECNTYPE = 'I011' THEN PRICE_ZFAM ELSE 0 END) AS "In_house_handling_equipment",
			SUM(CASE WHEN RECNTYPE = 'I012' THEN PRICE_ZFAM ELSE 0 END) AS "Hardware",
			SUM(CASE WHEN RECNTYPE = 'I013' THEN PRICE_ZFAM ELSE 0 END) AS "Other_assets",
			SUM(CASE WHEN RECNTYPE = 'I014' THEN PRICE_ZFAM ELSE 0 END) AS "Cars_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I015' THEN PRICE_ZFAM ELSE 0 END) AS "Cars_in_benefit"
		FROM "CATALOGSERVICE_VIEW_IMA_LETTURA"
		WHERE "RECNNOTREASON" = '02'
			AND SUBSTRING(RECNBEG, 0, 4) = '${year}'
			AND TO_INT(SUBSTRING(RECNBEG, 5, 2)) <= ${period}
            AND BUKRS IN (${bukrs})
            AND RECNNR IN (${recnnr})
            AND IDENTOBJNR IN (${cdc})
            AND ID_STORICO = '${Id_storico}'
		GROUP BY YEARDUEDATE,
			"PERIODDUEDATE"
		UNION ALL
		SELECT 'Movements' AS "Journal_Type",
			'Depreciation' AS "Account",
			YEARDUEDATE,
			"PERIODDUEDATE",
			SUM(CASE WHEN RECNTYPE = 'I001' THEN BBWHR_DEPRECIATION ELSE 0 END) AS "Land",
			SUM(CASE WHEN RECNTYPE = 'I002' THEN BBWHR_DEPRECIATION ELSE 0 END) AS "Building",
			SUM(CASE WHEN RECNTYPE = 'I003' THEN BBWHR_DEPRECIATION ELSE 0 END) AS "Guest_quarters_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I004' THEN BBWHR_DEPRECIATION ELSE 0 END) AS "Guest_quarters_in_benefit",
			SUM(CASE WHEN RECNTYPE = 'I005' THEN BBWHR_DEPRECIATION ELSE 0 END) AS "Garage_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I006' THEN BBWHR_DEPRECIATION ELSE 0 END) AS "Garage_in_benefit",
			SUM(CASE WHEN RECNTYPE = 'I007' THEN BBWHR_DEPRECIATION ELSE 0 END) AS "Productive_machinery",
			SUM(CASE WHEN RECNTYPE = 'I008' THEN BBWHR_DEPRECIATION ELSE 0 END) AS "Plants",
			SUM(CASE WHEN RECNTYPE = 'I009' THEN BBWHR_DEPRECIATION ELSE 0 END) AS "Other_productive_equipment",
			SUM(CASE WHEN RECNTYPE = 'I010' THEN BBWHR_DEPRECIATION ELSE 0 END) AS "Other_motor_vehicles",
			SUM(CASE WHEN RECNTYPE = 'I011' THEN BBWHR_DEPRECIATION ELSE 0 END) AS "In_house_handling_equipment",
			SUM(CASE WHEN RECNTYPE = 'I012' THEN BBWHR_DEPRECIATION ELSE 0 END) AS "Hardware",
			SUM(CASE WHEN RECNTYPE = 'I013' THEN BBWHR_DEPRECIATION ELSE 0 END) AS "Other_assets",
			SUM(CASE WHEN RECNTYPE = 'I014' THEN BBWHR_DEPRECIATION ELSE 0 END) AS "Cars_in_pool",
			SUM(CASE WHEN RECNTYPE = 'I015' THEN BBWHR_DEPRECIATION ELSE 0 END) AS "Cars_in_benefit"
		FROM "CATALOGSERVICE_VIEW_IMA_LETTURA"
		GROUP BY YEARDUEDATE,
			"PERIODDUEDATE"
		UNION ALL
SELECT 'Movements' AS "Journal_Type",
			'Revaluation for renewal' AS "Account",
			B.YEARDUEDATE,
			B.PERIODDUEDATE,
			SUM(CASE WHEN B.RECNTYPE = 'I001' THEN B."BBWHR_ACQUISITION" ELSE 0 END) AS "Land",
			SUM(CASE WHEN B.RECNTYPE = 'I002' THEN B."BBWHR_ACQUISITION" ELSE 0 END) AS "Building",
			SUM(CASE WHEN B.RECNTYPE = 'I003' THEN B."BBWHR_ACQUISITION" ELSE 0 END) AS "Guest_quarters_in_pool",
			SUM(CASE WHEN B.RECNTYPE = 'I004' THEN B."BBWHR_ACQUISITION" ELSE 0 END) AS "Guest_quarters_in_benefit",
			SUM(CASE WHEN B.RECNTYPE = 'I005' THEN B."BBWHR_ACQUISITION" ELSE 0 END) AS "Garage_in_pool",
			SUM(CASE WHEN B.RECNTYPE = 'I006' THEN B."BBWHR_ACQUISITION" ELSE 0 END) AS "Garage_in_benefit",
			SUM(CASE WHEN B.RECNTYPE = 'I007' THEN B."BBWHR_ACQUISITION" ELSE 0 END) AS "Productive_machinery",
			SUM(CASE WHEN B.RECNTYPE = 'I008' THEN B."BBWHR_ACQUISITION" ELSE 0 END) AS "Plants",
			SUM(CASE WHEN B.RECNTYPE = 'I009' THEN B."BBWHR_ACQUISITION" ELSE 0 END) AS "Other_productive_equipment",
			SUM(CASE WHEN B.RECNTYPE = 'I010' THEN B."BBWHR_ACQUISITION" ELSE 0 END) AS "Other_motor_vehicles",
			SUM(CASE WHEN B.RECNTYPE = 'I011' THEN B."BBWHR_ACQUISITION" ELSE 0 END) AS "In_house_handling_equipment",
			SUM(CASE WHEN B.RECNTYPE = 'I012' THEN B."BBWHR_ACQUISITION" ELSE 0 END) AS "Hardware",
			SUM(CASE WHEN B.RECNTYPE = 'I013' THEN B."BBWHR_ACQUISITION" ELSE 0 END) AS "Other_assets",
			SUM(CASE WHEN B.RECNTYPE = 'I014' THEN B."BBWHR_ACQUISITION" ELSE 0 END) AS "Cars_in_pool",
			SUM(CASE WHEN B.RECNTYPE = 'I015' THEN B."BBWHR_ACQUISITION" ELSE 0 END) AS "Cars_in_benefit"
		FROM "CATALOGSERVICE_VIEW_IMA_LETTURA" AS B
			INNER JOIN (
				SELECT "INTRENO",
					"CEFROM"
				FROM (
						SELECT "INTRENO",
							"CEFROM",
							"ABSOLUTEEND",
							LEAD("ABSOLUTEEND") OVER (ORDER BY "CEFROM") AS "Next_ABSOLUTEEND"
						FROM "CATALOGSERVICE_VIEW_VICEPROCESS"
					) AS Subquery
				WHERE "ABSOLUTEEND" != "Next_ABSOLUTEEND"
			) AS A ON B."INTRENO" = A."INTRENO"
		WHERE SUBSTRING(A."CEFROM", 0, 4) = '${year}'
			AND TO_INT(SUBSTRING(A."CEFROM", 5, 2)) <= ${period}
			AND B.YEARDUEDATE = SUBSTRING(A."CEFROM", 0, 4)
			AND B.BUKRS IN (${bukrs})
            AND B.RECNNR IN (${recnnr})
            AND B.IDENTOBJNR IN (${cdc})
            AND B.ID_STORICO = '${Id_storico}'
		GROUP BY B.YEARDUEDATE,
			B.PERIODDUEDATE,
			A."CEFROM",
			B."RECNNR" )
GROUP BY "Journal_Type",
	"Account"`)


   
    



    console.log(filteredTable);
    return filteredTable
    
    }
    catch(error){
    this.log.error
    throw error
    }
    
    
        
    }



    async applyFilters19(
        Id_storico = null,
        entity = [], 
        year = null, 
        period = null, 
        costCenter = [],
        contratto = []
    ) {
     
        // Array che conterrà i valori
        let arrayNumeri = [];
    
        // Convertiamo il numero in intero
        let numero = parseInt(period);
    
        // Ciclo for che riempe l'array
        for (let i = numero; i >= 1; i--) {
            // Convertiamo il numero di nuovo in stringa e aggiungiamo gli zeri iniziali
            let stringaNumero = i.toString().padStart(3, '0');
            // Aggiungiamo la stringa all'array
            arrayNumeri.push(stringaNumero);
        }
    
    
        // Definizione dei filtri progressivi
        const whereClause = {};
    
        //primo filtro: entity (BUTXT)
        if (entity?.length > 0) {
            whereClause.BUKRS = entity;
        }
    
        // Filtro per contratto (RECNNR), opzionale ma deve considerare i filtri precedenti
        if (contratto?.length > 0) {
            whereClause.RECNNR = contratto;
        }
    
        // Filtro per anno (YEARDUEDATE)
        if (year) {
            whereClause.YEARDUEDATE = year;
        }
    
        // Filtro per periodo (PERIODDUEDATE)
        if (period) {
            whereClause.PERIODDUEDATE = arrayNumeri;
        }
    
        // Filtro per centro di costo (IDENTOBJNR), si sblocca solo dopo year e period
        if (costCenter?.length > 0) {
            whereClause.IDENTOBJNR = costCenter;
        }
    
        // Filtro per storico (ID_STORICO), si sblocca dopo year e period
        if (Id_storico) {
            whereClause.ID_STORICO = Id_storico;
        }
    
        // Esegui la query di selezione con i filtri dinamici
        const filteredData = await cds.run(
            SELECT.distinct
                .from('CATALOGSERVICE_GV_FILTRI_ID22')
                .columns('BUTXT', 'RECNTYPE', 'RECNNR', 'YEARDUEDATE', 'PERIODDUEDATE', 'IDENTOBJNR', 'BUKRS', 'ID_STORICO')
                .where(whereClause)  // Inserisci la clausola WHERE dinamica
        );
    
    
        this.log.info(filteredData)
    
        // Usa Set per rimuovere automaticamente i duplicati dai risultati
        const butxt = new Set();
        const yearduedate = new Set();
        const periodduedate = new Set();
        const bukrs = new Set();
        const id_storico = new Set();
        const cdc = new Set();
        const recnnr = new Set();
    
        // Popola i set con i risultati filtrati
        filteredData.forEach(row => {
            butxt.add(row.BUTXT);
            yearduedate.add(row.YEARDUEDATE);
            periodduedate.add(row.PERIODDUEDATE);
            bukrs.add(row.BUKRS);
            cdc.add(row.IDENTOBJNR);
            id_storico.add(row.ID_STORICO)
            recnnr.add(row.RECNNR)
        });
    
        // Converte i set in array
        const BUTXT = Array.from(butxt);
        const YEARDUEDATE = Array.from(yearduedate);
        const PERIODDUEDATE = Array.from(periodduedate);
        const BUKRS = Array.from(bukrs);
        const ID_STORICO = Array.from(id_storico);
        const CDC = Array.from(cdc);
        const RECNNR = Array.from(recnnr);
    
    
        console.log("butxt array:", BUTXT);
        console.log("yearduedate array:", YEARDUEDATE);
        console.log("periodduedate array:", PERIODDUEDATE);
        console.log("bukrs array:", BUKRS);
        console.log("bukrs array:", ID_STORICO);
        console.log("bukrs array:", CDC);
        console.log("bukrs array:", RECNNR);
    
        // Ritorna gli array filtrati
        return {
            BUTXT: BUTXT,
            YEARDUEDATE: YEARDUEDATE,
            PERIODDUEDATE: PERIODDUEDATE,
            BUKRS: BUKRS,
            ID_STORICO: ID_STORICO,
            CDC: CDC,
            RECNNR: RECNNR,
        };
    }

    async CreateQuery19(entity = [], contratto = [], year = null, period = null, costCenter = [], Id_storico = null) {
        let whereClauses = [];
    
            // Controllo per il parametro Entity (obbligatorio e array)
            if (Array.isArray(entity) && entity.length > 0) {
                whereClauses.push('"BUKRS" IN (' + entity.map(e => `'${e}'`).join(', ') + ')');
            } else {
                throw new Error("Il parametro 'Entity' è obbligatorio e deve essere un array.");
            }
        
            // Controllo per il parametro Contratto (facoltativo e array)
            if (contratto) {
                if (Array.isArray(contratto)) {
                    if(contratto.length > 0){
                        whereClauses.push('"RECNNR" IN (' + contratto.map(c => `'${c}'`).join(', ') + ')');
                    }
                } else {
                    whereClauses.push('"RECNNR" = \'' + contratto + '\'');
                }
            }
        
            // Controllo per il parametro Year (obbligatorio e non array)
            if (year !== null && year !== undefined) {
                whereClauses.push('"YEARDUEDATE" = \'' + year + '\'');
            } else {
                throw new Error("Il parametro 'Year' è obbligatorio.");
            }
        
            // Controllo per il parametro Period (obbligatorio e non array)
            if (period !== null && period !== undefined) {
                whereClauses.push('TO_INT("PERIODDUEDATE") = ' + period);
            } else {
                throw new Error("Il parametro 'Period' è obbligatorio.");
            }
        
            // Controllo per il parametro Cost Center (facoltativo e array)
            if (Array.isArray(costCenter)) {
                if(costCenter.length > 0) {
                    whereClauses.push('"IDENTOBJNR" IN (' + costCenter.map(cc => `'${cc}'`).join(', ') + ')');
                }
            } else if (costCenter) {
                whereClauses.push('"IDENTOBJNR" = \'' + costCenter + '\'');
            }
    
                    // Controllo per il parametro Year (obbligatorio e non array)
            if (Id_storico !== null && Id_storico !== undefined) {
                whereClauses.push('"ID_STORICO" = \'' + Id_storico + '\'');
            } else {
                throw new Error("Il parametro 'Id_storico' è obbligatorio.");
            }
        
            // Costruzione della query finale
            let sqlQuery = ''; // Sostituisci con il nome della tua tabella
            if (whereClauses.length > 0) {
                sqlQuery += 'WHERE ' + whereClauses.join(' AND ');
            }
        
            return sqlQuery;
        }


        async GetTabellaFiltrata19(entity = [], contratto = [], year = null, period = null, costCenter = [], Id_storico = null){
    
            let query19 =await this.CreateQuery19(entity, contratto, year, period, costCenter, Id_storico)
           
        
        
            try{
            const filteredTable = await cds.db.run(`SELECT "JOURNAL_TYPE",
            "ACCOUNT",
            "IDENTOBJNR",
            "RECNTXTOLD",
            "XMBEZ",
            "DEBIT",
            "CREDIT",
            "DEBIT_CURR",
            "CREDIT_CURR"
        FROM (
                SELECT UPPER("JOURNAL_TYPE") "JOURNAL_TYPE",
                    UPPER("ACCOUNT") "ACCOUNT",
                    "IDENTOBJNR",
                    "RECNTXTOLD",
                    "XMBEZ",
                    SUM("DEBIT") "DEBIT",
                    SUM("CREDIT") "CREDIT",
                    SUM("DEBIT_CURR") "DEBIT_CURR",
                    SUM("CREDIT_CURR") "CREDIT_CURR"
                FROM "CATALOGSERVICE_VIEW_CAP_REPORT_23_EQ"
                ${query19}
                GROUP BY "JOURNAL_TYPE",
                    "ACCOUNT",
                    "IDENTOBJNR",
                    "RECNTXTOLD",
                    "XMBEZ"
                UNION ALL
                SELECT UPPER("JOURNAL_TYPE") "JOURNAL_TYPE",
                    UPPER("ACCOUNT") "ACCOUNT",
                    "IDENTOBJNR",
                    "RECNTXTOLD",
                    "XMBEZ",
                    SUM("DEBIT") "DEBIT",
                    SUM("CREDIT") "CREDIT",
                    SUM("DEBIT_CURR") "DEBIT_CURR",
                    SUM("CREDIT_CURR") "CREDIT_CURR"
                FROM "CATALOGSERVICE_VIEW_CAP_REPORT23_LT"
                ${query19}
                GROUP BY "JOURNAL_TYPE",
                    "ACCOUNT",
                    "IDENTOBJNR",
                    "RECNTXTOLD",
                    "XMBEZ")
        ORDER BY "JOURNAL_TYPE",
            "ACCOUNT"`)
        
        console.log(filteredTable);
        return filteredTable
        
        }
        catch(error){
        this.log.error
        throw error
        }
        
        
            
        }
    

  



}
