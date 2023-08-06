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
                    'Update an employee role',
                    'View department\'s utilized budget'
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

// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
const viewAllEmployees = () => {
    db.promise().query('SELECT employee_individual.id AS Employee_id, employee_individual.first_name AS First_Name, employee_individual.last_name AS Last_Name, role.title AS Job_Title, department.name AS Department, role.salary AS Salary, CONCAT(manager.first_name, \' \', manager.last_name) AS Manager_Name FROM employee employee_individual JOIN role ON role.id = employee_individual.role_id JOIN department ON department.id = role.department_id LEFT JOIN employee manager ON manager.id = employee_individual.manager_id ORDER BY employee_individual.id')
    .then((rows) => { 
        console.table(rows[0]); 
    })
    .then(() => mainMenu());
};

// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
const addDepartment = (name) => {
    db.promise().query('INSERT INTO department (name) VALUES (?)', name)
    .then(() => { 
        console.log(`${name} was successfully added to departments!`); 
    })
    .then(() => mainMenu());
}

// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
const addRole = async (title, salary, department) => {
    db.promise().query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, department])
    .then(() => console.log(`${title} was successfully added to roles!`))
    .then(() => mainMenu());
};

// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
const addEmployee = (first_name, last_name, role, manager) => {
    db.promise().query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [first_name, last_name, role, manager])
    .then(() => console.log(`${first_name} ${last_name} was successfully added to employees!`))
    .then(() => mainMenu());
};

// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database
const updateRole = (employee, newRole) => {
    db.query('UPDATE employee SET role_id = ? WHERE id = ?', [newRole, employee], (err, results) => { 
        if(err) {
            console.log(err);
        } else {
            console.log(`Role was successfully updated!`);
            return mainMenu();
        };
    });
};

const viewBudget = () => {
    db.query('SELECT department.name AS Department, CONCAT(\'$\', FORMAT(SUM(role.salary), \'C\', \'en-us\')) AS Utilized_Budget FROM employee JOIN role ON role.id = employee.role_id JOIN department ON department.id = role.department_id GROUP BY department.name', (err, results) => { 
        if(err) {
            console.log(err);
        } else {
            console.table(results);
            return mainMenu();
        };
    });
};

const choice = (str) => {
    let managerList;
    let roleList;
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
            break;
        case 'Add a role': 
            db.promise().query('SELECT * FROM department')
            .then((rows, fields) => {
                return rows[0].map((dept) => ({
                    name: `${dept.name}`,
                    value: `${dept.id}`
                }));
            })
            .then((departmentList)=> {
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
                        choices: departmentList
                    }
                ])
                .then((answer) => {
                    return addRole(answer.title, answer.salary, answer.department);
                });
            });
            break;
        case 'Add an employee':
            db.promise().query('SELECT * FROM employee')
            .then((rows, fields) => {
                managerList = rows[0].map((manager) => ({
                    name: `${manager.first_name} ${manager.last_name}`,
                    value: `${manager.id}`
                }));
            })
            .then(() => {
                db.promise().query('SELECT * FROM role')
                .then((rows, fields) => {
                    roleList = rows[0].map((role) => ({
                        name: `${role.title}`,
                        value: `${role.id}`
                    }));
                })
                .then(() => {
                    inquirer
                        .prompt([
                            {
                                type: 'input',
                                message: 'What is the new employee\'s first name?',
                                name: 'firstName'
                            },
                            {
                                type: 'input',
                                message: 'What is the new employee\'s last name?',
                                name: 'lastName'
                            },
                            {
                                type: 'list',
                                message: 'Choose the role for the new employee:',
                                name: 'role',
                                choices: roleList
                            },
                            {
                                type: 'list',
                                message: 'Choose the manager for the new employee:',
                                name: 'manager',
                                choices: managerList
                            }
                        ])
                        .then((answer) => {
                            return addEmployee(answer.firstName, answer.lastName, answer.role, answer.manager);
                        });
                })
            }); 
            break;
        case 'Update an employee role':
            db.promise().query('SELECT * FROM employee')
            .then((rows, fields) => {
                managerList = rows[0].map((manager) => ({
                    name: `${manager.first_name} ${manager.last_name}`,
                    value: `${manager.id}`
                }));
            })
            .then(() => {
                db.promise().query('SELECT * FROM role')
                .then((rows, fields) => {
                    roleList = rows[0].map((role) => ({
                        name: `${role.title}`,
                        value: `${role.id}`
                    }));
                })
                .then(() => {    
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                message: 'What employee do you want to update?',
                                name: 'employee',
                                choices: managerList
                            },
                            {
                                type: 'list',
                                message: 'Choose the new role for the employee:',
                                name: 'role',
                                choices: roleList
                            },
                        ])
                        .then((answer) => {
                            return updateRole(answer.employee, answer.role);
                        });
                    });
            });
        case 'View department\'s utilized budget':
            return viewBudget();
    }
};

module.exports = { mainMenu };