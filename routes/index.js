/* 
index.js

This script contains necessary code to handle routes to /api

Copyright Leo Wong 2022
*/

const express = require('express');

// Import modular router for /notes
const notesRouter = require('./notes');

const app = express();

app.use('/notes', notesRouter);

module.exports = app;
