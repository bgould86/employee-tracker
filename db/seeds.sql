INSERT INTO departments (dept_name)
VALUES ("Administration"),
       ("Research and Development"),
       ("Marketing and Sales"),
       ("Human Resources"),
       ("Accounting and Finance"),
       ("Customer Service");

INSERT INTO roles (title, salary, dept_id)
VALUES ("Manager", 100000.00, NULL),
       ("Associate", 80000.00, 2),
       ("Sales Lead", 80000.00, 3),
       ("Waste of Money", 90000.00, 4),
       ("Accountant", 90000.00, 5),
       ("Customer Rep", 40000.00, 6);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Brett", "Gould", 1, NULL),
        ("Nick", "Gamblin", 2, 1),
        ("Andrew", "Lynch", 3, 1),
        ("Derb", "Snerdly", 4, 1),
        ("Kash", "Handleman", 5, 1),
        ("Gibby", "Gruber", 6, 1);
      
