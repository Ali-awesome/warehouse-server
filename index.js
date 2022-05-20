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

        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        });
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await itemCollection.findOne(query);
            res.send(result);
        });
        app.post('/myItems', async (req, res) => {
            const myItems = req.body;
            const result = await itemCollection.insertOne(myItems);
            res.send(result);
        });
        app.get('/myItems', async (req, res) => {
            const email = req.query.email;
            const query = { supplierEmail: email };
            const cursor = itemCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.put("/inventory/:id", async (req, res) => {
            console.log('url hitted')
            const id = req.params.id;
            const updateProduct = req.body;
            const query = { _id: ObjectId(id) };
            const updated = await itemCollection.updateOne(
                query,
                { $set: updateProduct },
                { upsert: true }
            );
            const cursor = await itemCollection.findOne(query);
            res.send(cursor);
        });
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemCollection.deleteOne(query);
            res.send(result);
        })
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