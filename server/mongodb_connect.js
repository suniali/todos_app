require('dotenv/config');
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable connect to MongoDB Server : ' + err);
    }
    console.log("Connected to MongoDB server success!");

    ////////////////////////////////////////////////////////////insert one///////////////////////////////////////////////////////////////////
    // client.db("Todos").collection("Todo").insertOne({
    //     note: "This is my first note in MongoDB",
    //     name: "Ali"
    // }, (err, result) => {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     console.log(result.ops);
    // });
    ////////////////////////////////////////////////////////////find/////////////////////////////////////////////////////////////////////////
    // client.db('Todos').collection('Todo').find({ name: /ali?/i }).toArray().then((err, docs) => {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     console.log(JSON.stringify(docs, undefined, 2));
    // });
    ////////////////////////////////////////////////////////////Delete Many/////////////////////////////////////////////////////////////////////////
    // client.db('Todos').collection('Todo').deleteMany({ name: 'Ali' }, (err, result) => {
    //     if (err) {
    //         return console.log("Unable to delete : ", err);
    //     }
    //     console.log("Deleted Count : ",result.deletedCount);
    // });
    ////////////////////////////////////////////////////////////Delete one/////////////////////////////////////////////////////////////////////////
    // client.db("Todos").collection("Todo").deleteOne({ name: /Ali/i }, (err, result) => {
    //     if (err) {
    //         return console.log("Unable to delete : ", err);
    //     }
    //     console.log("Deleted Count : ", result.deletedCount);
    // });
    ////////////////////////////////////////////////////////////Find one and Delete/////////////////////////////////////////////////////////////////////////
    // client.db('Todos').collection('Todo').findOneAndDelete({ name: /Ali/i }, (err, result) => {
    //     if (err) { return console.log("Unable to delete : ", err); }
    //     console.log("Deleted Proccess : ", result);
    // });

    ///////////////////////////////////////////////////////////////Find one and Update/////////////////////////////////////////////////////////////////////////////
    // client.db('Todos').collection('Todo').findOneAndUpdate({ _id: new ObjectID('5cf7dec469b7164c28d4be14') }, { $set: { pr: 'Amin' } }, (err, result) => {
    //     if (err) { return console.log("Unable Update note : ", err); }
    //     console.log("Modified Proccess : ", result);
    // });
    ///////////////////////////////////////////////////////////////Find one and Update/////////////////////////////////////////////////////////////////////////////
    // client.db('Todos').collection('Todo').updateOne({ pr: "Ali Matroki" }, { $set: { pr: 'Amin' } }, (err, result) => {
    //     if (err) {
    //         return console.log("Unable update note : ", err);
    //     }
    //     console.log('Modified Count is : ', result.modifiedCount);
    // });


    client.close();
});