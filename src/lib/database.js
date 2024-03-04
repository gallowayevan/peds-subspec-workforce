import mysql2 from 'mysql2/promise';

let connectionSettings = {
    connectionLimit: 10,
    host: "localhost",
    user: "nodeapp",
    password: "password",
    port: 3306,
    database: "abpmodel",
    namedPlaceholders: true
}

if (process.env["NODE_ENV"] == "production") {
    connectionSettings = {
        connectionLimit: 10,
        host: process.env["ABPMODEL_SERVICE_HOST"],
        user: process.env["MYSQL_USER"],
        password: process.env["MYSQL_PASSWORD"],
        port: process.env["ABPMODEL_SERVICE_PORT"],
        database: process.env["MYSQL_DATABASE"],
        namedPlaceholders: true
    }
}

let db;
try {
    console.log("Connecting to DB")
    db = mysql2.createPool(connectionSettings);
    // console.log("Connected to DB")
}
catch (err) {
    console.log(err);
}

export default db;