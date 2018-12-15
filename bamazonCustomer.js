var inquirer = require("inquirer");
var mysql = require('mysql');
require('console.table');
require("dotenv").config();
var mysql_pw = process.env.MYSQL;

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: mysql_pw,
    database: "bamazon"
});

var totalNumProducts = 0;

function processPurchase(itemID, itemQuantity){

    if (itemID < 1 || itemID > totalNumProducts){
        console.log("Invalid item id!\n");
        //return connection.end();
        showTable();
        return;
    }

    connection.query("SELECT stock_quantity, price FROM products WHERE item_id="+itemID, function(error, results, fields){
        if (error) {
            connection.end();
            return console.log(error);
        }

        var stockQuantity = results[0].stock_quantity;

        if (stockQuantity < itemQuantity || itemQuantity <= 0)   {
            //connection.end();
            console.log("Insufficient quantity!\n");
            showTable();
            return;
        }

        updateData(itemID, itemQuantity, stockQuantity, results[0].price);
    });
}

function updateData(itemID, itemQuantity, stockQuantity, price){
    var newQuantity = stockQuantity - itemQuantity;

    connection.query("UPDATE products SET stock_quantity=" + newQuantity + " WHERE item_id=" + itemID,
        function(error, results, fields){
            if (error) return console.log(error);

            //console.log(results);
            console.log("Thank you for your purchase! Your total cost is $"+ (price * itemQuantity).toFixed(2) +".\n");

            //start another purchase
            showTable();
        }
    );
    //connection.end();
}

function start(){
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the ID of the product that you would like to purchase. ",
            name: "itemID"
        },
        {
            type: "input",
            message: "Enter number of units of the product that you would like to purchase. ",
            name: "itemQuantity"
        }
    ]).then(function(response){
        var itemID = parseInt(response.itemID);
        var itemQuantity = parseInt(response.itemQuantity);
        if (!(itemID && itemQuantity)) {
            //connection.end();
            console.log("Not a valid number entered.\n");
            showTable();
            return;
        }

        processPurchase(itemID, itemQuantity);
    });
}

function showTable(){
    connection.query("SELECT * FROM products", function(error, results, fields){
        if (error) return console.log(error);
        totalNumProducts = results.length;
        console.table(results);
        start();
    });    
}

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
});

showTable();