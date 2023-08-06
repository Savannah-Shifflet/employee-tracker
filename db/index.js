const db = require('../config/connection');
const cTable = require('console.table');

// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

// WHEN I choose to view all departments

const viewAllDepartments = () => {
    db.query('SELECT id AS Department_id, name AS Department_Name FROM department', (err, results) => { 
        if(err) {
            console.log(err);
        }
        console.table(results); 
    })
}; 

viewAllDepartments();
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
const viewAllRoles = () => {
    db.query('SELECT role.title AS Job_Title, role.id AS Role_id, department.name AS Department_Name, role.salary AS Salary FROM role JOIN department ON department.id = role.department_id', (err, results) => { 
        if(err) {
            console.log(err);
        }
        console.table(results);
    });
};
viewAllRoles();
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
const viewAllEmployees = () => {
    db.query('SELECT employee_individual.id AS Employee_id, employee_individual.first_name AS First_Name, employee_individual.last_name AS Last_Name, role.title AS Job_Title, department.name AS Department, role.salary AS Salary, CONCAT(manager.first_name, \' \', manager.last_name) AS Manager_Name FROM employee employee_individual JOIN role ON role.id = employee_individual.role_id JOIN department ON department.id = role.department_id LEFT JOIN employee manager ON manager.manager_id = employee_individual.id', (err, results) => { 
        if(err) {
            console.log(err);
        }
        console.table(results);
    });
};
viewAllEmployees();
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
const addDepartment = (name) => {
    db.query('INSERT INTO department (name) VALUES (?)', name, (err, results) => { 
        if(err) {
            console.log(err);
        }
        console.log(`${name} was successfully added to departments!`);
    });
}

// addDepartment('Service');
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
const addRole = async (title, salary, department) => {
    db.promise().query({sql: 'SELECT id FROM department WHERE name = ?', rowsAsArray: true}, department)
    .then(([rows, field]) => {
        db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, rows], (err, results) => { 
                if(err) {
                    console.log(err);
                } else {
                    console.log(`${title} was successfully added to roles!`);
                }
            });
        }
    );
};

// addRole('Manager', '160000', 'Sales');
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
const addEmployee = async (first_name, last_name, role, manager) => {
    let roleId = 0;
    let managerId = 0;
    db.promise().query({sql: 'SELECT id FROM role WHERE title = ?', rowsAsArray: true}, role)
    .then(([rows, field]) => {
        roleId = rows;
        const managerName = manager.split(' '); 
        console.log(managerName);
        db.promise().query({sql: 'SELECT id FROM employee WHERE first_name = ? AND last_name = ?', rowsAsArray: true}, [managerName[0], managerName[1]])
        .then(([rows, field]) => {
            managerId = rows; 
        })
        .then(() => {
            db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [first_name, last_name, roleId, managerId], (err, results) => { 
                if(err) {
                    console.log(err);
                } else {
                    console.log(`${first_name} ${last_name} was successfully added to roles!`);
                }
            });
        });
    });
}; 
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

module.exports = { viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee };