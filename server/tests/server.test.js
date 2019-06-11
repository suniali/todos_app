const expect = require('expect');
const request = require('supertest');


const { app } = require('../mongoose_connect');
const Note = require('../model/note');


const { removeNotes, insertNotes, testNote } = require('./seed/seed_note');


beforeEach(insertNotes);


afterEach(removeNotes);


describe('Post / Todos', () => {
    it('test should create New Todo', (done) => {
        var note = "First Note For My best Friend Amin.";
        var age = 37;
        var tell = "12345678910";

        request(app)
            .post('/')
            .send({ note: note, age: age, tell: tell })
            .expect(200)
            .expect((res) => {
                expect(JSON.parse(res.text)).toMatchObject({ note });
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Note.find({ note }).then((res) => {
                    expect(res.length).toBe(1);
                    expect(res[0]).toMatchObject({ note });
                    done();
                }).catch((e) => done(e));
            });
    });

    it('test should note create todo', (done) => {
        var note = "First Note For My best Friend Amin.";
        var age = 37;
        var tell = "123456";
        request(app)
            .post('/')
            .send({ note, age, tell })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Note.find().then((res) => {
                    expect(res.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('Get / todos', () => {
    it('test get all notes', (done) => {
        request(app)
            .get('/find')
            .expect(200)
            .expect((res) => {
                expect(res.body.length).toBe(2);
                expect(res.body[0]._id).toBe(testNote[0]._id.toHexString());
                expect(res.body[1]._id).toBe(testNote[1]._id.toHexString());

            }).end(done);
    });
    it('test should get id and return Note', (done) => {
        request(app)
            .post('/find')
            .send({ id: testNote[0]._id.toHexString() })
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(testNote[0]._id.toHexString());
            })
            .end(done);

    });
});

describe('Delete / todos', () => {
    it('test should delete remove note', (done) => {
        request(app)
            .delete('/deleteByID/' + testNote[0]._id.toHexString())
            .expect(200)
            .expect((res) => {
                expect(res.body.deletedCount).toBe(1);
            })
            .end(done);
    });

    it('test should not remove note', (done) => {
        request(app)
            .delete('/deleteByID/123')
            .expect(500)
            .end(done);
    });
});

describe('Update / todos', () => {
    it('test should update note', (done) => {
        var note = "This This THis";
        var age = 44;
        request(app)
            .patch('/update/' + testNote[0]._id.toHexString())
            .send({ note, age })
            .expect(200)
            .expect((res) => {
                expect(res.body.nModified).toBe(1);
            })
            .end(done);
    });

    it('test should not update note', (done) => {
        request(app)
            .patch('/update/123')
            .send({})
            .expect(400)
            .end(done);
    });
});