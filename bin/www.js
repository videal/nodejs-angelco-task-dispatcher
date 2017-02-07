const companyTaskDispatcher = require('../');
const express = require('express');
const app = express();

app.get('/', function (request, response) {
    const result = 'App is running';
    response.send(result);
});
app.listen(process.env.PORT || 5000, () => {
    console.log('App is running');
});

setInterval(() => {
    console.log('Start dispatch by setInterval');
    companyTaskDispatcher();
}, 300000);