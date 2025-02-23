const fs = require('fs');

// Add employee 
// 1st thing --> VALIDATION 
function addEmployee(empData) {
	let empId;
	let employeesFile = [];
	var addedData = {};
	var addIdFlag = 0;
	// if file exists && it's NOT empty (size > 0)
	if (fs.existsSync('./lab1.json') && fs.statSync('./lab1.json').size > 0 || fs.statSync('./lab1.json').size === 2) {
		// statsync not needed
		if (fs.existsSync('./lab1.json') && fs.statSync('./lab1.json').size > 0) {
			// reading the file if file exists to append
			// check id by number of employees added
			var [name, email, salary, level, yearsOfExperience] = empData;
			addIdFlag = 1;
			employeesFile = JSON.parse(fs.readFileSync('./lab1.json'));
			// getting the ID of the last obj. & incrementing on it
			empId = employeesFile[employeesFile.length - 1].id;
			addedData = { id: ++empId };
		}
	}
	else {
		// 1st obj. to add so ID = 1
		addIdFlag = 1;
		empId = 1;
		addedData = { id: empId };
	}

	let i = 0;
	let flag = 0;
	let strArr = [];
	let requiredName = false;
	let requiredEmail = false;
	let requiredSalary = false;
	// empData --> passed arguments
	while (i < empData.length) {
		addIdFlag = 1
		let split = empData[i].split("=");
		// destructuring
		// --name = jana --> split by = to take both separately
		var str = split[0];
		str = str.replace("--", "");
		addedData[str] = split[1];
		if (str.toLowerCase() === "name") {
			addedData[str] = String(addedData[str]);
			requiredName = true;
			if (!(isNaN(addedData[str])) && typeof addedData[str] !== "string" && !addedData[str].match('^!@#$*()')) {
				addIdFlag = 0;
				console.log("\x1b[31mError:\x1b[0m Name has to be a string !");
				return;
			}
		}
		else if (str.toLowerCase() === "email") {
			addedData[str] = String(addedData[str]);
			requiredEmail = true;
			if (!(addedData[str].match('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')) && flag === 0) {
				flag = 1;
				addIdFlag = 0;
				console.log("\x1b[31mError:\x1b[0m Email has to be in the correct format !");
				return;
			}
		}
		else if (str.toLowerCase() === "salary") {
			addedData[str] = Number(addedData[str]);
			requiredSalary = true;
			if (isNaN(addedData[str]) || !(addedData[str] > 0)) {
				addIdFlag = 0;
				console.log("\x1b[31mError:\x1b[0m Salary has to be a positive number!");
				return;
			}
		}
		else if (str.toLowerCase() === "level") {
			addedData[str] = String(addedData[str]);
			var levelArr = ["Jr", "Mid-Level", "Sr", "Lead"];
			if (!(levelArr.includes(addedData[str]))) {
				addIdFlag = 0;
				console.log("\x1b[31mError:\x1b[0m Level has to be one of these --> “Jr”, “Mid-Level”, “Sr”, “Lead” !");
				return;
			}
		}
		else if (str === "yearsOfExperience") {
			addedData[str] = Number(addedData[str]);
			if (isNaN(addedData[str]) || !(addedData[str] > 0)) {
				addIdFlag = 0;
				console.log("\x1b[31mError:\x1b[0m yearsOfExperience has to be a positive number !");
				return;
			}
		}
		strArr.push(str);
		i++;
	}

	// default values (level & yearsOfExperience)
	// CHECKING IF level/yearsOfExperience IS NOT THERE, ADD ITS DEFAULT Jr
	if (!(strArr.includes('level')) || !(strArr.includes('yearsOfExperience'))) {
		if (!(strArr.includes('level'))) {
			addedData.level = "Jr";
		}
		if (!(strArr.includes('yearsOfExperience'))) {
			addedData.yearsOfExperience = 0;
		}
	}
	if (!requiredName || !requiredEmail || !requiredSalary) {
		console.log("\x1b[31mError:\x1b[0m Some required fields are missing !");
		return;
	}
	// adding new objects
	if (addIdFlag === 1) {
		employeesFile.push(addedData);
		fs.writeFileSync('./lab1.json', JSON.stringify(employeesFile, null, 2));
		console.log("\x1b[32mSuccess:\x1b[0m Employee added successfully !");
	}
}


// string, append data using object.entries, log this string
// List employee/s 
function listEmployees(empData) {
	// list ALL employees
	if (empData.length === 0) {
		var listStr = "";
		let s = 0;
		let employeesFile = JSON.parse(fs.readFileSync('./lab1.json'));
		while (s < employeesFile.length) {
			// read file, loop over array of obj., display each obj.
			Object.entries(employeesFile[s]).map(
				element => listStr += element[0] + ": " + element[1] + " "
			);
			listStr += "\n========================================================================================\n";
			s++;
		}
		console.log(listStr);
	}
	// list by ID
	else if (empData.length >= 1) {
		let a = 0;
		let flagId = 0;
		let readEmployeesFile = JSON.parse(fs.readFileSync('./lab1.json'));
		var savedId;
		while (a < readEmployeesFile.length) {
			// read file, loop over array of obj., display each obj.
			const empArray = Object.entries(readEmployeesFile[a]);
			for ([key, value] in empArray) {
				if (empData[0] == empArray[0][1]) {
					savedId = empArray[0][1];
					flagId = 1;
				}
				break;
			}
			a++;
		}
		// decrease the index by 1  to get the correct object in the array
		if (flagId === 1) {
			console.log(`ID: ${readEmployeesFile[savedId - 1].id} Name: ${readEmployeesFile[savedId - 1].name} Email: ${readEmployeesFile[savedId - 1].email} Salary: ${readEmployeesFile[savedId - 1].salary} Level: ${readEmployeesFile[savedId - 1].Level} yearsOfExperience: ${readEmployeesFile[savedId - 1].yearsOfExperience}`);
		}
		else if (flagId === 0) {
			console.log("\x1b[31mError:\x1b[0m ID UNAVAILABLE !");
		}
	}
}

// Edit employee  
function editEmployee(empData) {
	// edit by ID
	// check if the ID is available (read the file and check on ID)
	// if available --> check which field to edit by removing = in --name=jana
	// & checking which field to change and adding the updated value (jana)
	// if unavailable --> 'ID UNAVAILABLE !'
	// edit 3 --name=”new Name”;
	var flagEditedId = 0;
	let editEmployeesFile = JSON.parse(fs.readFileSync('./lab1.json'));
	for (let e = 0; e < editEmployeesFile.length; e++) {
		if (empData[0] == editEmployeesFile[e].id) {
			flagEditedId = 1;
			let splitValue = empData[1].split("=");
			keyAttr = splitValue[0].replace("--", "");
			value = splitValue[1];
			if (keyAttr.toLowerCase() === 'name') {
				if (!(isNaN(value)) && typeof value !== "string") {
					console.log("\x1b[31mError:\x1b[0m Name has to be a string !");
					return;
				}
				editEmployeesFile[e].name = String(value);
			}
			else if (keyAttr.toLowerCase() === 'email') {
				if (!(value.match('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'))) {
					console.log("\x1b[31mError:\x1b[0m Email has to be in the correct format !");
					return;
				}
				editEmployeesFile[e].email = String(value);
			}
			else if (keyAttr.toLowerCase() === 'salary') {
				if (isNaN(value) || !value > 0) {
					console.log("\x1b[31mError:\x1b[0m Salary has to be a positive number!");
					return;
				}
				editEmployeesFile[e].salary = Number(value);
			}
			else if (keyAttr.toLowerCase() === 'level') {
				var levelArr = ["Jr", "Mid-Level", "Sr", "Lead"];
				if (!(levelArr.includes(value))) {
					console.log("\x1b[31mError:\x1b[0m Level has to be one of these --> “Jr”, “Mid-Level”, “Sr”, “Lead” !");
					return;
				}
				editEmployeesFile[e].level = Number(value);
			}
			else if (keyAttr === 'yearsOfExperience') {
				if (isNaN(value) || !value > 0) {
					console.log("\x1b[31mError:\x1b[0m yearsOfExperience has to be a positive number !");
					return;
				}
				editEmployeesFile[e].yearsOfExperience = Number(value);
			}
			else if (keyAttr.toLowerCase() === 'id') {
				console.log("\x1b[31mError:\x1b[0m Can not edit by ID !");
				return;
			}
			else if (value.length != 0) {
				console.log(keyAttr);
				editEmployeesFile[e][keyAttr] = value;
			}
			else {
				console.log("\x1b[31mError:\x1b[0m Can not add empty values !");
				return;
			}
			fs.writeFileSync('./lab1.json', JSON.stringify(editEmployeesFile, null, 2));
			console.log("\x1b[32mSuccess:\x1b[0m Field updated successfully !");
		}
	}
	if (flagEditedId === 0) {
		console.log("\x1b[31mError:\x1b[0m ID UNAVAILABLE !");
	}
}

// Delete employee 
function deleteEmployee(empData) {
	var flagDeletedId = 0;
	deleteEmployeesFile = JSON.parse(fs.readFileSync('./lab1.json'));
	for (let d = 0; d < deleteEmployeesFile.length; d++) {
		if (empData[0] == deleteEmployeesFile[d].id) {
			flagDeletedId = 1;
			// filter and keep all objects w/ id NOT = to deleteEmployeesFile[d].id
			let filteredArray = deleteEmployeesFile.filter((emp) => deleteEmployeesFile[d].id != emp.id);
			fs.writeFileSync('./lab1.json', JSON.stringify(filteredArray, null, 2));
		}
	}
	if (flagDeletedId === 0) {
		console.log("\x1b[31mError:\x1b[0m ID UNAVAILABLE !");
	}
}

module.exports = { addEmployee, listEmployees, editEmployee, deleteEmployee };
