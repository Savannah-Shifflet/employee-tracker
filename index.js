const { mainMenu } = require('./db/index');
const chalk = require('chalk');

const init = () => {
    console.log(chalk.bold.bgMagenta('\n    Employee Tracker     '));
    console.log('========================= \n');
    mainMenu();
};

init();
