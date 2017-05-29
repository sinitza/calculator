'use strict';

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

app.listen(3001);

app.use(express.static(__dirname + '/public/'));

app.use(bodyParser.json());
