const mongoose = require('mongoose');
const express = require('express');
require('dotenv/config');
const NoteRoute = require('./routes/todos');
const parser = require('body-parser');
// const UserRoute=require('./routes/users');

const app = express();
const port = process.env.port || 3000;

app.use(parser.json());
app.use('/', NoteRoute);
// app.use('/',UserRoute);



mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }).then(() => {
    console.log('Connected to Todos Database SuccessFull BY MONGOOSE.');
}).catch((err) => {
    console.log(err);
})


app.listen(port, () => {
    console.log("Starting server on port ", port);

});

module.exports = { app };
