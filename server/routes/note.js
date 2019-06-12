const express = require('express');
const Note = require('../model/note');
const { ObjectID } = require('mongodb');
const _ = require('loadsh');

const { authenticate } = require('../middlewarer/authenticate');

const routes = express.Router();

routes.get('/', (req, res) => {
    res.send("Wellcome to Mongoose World.");
});

routes.post('/', authenticate, async (req, res) => {
    // console.log(req.body);

    var note = new Note({
        note: req.body.note,
        pr: req.body.pr,
        description: req.body.description,
        tell: req.body.tell,
        age: req.body.age,
        _creator: req.user._id
    });

    try {
        var saveNote = await note.save();
        res.json(saveNote);
    } catch (err) {
        res.statusCode = 400;
        res.json({ err_msg: err });
    }
});

routes.get('/find', authenticate, async (req, res) => {
    try {
        const notes = await Note.find({ _creator: req.user._id });
        res.json(notes);
    } catch (err) {
        console.log(err);
        res.json({ err_msg: err });
    }
});


routes.post('/find', authenticate, async (req, res) => {
    console.log("ID:",req.body.id);
    
    if (ObjectID.isValid(req.body.id)) {
        try {
            var note = await Note.findOne({ _id: req.body.id, _creator: req.user._id });
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
            var deleteNote = await Note.deleteOne({ _id: id });
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
            var updateNote = await Note.updateOne({ _id: id }, { note: body.note, age: body.age });
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