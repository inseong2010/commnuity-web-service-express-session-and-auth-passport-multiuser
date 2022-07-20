var express = require("express");
var app = express();
const fs = require("fs");
var compression = require('compression');
var session = require('express-session');
var fileStore = require('session-file-store')(session);
var flash  = require('connect-flash');
const PORT = 80;

app.use(express.static('public'));
app.use(express.urlencoded({ extends: false}));
app.use(compression());
app.use(session({
    httpOnly: true,
    secret: 'adasdadasdfsdfsfs',
    resave: false,
    saveUninitialized: true,
    store: new fileStore()
}));
app.use(flash());

var passport = require('./lib/passport')(app);



app.get('*', (req, res, next) => {
    fs.readdir('./data', (err, filelist) => {
        req.list = filelist;
        next();
    });
});

var indexRouter = require('./routes/index');
var pageRouter = require('./routes/page');
var authRouter = require('./routes/auth')(passport);

app.use('/', indexRouter);
app.use('/page', pageRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
    res.status(404).send(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            body {
                text-align: center;
            }
        </style>
    </head>
    <body>
        <p>Page Not found</p>
    </body>
    </html>
    `);
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            body {
                text-align: center;
            }
        </style>
    </head>
    <body>
        <p>Something broke</p>
    </body>
    </html>
    `);
});

app.listen(PORT, () => {
    console.log(PORT)
});

/* var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template');
var path = require('path');
var sanitizehtml = require('sanitize-html');

var app = http.createServer(function(request,response) {
    var QueryData = url.parse(request.url, true).query;
    var uri = url.parse(request.url, true).pathname;

    if (uri === '/') {
        if (QueryData.page === undefined) {
        } else {
    } else if (uri === '/create') {
    } else if (uri === '/create_process') {
    } else if (uri === '/update') {
    } else if (uri === '/update_process') {
    } else if (uri === '/delete_process') {
     } else {
        response.writeHead(404);
        response.end(`
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <style>
                body {
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <p>Not found</p>
        </body>
        </html>
        `);
    }
});
app.listen(3000); */