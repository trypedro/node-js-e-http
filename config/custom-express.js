const express = require('express')
const consign = require('consign')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')

module.exports = () => {

    let app = express()

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    app.use(expressValidator());

    consign()
        .include('routes')
        .then('persistence')
        .then('services')
        .into(app);

    return app;
}