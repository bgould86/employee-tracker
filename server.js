const inquirer = require("inquirer");
const mysql = require("mysql2");

require("dotenv").config();

const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  },
  console.log(`Connected to the database.`)
);

function init() {
  inquirer
    .prompt([
      {
        name: "questions",
        type: "list",
        message: "What would you like to do?",
        choices: [
          {
            name: "view all employees",
            value: "view-emps",
          },
          {
            name: "view all departments",
            value: "view-dep",
          },
        ],
      },
    ])

    .then((answers) => {
      //if statement or swtich
      if (answers.questions === "view-emps") {
        //call view emp function
      } else if (answers.questions === "view-dep") {
        //call view emp function
        viewDeps();
      }
    });
}

function viewDeps() {
  const sql = `SELECT * FROM departments`;

  db.query(sql, (err, rows) => {
    console.table(rows);
  });
}
//function based on what they do
//different function for each choice

init();
