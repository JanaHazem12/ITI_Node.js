import fs from 'fs';
import http from 'http';

const server = http.createServer((req, res) => {
    const { url, method } = req;
    // console.log({ url, method });
    if (url === '/' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        let employeesData = JSON.parse(fs.readFileSync('./lab1.json', 'utf8'));
        let addEmployee = '<div>';
        // looping over array of objects in JSON file
        for (let e = 0; e < employeesData.length; e++) {
            // destructuring --> omit the 'id' + rest operator
            const { id, ...employeeWithoutId } = employeesData[e];
            // looping over the obejct to remove the { } for readability
            let employeeDetails = '';
            for (let key in employeeWithoutId) {
                employeeDetails += `${key}: ${employeeWithoutId[key]}<br>`;
            }
            addEmployee += `<p>${employeeDetails}</p><br>`;
        }
        addEmployee += '</div>';
        let html = fs.readFileSync('./listEmployees.html', 'utf8');
        html = html.replace('<!-- json data -->', addEmployee);
        res.end(html);
    }
    // it has to be an HTML page ^^ - code that appends employee data inside this HTML page
    // loop over the array of objects put it in <p> or headers
    else if (url === '/astronomy' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        let html = fs.readFileSync('./astronomy.html');
        html = html.toString();
        html = html.replace('<!-- add astronomyPic here -->', '<img src="./astronomyPic.jpeg" alt="astronomyImg">');
        res.end(html);
    } 
    else if (url === '/employee' && method === 'GET'){
        let html = fs.readFileSync('./employeeForm.html');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    }
    else if (url === '/employee' && method === 'POST'){
        let body="";
        req.on('data', chunk => {
            console.log("data");
            body += chunk.toString();
        });
        req.on("end", () => {
            // console.log(body);
            const params = new URLSearchParams(body);
            
            // params.forEach((val,key) => console.log(val,key)); 
            let employeeObj = Object.fromEntries(params.entries());
            employeeObj['salary'] = Number(employeeObj['salary']);
            employeeObj['level'] = Number(employeeObj['level']);
            employeeObj['yearsOfExperience'] = Number(employeeObj['yearsOfExperience']);
            // console.log(employeeObj['salary']);
            let employees = [];
            employees = JSON.parse(fs.readFileSync('./lab1.json'));
            employees.push(employeeObj);
            // put the params in the json file, the array of objects
            fs.writeFileSync('./lab1.json', JSON.stringify(employees, null, 2));    
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Form submitted successfully!');  
        });
    }
    // else if(url === '/:name/:email/:salary/:level/:yearsOfExperience' && method === 'POST'){
    //     res.writeHead(200, { 'Content-Type': 'application/json' });
    //     res.end(JSON.stringify({
    //     message: 'Employee data added successfully!',
    //     data: url.parse(req.url, true).query,
    // }));
    // }
    else if (url === '/astronomyPic.jpeg' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        const astronomyImg = fs.readFileSync("./astronomyPic.jpeg");
        res.end(astronomyImg);
    }
    else if(url === '/serbal' && method === 'GET'){
        res.writeHead(200,{'Content-Type': 'text/html'});
        let html = fs.readFileSync('./serbal.html');
        html = html.toString();
        html = html.replace('<!-- add serbalPic here -->', '<img style="width: 50%; margin: auto;" src="./serbalPic.jpeg" alt="serbalImg">');
        res.end(html);
    }
    else if(url === '/serbalPic.jpeg' && method === 'GET'){
        res.writeHead(200,{'Content-Type': 'image/jpeg'});
        const serbalImg = fs.readFileSync("./serbalPic.jpeg");
        res.end(serbalImg);
    }
    // styling ALL routes
    else if(url === '/style.css' && method === 'GET'){
        fs.createReadStream('./style.css').pipe(res);
    }
    else if(url === '/astronomy/download' && method === 'GET'){
        res.pipe(fs.createWriteStream('astronomyPic.jpeg'));
    }
    else{
        const notFound = fs.readFileSync("./notFound.html");
        res.end(notFound);
    }
}).listen(3000);