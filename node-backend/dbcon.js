/**
 * Created by fahad.saeed on 10/22/2018.
 */
var mysql = require('mysql')

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "helloworld"
});

module.exports = con