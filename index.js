
//importing
const express = require('express');
const app = express();
const cors = require('cors');
var jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
//port 
const port = process.env.PORT || 4000;
const access_token = process.env.ACCESS_TOKEN;
//middleware
app.use(express.json());
app.use(cors());
const verifyJWT = (req, res, next) => {
    const token = req.headers?.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: 'Unauthorized Access' })
    }
    jwt.verify(token, access_token, function (error, decoded) {

        if (error) {

            return res.status(403).send({ message: 'Frobidden Access' })
        }

        req.decoded = decoded;
        next();
    })
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.deqka.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    // perform actions on the collection object
    console.log('Mongo DB connected')
});

const run = async () => {
    const taskCollection = client.db("toddlu").collection("tasks");
    //get
    app.get('/tasks', async (req, res) => {
        const email = req.query.email;
        const query = { email: email };
        const find = await taskCollection.find(query).toArray();
        res.send(find);
    })
    //post
    app.post('/tasks', verifyJWT, async (req, res) => {
        const body = req.body;
        const task = {
            status: `${body.status}`,
            email: `${body.email}`,
            name: `${body.name}`,
            desc: `${body.desc}`,
        };
        const result = await taskCollection.insertOne(task);
        res.send(result);
    })
    //put
    app.put('/tasks/:id', verifyJWT, async (req, res) => {
        const id = req.params.id;
        const filter = {
            _id: ObjectId(id)
        }
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                status: `${req.body.status}`
            },
        };
        const result = await taskCollection.updateOne(filter, updateDoc, options);
        res.send(result);
    })


    //delete
    app.delete('/tasks/:id', verifyJWT, async (req, res) => {
        const id = req.params.id;
        const query = {
            _id: ObjectId(id)
        }
        const result = await taskCollection.deleteOne(query);
        res.send(result);

    })
    //app.sign intoken
    app.put('/signIn/:email', verifyJWT, async (req, res) => {
        const email = req.params.email;
        console.log(email)
        const token = jwt.sign({ email: email }, access_token, { expiresIn: '1d' });
        res.send({ token: token });
    })

}
run();

app.use(cors());

app.get('/', (req, res) => {
    res.send('The server is running');
})
app.listen(port, () => {
    console.log('Listening to the port', port);
})