const expect = require('expect');
const request = require('supertest');
const jwt = require('jsonwebtoken');

const { app } = require('../server');
const Note = require('../model/note');

const { removeNotes, insertNotes, testNote } = require('./seed/seed_note');
const { testUser, removeUsers, insertUsers, User } = require('./seed/seed_user');

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
            .set('jarvis-auth', testUser[0].tokens[0].token)
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
            .set('jarvis-auth', testUser[0].tokens[0].token)
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
        var note = testNote[0].note;
        var age = testNote[0].age;
        var tell = testNote[0].tell;
        request(app)
            .post('/')
            .set('jarvis-auth', testUser[0].tokens[0].token)
            .send({ note, age, tell })
            .expect(200)
            .end((err, res) => {
                request(app)
                    .get('/find')
                    .set('jarvis-auth', testUser[0].tokens[0].token)
                    .expect(200)
                    .expect((result) => {
                        expect(result.body.length).toBe(1);
                    }).end(done);
            });
    });
    it('test should get id and return Note', (done) => {
        var note = testNote[0].note;
        var age = testNote[0].age;
        var tell = testNote[0].tell;
        request(app)
            .post('/')
            .set('jarvis-auth', testUser[0].tokens[0].token)
            .send({ note, age, tell })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                request(app)
                    .post('/find')
                    .set('jarvis-auth', testUser[0].tokens[0].token)
                    .send({ id: res.body._id })
                    .expect(200)
                    .expect((result) => {
                        if (err) {
                            return done(e);
                        }
                        expect(result.body._id).toBe(res.body._id);
                    })
                    .end(done);
            });

    });
    it('test should get id and NOT return Note', (done) => {
        request(app)
            .post('/find')
            .send({ id: testNote[0]._id })
            .expect(401)
            .end(done);
    });
});

describe('Delete / todos', () => {
    it('test should delete remove note', (done) => {
        var note = testNote[0].note;
        var age = testNote[0].age;
        var tell = testNote[0].tell;

        request(app)
            .post('/')
            .send({ note, age, tell })
            .set('jarvis-auth', testUser[0].tokens[0].token)
            .expect(200)
            .end((error, result) => {
                if (error) {
                    return done(error);
                }
                request(app)
                    .delete('/deleteByID/' + result.body._id)
                    .set('jarvis-auth', testUser[0].tokens[0].token)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.deletedCount).toBeTruthy();
                        expect(res.body.deletedCount).toBe(1);
                    })
                    .end(done);
            });
    });

    it('test should not remove note', (done) => {
        request(app)
            .delete('/deleteByID/123')
            .set('jarvis-auth', testUser[0].tokens[0].token)
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

    // it('test should not add a user and err 401', (done) => {
    //     request(app)
    //         .post('/user') 
    //         .expect(500)
    //         .end(done);
    // });

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
                    return done(err);
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

describe('Delete /user/me/token', () => {
    it('test should remove token and logout user.', (done) => {
        request(app)
            .delete('/user/me/token')
            .set('jarvis-auth', testUser[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.User.findById(testUser[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
    it('test should not send token and do not remove any token', (done) => {
        request(app)
            .delete('/user/me/token')
            .set('jarvis-auth', "")
            .expect(401)
            .end(done);
    });
});