import mysql from "mysql";

//--DataBase 
export var dbconnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "student",
    port: 3306
});
//--checking DB connectivity
dbconnection.connect((err) => {
    if (err) {
        console.log("DB CONNECTION FAILURE");
    } else {
        console.log("DB connection succuesfull");
    }
});
