const express = require('express');
const Note = require('../model/todo');
const { ObjectID } = require('mongodb');
const _ = require('loadsh');

const routes = express.Router();

routes.get('/', (req, res) => {
    res.send("Wellcome to Mongoose World.");
});

routes.post('/', async (req, res) => {
    // console.log(req.body);

    var note = new Note({
        note: req.body.note,
        pr: req.body.pr,
        description: req.body.description,
        tell: req.body.tell,
        age: req.body.age
    });

    try {
        var saveNote = await note.save();
        res.json(saveNote);
    } catch (err) {
        res.statusCode = 400;
        res.json({ err_msg: err });
    }
});

routes.get('/find', async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (err) {
        console.log(err);
        res.json({ err_msg: err });
    }
});


routes.post('/find', async (req, res) => {
    if (ObjectID.isValid(req.body.id)) {
        try {
            var note = await Note.findById(req.body.id);
            res.json(note);
        } catch (err) { console.log(e); };
    } else {
        res.statusCode = 500;
        res.json({ 'err_msg': 'ID is not valid in database.' });
    }
});

routes.delete('/deleteByID/:id', async (req, res) => {
    var id = req.params.id;
    // console.log(id);

    if (ObjectID.isValid(id)) {
        try {
            var deleteNote = await Note.findOneAndDelete({ _id: id });
            res.json(deleteNote);
        } catch (e) {
            res.statusCode = 600;
            res.send({ 'err_msg': 'Handle error.' });
        }
    } else {
        res.statusCode = 500;
        res.json({ 'err_msg': 'ID is not valid in database.' });
    }
});

routes.patch('/update/:id', async (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['note', 'age']);

    if (ObjectID.isValid(id)) {
        try {
            var updateNote=await Note.findByIdAndUpdate(id,{$set:body});
            res.json(updateNote);
        } catch (e) {
            res.statusCode = 500;
            res.json({ 'err_msg': 'Unable to Update Note!' });
        }
    } else {
        res.statusCode = 400;
        res.json({ 'err_msg': 'Unable valid ID in data server.' });
    }
});

module.exports = routes;