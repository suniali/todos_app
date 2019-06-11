const { ObjectID } = require('mongodb');
const Note = require('./../../model/note');

const testNote = [{
    _id: new ObjectID(),
    note: 'First Note For My Best Friend Amin.',
    age: 37,
    tell: '12345678910',
}, {
    _id: new ObjectID(),
    note: 'Second Note For My Best Friend Amin.',
    age: 22,
    tell: '12345678910',
}];

const removeNotes = (done) => {
    Note.remove({}).then(() => done()).catch((err) => done(err));
};
const insertNotes = (done) => {
    Note.insertMany(testNote).then(() => done()).catch((e) => done(e));
};

module.exports = { removeNotes, insertNotes, testNote };