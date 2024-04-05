const mysql = require('mysql2')

const dbConnect = mysql.createPool({
    host     : "localhost",
    port     : 3306,
    user     : "root",
    password : "P@ssw0rd",
    database :"warehouse",
    connectionLimit: 3
})

module.exports = dbConnect