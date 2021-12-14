let mysql = require("mysql");

/**
TODO:
Debe crear la siguiente Base de datos y tabla:
create database books;

create table books
(
    id int auto_increment,
    title varchar(50) not null,
    created_at datetime not null,
    active int default 0 not null,
    constraint books_pk
        primary key (id)
); 
*/

let connection = mysql.createConnection({
  host: "localhost",
  user: "myuser",
  password: "mypassword",
  database: "books",
});

connection.connect(function (error) {
  if (!!error) {
    console.log(error);
  } else {
    console.log("Connected..!");
  }
});

module.exports = connection;
