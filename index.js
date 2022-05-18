
//importing
const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
//port 
const port = process.env.PORT || 4000;
//middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.deqka.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    // perform actions on the collection object
    console.log('Mongo DB connected')
});

const run = async () => {
    const taskCollection = client.db("toddlu").collection("tasks");
    //get,post
    app.get('/tasks/:email')
}
run();

app.use(cors());

app.get('/', (req, res) => {
    res.send('The server is running');
})
app.listen(port, () => {
    console.log('Listening to the port', port);
})