var inquirer = require("inquirer");
var mysql = require('mysql');
require("dotenv").config();
var mysql_pw = process.env.MYSQL;

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    user: "root",

    password: mysql_pw,
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
});

connection.query("SELECT * FROM products", function(error, results, fields){
    if (error) return console.log(error);

    //console.log('Solution: ' + results[0].department_name);
    //console.log("fields: " + fields[2].name);
});

connection.end();

