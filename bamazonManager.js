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

function viewProducts(){
    connection.query("SELECT * FROM products", function(error, results, fields){
        if (error) return console.log(error);

        console.table(results);
        start();
    });
}

function viewLowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(error, results, fields){
        if (error) return console.log(error);

        if (results.length === 0)
            console.log("There isn't any item with an inventory count lower than 5.\n");
        else console.table(results);

        start();
    });
}

function addToInventory(){
    connection.query("SELECT * FROM products", function(error, results, fields){
        if(error) return console.log(error);

        console.table(results);
        
        inquirer.prompt([
            {
                type: "input",
                message: "Enter an item ID that you would like to add more quantity to stock. \n",
                name: "itemID"
            },
            {
                type: "input",
                message: "Enter a number that indicates how many items you would like to add to stock.\n",
                name: "quantity"
            }
        ]).then(function(response){
            var itemID = parseInt(response.itemID);
            var quantity = parseInt(response.quantity);
            if (itemID === NaN || quantity === NaN){
                console.log("Please enter a valid number.\n");
                addToInventory();
                return;
            }

            connection.query("SELECT stock_quantity FROM products WHERE item_id = ?", [itemID], function(error, results, fields){
                if (error) return console.log(error);

                quantity += parseInt(results[0].stock_quantity);

                connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", 
                [quantity, itemID],
                function(error, results, fields){
                    if (error)  return console.log(error);
                    console.log("Update successfully!\n");
                    viewProducts();
                });
            });
        });
    });
}

function addNewProducts(){
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the product name: ",
            name: "product_name"
        },
        {
            type: "input",
            message: "Enter the department name: ",
            name: "department_name"
        },
        {
            type: "input",
            message: "Enter the price of the product: ",
            name: "price"
        },
        {
            type: "input",
            message: "Enter the stock quantity: ",
            name: "stock_quantity"
        }
    ])
    .then(function(response){
        var price, stock_quantity;
        price = parseFloat(response.price);
        stock_quantity = parseInt(response.stock_quantity);
        if (price === NaN || stock_quantity === NaN){
            console.log("Please enter a number for price and stock quantity.\n");
            addNewProducts();
            return;
        }

        price = price.toFixed(2);

        var sqlValue = [response.product_name, response.department_name, price, stock_quantity];

        connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", 
        sqlValue, 
        function(error, results, fields){
            if (error) return console.log(error);
            
            console.log("Update successfully!\n");
            viewProducts();
        });

    });
}

function start(){
    inquirer.prompt({
        type: "list",
        name: "option",
        message: "Please select an option: ",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    })
    .then(function(response){
        switch(response.option){
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                addToInventory();
                break;
            case "Add New Product":
                addNewProducts();
                break;
            default:
                console.log("Please select an option from the menu.\n");
                start();
        }
    });
}

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    //console.log('connected as id ' + connection.threadId);
});

start();