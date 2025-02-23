import * as fs from 'node:fs';
import express from 'express';

const Router = express.Router();

// ******** NORMAL GET WITHOUT PUG ******** //
// Router.get('/', (req, res) => {
//   // let readFile = fs.readFileSync('./employeesData.json');
//   // readFile = JSON.parse(readFile);
//   // // res.json(readFile);
//   res.render('index', {name: "jjjj"});
// });


// ******** GET WITH PUG ******** //
Router.get('/', (req, res) => {
  let readFile = fs.readFileSync('./employeesData.json');
  readFile = JSON.parse(readFile);
  // rendering PUG
  res.render('employees', { 
    readFile 
  });
});

// ******** GET EMPLOYEE BY ID ********
// Router.get('/:id', (req, res, next) => {
//   const jsonFile = JSON.parse(fs.readFileSync('./employeesData.json'));
//   const idisFound = jsonFile.some((jsonid) => Number(jsonid.id) === Number.parseInt(req.params.id));
//   if (Number.isNaN(Number.parseInt(req.params.id)) || idisFound === false) {
//     res.status(404).send('Employee id unavailable !');
//   } else {
//     next();
//   }
// }, (req, res) => {
//   const employee = req.params.id; // to get the /:id in the API
//   // read lab1.json and get this id
//   const jsonFile = JSON.parse(fs.readFileSync('./employeesData.json'));
//   const foundEmployee = jsonFile.find((emp) => {
//     return emp.id === Number(employee);
//   });
//   res.json(foundEmployee);
// });



// ******** BONUS --> FILTER ********
Router.get('/filter', (req, res) => {
  const query = req.query;
  const jsonFile = JSON.parse(fs.readFileSync('./employeesData.json'));
  const filteredKeys = Object.keys(query);
  const filteredValues = Object.values(query);
  const filteredEmp = jsonFile.filter((emp) => {
    if(filteredKeys.toString() === 'name' || filteredKeys.toString() === 'email'){
      return emp[filteredKeys] === filteredValues.toString();
    }
    else if(filteredKeys.toString() === 'salary' || filteredKeys.toString() === 'level' || filteredKeys.toString() === 'yearsOfExperience'){
      return emp[filteredKeys] === Number(filteredValues);
    }
  });
  res.send(filteredEmp);
});


// ******** ADD AN EMPLOYEE ********
Router.post('/', express.json(), (req, res, next) => {
  const newEmpKeys = Object.keys(req.body);
  const newEmpValues = Object.values(req.body);
  for (let i = 0; i < newEmpKeys.length; i++) {
    if (newEmpKeys[i] === 'salary' && (typeof (newEmpValues[i]) != 'number' || newEmpValues[i] <= 0)) {
      res.status(404).send('Salary has to be positive number !');
      return;
    } else if (newEmpKeys[i] === 'level' && (typeof (newEmpValues[i]) != 'number' || newEmpValues[i] <= 0)) {
      res.status(404).send('Level has to be positive number !');
      return;
    } else if (newEmpKeys[i] === 'yearsOfExperience' && (typeof (newEmpValues[i]) != 'number' || newEmpValues[i] <= 0)) {
      res.status(404).send('yearsOfExperience has to be positive number !');
      return;
    } else if (newEmpKeys[i] === 'email' && typeof newEmpValues[i] === 'string' && !newEmpValues[i].match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) || newEmpKeys[i] === 'email' && typeof newEmpValues[i] !== 'string') {
      res.status(404).send('Email has to be in the correct format !');
      return;
    } else if (newEmpKeys[i] === 'name' && (typeof (newEmpValues[i]) != 'string')) {
      res.status(404).send('Name has to be a string !');
      return;
    }
  }
  next();
}, (req, res) => {
  const newEmp = req.body;
  const jsonFile = JSON.parse(fs.readFileSync('./employeesData.json'));
  // increment the id everytime --> adding the length of json file by 1
  req.body.id = jsonFile.at(-1)?.id + 1;
  // gets the id of last element of the array (last object)
  // push the new object in lab1.json
  jsonFile.push(newEmp);
  fs.writeFileSync('./employeesData.json', JSON.stringify(jsonFile, null, 2));
  console.log('New Employee:', newEmp);
  res.status(200).send('Employee added successfully!');
});

// ******** DELETE AN EMPLOYEE ********
Router.delete('/:id', (req,res,next) => {
  const jsonFile = JSON.parse(fs.readFileSync('./employeesData.json'));
  const idisFound = jsonFile.some((jsonid) => Number(jsonid.id) === Number.parseInt(req.params.id));
  if(idisFound === true){
    next();
  } else{
    res.status(404).send('Employee id unavailable !');
  }
},
(req, res) => {
  const jsonFile = JSON.parse(fs.readFileSync('./employeesData.json'));
  const empId = req.params.id; // to get the /:id in the API
  const newEmpArr = jsonFile.filter((emp) => { return Number(empId) !== emp.id }
  );
  fs.writeFileSync('./employeesData.json', JSON.stringify(newEmpArr, null, 2));
  res.status(200).send("Employee deleted successfully !");
});


// ******** UPDATING A FIELD IN AN EMPLOYEE BY ID ********
Router.patch('/:id', express.json(), (req, res, next) => {
  const updatedValue = req.body; 
  const empKeys = Object.keys(updatedValue);
  const empValues = Object.values(updatedValue);
  const jsonFile = JSON.parse(fs.readFileSync('./employeesData.json'));
  const idisFound = jsonFile.some((jsonid) => Number(jsonid.id) === Number.parseInt(req.params.id));
  if(idisFound === false){
    res.status(404).send('Employee id unavailable !');
    return;
  }else{
  for (let i = 0; i < empKeys.length; i++) {
    if (empKeys[i] === 'salary' && (typeof (empValues[i]) != 'number' || empValues[i] <= 0)) {
      res.status(404).send('Salary has to be positive number !');
      return;
    } else if (empKeys[i] === 'level' && (typeof (empValues[i]) != 'number' || empValues[i] <= 0)) {
      res.status(404).send('Level has to be positive number !');
      return;
    } else if (empKeys[i] === 'yearsOfExperience' && (typeof (empValues[i]) != 'number' || empValues[i] <= 0)) {
      res.status(404).send('yearsOfExperience has to be positive number !');
      return;
    } else if (empKeys[i] === 'email' && typeof empValues[i] === 'string' && !empValues[i].match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) || empKeys[i] === 'email' && typeof empValues[i] !== 'string') {
      res.status(404).send('Email has to be in the correct format !');
      return;
    } else if (empKeys[i] === 'name' && (typeof (empValues[i]) != 'string')) {
      res.status(404).send('Name has to be a string !');
      return;
    }
  }
}
  next();
}, (req, res, next) => {
  const employeeId = req.params.id;
  // RouterROACH--> take the filter of Router.getById --> change the field/s value/s according to the req.body

  // ********** GETTING THE EMPLOYEE BY ID ********** //
  const jsonFile = JSON.parse(fs.readFileSync('./employeesData.json'));

  const updatedEmployee = jsonFile.find((emp) => {
    return emp.id === Number(employeeId);
  });
  const updatedValue = req.body; // user-input of new data
  // ********** GETTING THE KEYS OF THE REQ.BODY ********** //
  const empKeys = Object.keys(updatedValue);
  // ********** GETTING THE VALUES TO UPDATE WITH FROM THE REQ.BODY ********** //
  const empValues = Object.values(updatedValue);

  // console.log(empKeys); // get the keys
  // console.log(empValues); // get the values

  // ********** LOOPING OVER THE OBJ. OF THE REQ.BODY TO UPDATE THE 'updatedEmployee' ********** //
  for (let i = 0; i < empKeys.length; i++) {
    updatedEmployee[empKeys[i]] = empValues[i];
  }
  fs.writeFileSync('./employeesData.json', JSON.stringify(jsonFile, null, 2));
  res.json(updatedEmployee);
  next();
});

export default Router;
