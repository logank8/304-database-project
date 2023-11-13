const mysql = require('mysql');
const con = mysql.createConnection({
    host: "cpsc304-db-instance-1.c9rwuifvvod0.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "iK4jzN7dda7SRsM"
});

con.connect(function(err) {
    if (err) throw err;

    con.query('CREATE DATABASE IF NOT EXISTS main;');
    con.query('USE main;');
    con.query('CREATE TABLE IF NOT EXISTS users(id int NOT NULL AUTO_INCREMENT, username varchar(30), email varchar(255), age int, PRIMARY KEY(id));', function(error, result, fields) {
        console.log(result);
    });
    con.end();
});