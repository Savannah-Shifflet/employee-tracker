const { viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateRole, mainMenu, choice } = require('./db/index');

const init = () => {
    mainMenu();
};

init();
