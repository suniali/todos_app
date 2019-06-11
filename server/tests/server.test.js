const expect = require('expect');
const request = require('supertest');
const jwt = require('jsonwebtoken');

const { app } = require('../mongoose_connect');
const Note = require('../model/note');

const { removeNotes, insertNotes, testNote } = require('./seed/seed_note');
const { testUser, removeUsers, insertUsers } = require('./seed/seed_user');

beforeEach(removeNotes);
beforeEach(removeUsers);
beforeEach(insertNotes);
beforeEach(insertUsers);


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

describe('Post /user', () => {
    it('test should add a user in database.', (done) => {
        request(app)
            .post('/user')
            .send({
                _id: testUser[0]._id.toHexString(),
                email: "Amin" + testUser[0].email,
                password: testUser[0].password
            })
            .expect(200)
            .expect((res) => {
                // expect(res.body.email).toBe("Amin" + testUser[0].email);
                var hash = jwt.verify(res.header['jarvis-auth'], 'I Love Amin');
                expect(hash._id).toBe(res.body._id);
            })
            .end(done);
    });

    it('test should not add a user and err 401', (done) => {
        request(app)
            .post('/user')
            .expect(500)
            .end(done);
    });

});

describe('Get /user/me', () => {
    it('test should get user and check tokens', (done) => {
        request(app)
            .get('/user/me')
            .set('jarvis-auth', testUser[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(testUser[0]._id.toHexString());
                expect(res.body.email).toBe(testUser[0].email);
            })
            .end(done);
    });
    it('test should not get user and check tokens', (done) => {
        request(app)
            .get('/user/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            }).end(done);
    });
});

describe('Login', () => {
    it('test login user.', (done) => {
        var email = "Amin" + testUser[0].email;
        var password = testUser[0].password;
        request(app)
            .post('/user')
            .send({ email, password })
            .expect(200)
            .end((err) => {
                if (err) {
                    done(err);
                }
                request(app)
                    .post('/user/login')
                    .send({ email, password })
                    .expect(200)
                    .end(done);

            });
    });
    it('test should not login user.', (done) => {
        request(app)
            .post('/user/login')
            .expect(400)
            .end(done);
    });
});