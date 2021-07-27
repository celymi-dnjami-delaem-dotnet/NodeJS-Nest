const http = require('http');
const fs = require('fs');

const port = 3000;
const baseProductsRoute = '/products';

const mockData = JSON.parse(fs.readFileSync('mock-data.json'));

http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.url === baseProductsRoute && req.method === 'GET') {
        res.write(JSON.stringify(mockData));
        res.end();

        return;
    }

    if (req.url === baseProductsRoute && req.method === 'POST') {
        let data = '';
        req.on('data', buf => {
            data += buf;
        })
        req.on('end', () => {
            data = JSON.parse(data);
            mockData.push(data);

            res.statusCode = 201;
            res.end();
        })

        return;
    }

    res.write("This page does not exist :(");
    res.end();
}).listen(port, (err) => {
    if (err) {
        console.error('Some error appeared during server start');
    }
});
