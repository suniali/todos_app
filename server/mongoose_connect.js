const mongoose = require('mongoose');
const express = require('express');
require('dotenv/config');
const Post = require('./model/todo');
const postRoute = require('./routes/todos');
const parser = require('body-parser');

const app = express();
const port = process.env.port || 3000;

app.use(parser.json());
app.use('/', postRoute);



mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }).then(() => {
    console.log('Connected to Todos Database SuccessFull BY MONGOOSE.');
}).catch((err) => {
    console.log(err);
})


app.listen(port, () => {
    console.log("Starting server on port ", port);

});

module.exports = { app };
