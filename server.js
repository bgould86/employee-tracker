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
            value: "view-dept",
          },
          {
            name: "view all roles",
            value: "view-roles",
          },
          {
            name: "add a department",
            value: "add-dept",
          },
          {
            name: "add a role",
            value: "add-role",
          },
          {
            name: "add an employee",
            value: "add-emp",
          },
          {
            name: "update an employee role",
            value: "update-emp",
          },
          {
            name: "Quit",
            value: "QUIT",
          },
        ],
      },
    ])

    .then((answers) => {
      //if statement or swtich
      if (answers.questions === "view-emps") {
        viewEmps();
      } else if (answers.questions === "view-dept") {
        viewDepts();
      } else if (answers.questions === "view-roles") {
        viewRoles();
      } else if (answers.questions === "add-dept") {
        addDepts();
      } else if (answers.questions === "add-role") {
        addRole();
      } else if (answers.questions === "add-emp") {
        addEmp();
      } else if (answers.questions === "update-emp") {
        updateEmp();
      }
    });
}

function viewEmps() {
  const sql = `SELECT * FROM employees`;

  db.query(sql, (err, rows) => {
    console.table(rows);
  });
}

function viewDepts() {
  const sql = `SELECT * FROM departments`;

  db.query(sql, (err, rows) => {
    console.table(rows);
  });
}

function viewRoles() {
  const sql = `SELECT * FROM roles`;

  db.query(sql, (err, rows) => {
    console.table(rows);
  });
}

function addDepts() {
  const sql = `INSERT INTO departments (dept_name) VALUES (?)`;
  const params = [body.dept_name];

  db.query(sql, params, (err, result) => {
    console.table(rows);
  });
}
//function based on what they do
//different function for each choice

init();
