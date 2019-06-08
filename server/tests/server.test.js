const expect = require('expect');
const request = require('supertest');

const { app } = require('../mongoose_connect');
const todo = require('../model/todo');

const testNote = [{
    note: 'First Note For My Best Friend Amin.',
    age: 37,
    tell: '12345678910'
}, {
    note: 'Second Note For My Best Friend Amin.',
    age: 22,
    tell: '12345678910'
}];

beforeEach((done) => {
    todo.remove({}).then(() =>
        todo.insertMany(testNote).then(() => done())
    ).catch((e) => done(e));
});

describe('Post / Todos', () => {
    it('test create New Todo', (done) => {
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
                todo.find({ note }).then((res) => {
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
                todo.find().then((res) => {
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
                expect(res.body).toMatchObject(testNote);
            }).end(done);
    });
});