import db from '$lib/database';
import { getQueryMap, getRateMultiplierString, getFullParameters, getPopString, getHeadcountString, getGeoQuery, makeWhere } from '$lib/queryUtilities';
import { ascending } from 'd3-array';

/*
Not showing.
In order to allow for multiple projections to be queried at once, 
I create a standard way for packaging and parsing the projection requests:
baseurl?proj=name-code_name-code . . .&proj=name-code_name-code . . .

As is, this code will rerun the same queries repeatedly. Might need a mechanism for memoization, e.g., 
create a js map with query strings as the lookup
*/

export async function get({ url : {searchParams} }) {

    //If no query parameters, just return a default view.
		if (Array.from(searchParams.entries()).length == 0) {
			return {
				status: 301,
				headers: { Location: `/map?proj=sscode-0_headcount-1_scenario-72_geography-902`}
			};
		}
    let data = [];

    const queryMap = getQueryMap(searchParams.get("proj"));
    // console.time('model query');

    const queryExcept = searchParams.getAll("except").map(d => +d); //Workaround to allow deletion when looking at states
    const fullParameters = getFullParameters(queryMap);

    const headcount = getHeadcountString(queryMap);
    const geoQuery = getGeoQuery(queryMap);
    queryMap.set("pop", 1)
    const pop = getPopString(queryMap);

    queryMap.delete("headcount");
    queryMap.delete("geography");
    queryMap.delete("pop");

    const queryEntries = Array.from(queryMap);

    const rateMultiplierString = getRateMultiplierString(pop);

    try {
        const sql = `SELECT location, JSON_ARRAYAGG(JSON_OBJECT(
            'year', year,
            'value', ${headcount}mean${pop}${rateMultiplierString},
            'lci', ${headcount}lci${pop}${rateMultiplierString},
            'uci', ${headcount}uci${pop}${rateMultiplierString})) "values"
        from supply
        ${makeWhere(queryEntries)} AND ${headcount}mean${pop} > 0
        ${geoQuery}
        ${makeQueryExcept(queryExcept)} 
        GROUP BY location;`

        const [rows, fields] = await db.execute(sql, queryEntries.map(d => d[1]));

        const baseId = searchParams.get("proj");
        data = rows.map(function (d) {
            return { id: baseId + "_location-" + d.location, parameters: { ...fullParameters, location: d.location }, values: d.values.sort((a, b) => ascending(a.year, b.year)) }
        });

    } catch (err) {
        console.log(err)
        return {
            status: 500,
            body: {}
        }
    }

	// console.timeEnd('model query');


    //If all goes well, return all the data.
    return {
        body: {data}
    }
}

function makeQueryExcept(queryExcept) {
    return queryExcept ? queryExcept.map(d => ` AND location <> ${d}`).join("") : "";
}


