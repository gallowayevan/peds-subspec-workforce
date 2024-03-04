export function getQueryMap(queryValue) {
    return new Map(queryValue.split("_").map((e) => {
        const [key, value] = e.split("-");
        return [key, +value];
    }))
}

export function getFullParameters(queryMap) {
    return Object.fromEntries(queryMap);
}

export function getHeadcountString(queryMap) {
    return +queryMap.get("headcount") == 1 ? "headcount" : "fte";
}
export function getPopString(queryMap) {
    return +queryMap.get("pop") === 1 ? "pop" : "";
}

export function getRateMultiplierString(pop) {
    return pop ? ` * 100000` : "";
}

/*
Geo codes translations are hardcoded. $lib/settings/options.js is the source.
*/
export function getGeoQuery(queryMap) {
    const geography = +queryMap.get("geography");
    let qString = `AND `;
    if (geography === 900) {
        //Census Regions
        qString += `location BETWEEN 200 AND 203`;
    }
    if (geography === 901) {
        //States
        qString += `location BETWEEN 1 AND 56`;

    }
    if (geography === 902) {
        //Census Divisions
        qString += `location BETWEEN 400 AND 408`;

    }
    return qString;
}

export function locationFilter(geography, locations) {
    let range = [200, 203]; //Regions - geography === 900
    if (geography === 901) {
        //States
        range = [1, 56];

    } else if (geography === 902) {
        //States
        range = [400, 408];
    }
    return locations.filter(l => l.value >= range[0] & l.value <= range[1])

}

export function makeWhere(queryEntries) {
    return queryEntries.map((d, i) => `${i == 0 ? `WHERE` : ``} ${d[0]} = ?`).join(` AND `)
}