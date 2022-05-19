const express = require('express');
require('dotenv').config();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.flfcx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const itemCollection = client.db('dbFurniture').collection('items');
        const myItemCollection = client.db('dbMyItems').collection('MyItems');

        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        });
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await itemCollection.findOne(query);
            res.send(result);
        });
        app.post('/myItems', async (req, res) => {
            const myItems = req.body;
            const result = await myItemCollection.insertOne(myItems);
            res.send(result);
        });
        app.get('/myItems', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = myItemCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });
    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('app is running')
})

app.listen(port, () => {
    console.log('listsenning', port)
})