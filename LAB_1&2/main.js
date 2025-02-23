let index = require('./index.js');
// name it as a helper, be descriptive
const [, , command, ...empData] = process.argv;
if (command === 'add') {
    index.addEmployee(empData);
}
else if (command === 'list' && empData.length === 0 || (command === 'list' && empData.length >= 1)) {
    index.listEmployees(empData);
}
else if (command === 'edit' && empData.length >= 1) {
    index.editEmployee(empData);
}
else if (command === 'delete' && empData.length >= 1) {
    index.deleteEmployee(empData);
}
else {
    console.log("\x1b[31mError:\x1b[0m COMMAND UNAVAILABLE !");
}