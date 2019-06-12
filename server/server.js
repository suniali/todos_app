require('./config/config');
const express = require('express');
require('dotenv/config');
const { mongoose } = require('./db/mongoose');
const NoteRoute = require('./routes/note');
const parser = require('body-parser');
const UserRoute = require('./routes/users');

const app = express();
const port = process.env.port || 3000;

app.use(parser.json());
app.use('/', [NoteRoute, UserRoute]);




app.listen(port, () => {
    console.log("Starting server on port ", port);

});

module.exports = { app };
