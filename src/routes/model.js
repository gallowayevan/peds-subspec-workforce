import db from '$lib/database';
import {
	getQueryMap,
	getRateMultiplierString,
	getFullParameters,
	getPopString,
	getHeadcountString,
	getGeoQuery,
	makeWhere
} from '$lib/queryUtilities';

/*
Not showing.
In order to allow for multiple projections to be queried at once, 
I create a standard way for packaging and parsing the projection requests:
baseurl?proj=name-code_name-code . . .&proj=name-code_name-code . . .

As is, this code will rerun the same queries repeatedly. Might need a mechanism for memoization, e.g., 
create a js map with query strings as the lookup
*/

export async function get({ url: { searchParams } }) {
	//If no query parameters (i.e., path is just /model), default to showing all subspecs for US.
	if (Array.from(searchParams.entries()).length == 0) {
		return {
			status: 301,
			headers: { Location: `/model?proj=sscode-0_location-0_headcount-1_pop-0_scenario-72` }
		};
	}

	//If clear is set to 1, then return no data.
	if (+searchParams.get('clean') === 1) {
		return {
			status: 500,
			body: { data: [] }
		};
	}


	const proj = searchParams.getAll('proj');
	// console.time('model query');
	let queryArray = [];
	for (const q of proj) {
		const queryMap = getQueryMap(q);

		const fullParameters = getFullParameters(queryMap);

		const headcount = getHeadcountString(queryMap);
		// const geoQuery = getGeoQuery(queryMap);
		const pop = getPopString(queryMap);

		queryMap.delete('headcount');
		queryMap.delete('geography');
		queryMap.delete('pop');

		const queryEntries = Array.from(queryMap);

		const rateMultiplierString = getRateMultiplierString(pop);

		/*Year is limited to >= 2020. May need to remove for writing group. 

		Temporarily removed "AND year >= 2020" from where clause for writing group.
		
		In final version, 2020 data should
		just be dropped from the database.Array*/

		const sql = `SELECT 
                year,
                ${headcount}mean${pop}${rateMultiplierString} as value,
                ${headcount}lci${pop}${rateMultiplierString} as lci,
                ${headcount}uci${pop}${rateMultiplierString} as uci 
                from supply 
                ${makeWhere(queryEntries)} AND ${headcount}mean${pop} > 0
				AND year >= 2020
                ORDER BY year;`;

		queryArray.push([sql, queryEntries,q, fullParameters]);
	}

	let data = [];

	try {
		const promiseArray = queryArray.map(([sql, queryEntries]) =>
			db.execute(
				sql,
				queryEntries.map((d) => d[1])
			)
		);

		const resolvedPromises = await Promise.all(promiseArray);

		data = resolvedPromises.map(function([rows, fields],i){
			return { id: queryArray[i][2], parameters: queryArray[i][3], values: rows, index: i + 1}
		})


	} catch (err) {
		console.log(err);
		return {
			status: 500,
			body: {}
		};
	}

	// console.timeEnd('model query');
	//If all goes well, return all the data.
	return {
		body: { data }
	};
}
