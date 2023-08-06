const db = require('../config/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');

const mainMenu = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'userAnswer',
                choices: [
                    'View all departments',
                    'View all roles', 
                    'View all employees', 
                    'Add a department', 
                    'Add a role', 
                    'Add an employee', 
                    'Update an employee role'
                ]
            }
        ])
        .then((answer) => {
            choice(answer.userAnswer); 
        })
};

// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
const viewAllDepartments = () => {
    db.promise().query('SELECT id AS Department_id, name AS Department_Name FROM department')
    .then((rows) => { 
        console.table(rows[0]); 
    })
    .then(() => mainMenu());
}; 

// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
const viewAllRoles = () => {
    db.promise().query('SELECT role.title AS Job_Title, role.id AS Role_id, department.name AS Department_Name, role.salary AS Salary FROM role JOIN department ON department.id = role.department_id')
    .then((rows) => { 
        console.table(rows[0]); 
    })
    .then(() => mainMenu());
};
// viewAllRoles();

// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
const viewAllEmployees = () => {
    db.promise().query('SELECT employee_individual.id AS Employee_id, employee_individual.first_name AS First_Name, employee_individual.last_name AS Last_Name, role.title AS Job_Title, department.name AS Department, role.salary AS Salary, CONCAT(manager.first_name, \' \', manager.last_name) AS Manager_Name FROM employee employee_individual JOIN role ON role.id = employee_individual.role_id JOIN department ON department.id = role.department_id LEFT JOIN employee manager ON manager.id = employee_individual.manager_id ORDER BY employee_individual.id')
    .then((rows) => { 
        console.table(rows[0]); 
    })
    .then(() => mainMenu());
};
// viewAllEmployees();

// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
const addDepartment = (name) => {
    db.promise().query('INSERT INTO department (name) VALUES (?)', name)
    .then(() => { 
        console.log(`${name} was successfully added to departments!`); 
    })
    .then(() => mainMenu());
}

// addDepartment('Service');

// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
const addRole = async (title, salary, department) => {
    db.promise().query({sql: 'SELECT id FROM department WHERE name = ?', rowsAsArray: true}, department)
    .then(([rows, field]) => {
        db.promise().query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, rows])
        .then(() => console.log(`${title} was successfully added to roles!`))
        .then(() => mainMenu());
    });
};

// addRole('Manager', '160000', 'Sales');
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
const addEmployee = async (first_name, last_name, role, manager) => {
    let roleId = 0;
    let managerId = 0;
    // find role_id based on role user entered
    db.promise().query({sql: 'SELECT id FROM role WHERE title = ?', rowsAsArray: true}, role)
    .then(([rows, field]) => {
        roleId = rows;
        // Find manager_id based on name user entered
        const managerName = manager.split(' '); 
        db.promise().query({sql: 'SELECT id FROM employee WHERE first_name = ? AND last_name = ?', rowsAsArray: true}, [managerName[0], managerName[1]])
        .then(([rows, field]) => {
            managerId = rows; 
        })
        .then(() => {
            // Create employee using role_id and manager_id found above
            db.promise().query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [first_name, last_name, roleId, managerId])
            .then(() => console.log(`${first_name} ${last_name} was successfully added to employees!`))
            .then(() => mainMenu());
        });
    });
}; 

// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database
const updateRole = (employeeName, newRole) => {
    db.query('UPDATE employee SET role_id = ? WHERE id = ?', [newRole, employeeName], (err, results) => { 
        if(err) {
            console.log(err);
        } else {
            console.log(`Role was successfully updated!`);
        };
    });
};

const choice = (str) => {
    switch(str) {
        case 'View all departments':
            return viewAllDepartments();
        case 'View all roles': 
            return viewAllRoles();
        case 'View all employees':
            return viewAllEmployees();
        case 'Add a department':
            inquirer
                .prompt([
                    {
                        type: 'input',
                        message: 'Enter the name of the department you would like to add:',
                        name: 'departmentName'
                    }
                ])
                .then((answer) => {
                    return addDepartment(answer.departmentName);
                });
        case 'Add a role': 
            db.query('SELECT name FROM department', (err, results) => { 
                if(err) {
                    console.log(err);
                }
                const departmentArray = results; 
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            message: 'Enter the role you would like to add:',
                            name: 'title'
                        },
                        {
                            type: 'input',
                            message: 'Enter the salary of this role:',
                            name: 'salary'
                        },
                        {
                            type: 'list',
                            message: 'Select what department this role belongs to:',
                            name: 'department',
                            choices: departmentArray
                        }
                    ])
                    .then((answer) => {
                        return addRole(answer.title, answer.salary, answer.department);
                    });
            })
        // case 'Add an employee':
        // case 'Update an employee role':
    };
};

module.exports = { viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateRole, mainMenu, choice };