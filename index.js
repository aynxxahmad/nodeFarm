//modules
const http= require('http');
const fs = require('fs');
const url = require('url');
const tempReplace = require('./modules/tempReplace')

//reading files synchronously as they will be read only once during the start of the program
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`);
const dataObj = JSON.parse(data);
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,"utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,"utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,"utf-8");



//server
const server = http.createServer((req,res)=>{
    const {query,pathname} = url.parse(req.url,true);

    //overview
    if(pathname==='/' || pathname==='/overview'){
        res.writeHead(200,{
            'content-type' : 'text/html'
        })
        const cardsHtml = dataObj.map(el => tempReplace(tempCard,el)).join("");
        let output = tempOverview.replace(/{%PRODUCTS%}/,cardsHtml);
        res.end(output);
    }

    //product
    else if(pathname==='/product'){
        const product = dataObj[query.id];
        const output = tempReplace(tempProduct,product);

        res.writeHead(200,{
            'content-type' : 'text/html'
        })
        res.end(output);
    }
    else if(pathname==='/api'){
        res.writeHead(200,{
            'content-type' : 'application/json'
        })
        res.end(data);
    }
    else{
        res.writeHead(404,{
            'content-type' : 'text/html'
        })
        res.end('<h1>ERROR.PAGE NOT FOUND</h1>');
    }
});


server.listen(8000,()=>{
    console.log('server running');
});