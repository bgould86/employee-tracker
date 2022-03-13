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
      } else if (answers.questions === "QUIT") {
        quit();
      }
    });
}

function viewEmps() {
  const sql = `SELECT * FROM employees`;

  db.query(sql, (err, rows) => {
    console.table(rows);
    init();
  });
}

function viewDepts() {
  const sql = `SELECT * FROM departments`;

  db.query(sql, (err, rows) => {
    console.table(rows);
    init();
  });
}

function viewRoles() {
  const sql = `SELECT * FROM roles`;

  db.query(sql, (err, rows) => {
    console.table(rows);
    init();
  });
}

function addDepts() {
  inquirer
    .prompt({
      name: "addDept",
      type: "input",
      message: "What is the name of the new department?",
    })

    .then((answer) => {
      db.query(`INSERT INTO departments (dept_name) VALUES (?)`, answer.addDept, function (err, row) {
        if (err) throw err;
      });

      db.query("SELECT * FROM departments", (err, res) => {
        console.table(res);
        init();
      });
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What's the title for the new role?",
      },
      {
        name: "salary",
        type: "input",
        message: "What's the salary for the new role?",
      },
    ])
    .then((answers) => {
      db.query("SELECT * FROM departments", function (err, results) {
        const departments = results.map(({ id, dept_name }) => ({
          name: dept_name,
          value: id,
        }));
        inquirer
          .prompt({
            type: "list",
            name: "id",
            message: "What department is the new role in?",
            choices: departments,
          })
          .then((dept_id) => {
            db.query("INSERT INTO roles(title, salary, dept_id) values(?,?,?)", [answers.title, answers.salary, dept_id.id]);

            db.query("SELECT * FROM roles", (err, res) => {
              console.table(res);
              init();
            });
          });
      });
    });
}

function addEmp() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What's the employee's first name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What's the employee's last name?",
      },
    ])
    .then((answers) => {
      db.query("SELECT * FROM roles", function (err, results) {
        const roles = results.map(({ id, title }) => ({
          name: title,
          value: id,
        }));
        inquirer
          .prompt({
            type: "list",
            name: "id",
            message: "What is the employee's role?",
            choices: roles,
          })
          .then((role) => {
            db.query("SELECT * FROM employees WHERE manager_id is null", function (err, results) {
              const managers = results.map(({ id, last_name }) => ({
                name: last_name,
                value: id,
              }));
              inquirer
                .prompt({
                  type: "list",
                  name: "id",
                  message: "What is the manager's name?",
                  choices: managers,
                })
                .then((manager) => {
                  db.query("INSERT INTO employees(first_name, last_name, role_id, manager_id) values(?,?,?,?)", [answers.firstName, answers.lastName, role.id, manager.id]);

                  db.query("SELECT * FROM employees", (err, res) => {
                    console.table(res);
                    init();
                  });
                });
            });
          });
      });
    });
}

function updateEmp() {
  db.query("SELECT * FROM employees", (err, res) => {
    const employees = res.map(({ id, last_name }) => ({
      name: last_name,
      value: id,
    }));
    inquirer
      .prompt({
        type: "list",
        name: "id",
        message: "What employee would you like to update?",
        choices: employees,
      })
      .then((employee) => {
        db.query("SELECT * FROM roles", function (err, res) {
          const roles = res.map(({ id, title }) => ({
            name: title,
            value: id,
          }));
          inquirer
            .prompt({
              type: "list",
              name: "id",
              message: "What is the employee's new role?",
              choices: roles,
            })
            .then((role) => {
              db.query("UPDATE employees SET role_id = ? WHERE id = ?", [role.id, employee.id], function (err, row) {
                if (err) throw err;
              });
              db.query("SELECT * FROM employees", (err, res) => {
                console.table(res);
                init();
              });
            });
        });
      });
  });
}

function quit() {
  console.log("Thank you for choosing Employee Tracker Corp. Goodbye.");
}

init();
