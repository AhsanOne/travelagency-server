const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

//Middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xtoot.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db("Travelagency");
        const servicesCollection = database.collection("services");
        const ordersCollection = database.collection("orders");

        //GET API
        app.get('/services', async (req, res) => {
            const cursor = await servicesCollection.find({}).toArray()
            res.send(cursor)
        })

        app.get('/services/:id', async(req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query)
            res.send(service)
        })

        app.get('/manageallorder', async (req, res) => {
            const orders = await ordersCollection.find({}).toArray()
            res.send(orders)
        })

        // POST API
        app.post("/orders", async(req, res) => {
            const order = req.body
            const result = await ordersCollection.insertOne(order)
            res.json(result)
        })

        app.post("/myorder", async (req, res) => {
            const keys = req.body
            const query = {key: {$in: keys}}
            const result = await ordersCollection.find(query).toArray()
            res.json(result)
            console.log(result)
        })

        //UPDATE API
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id
            const updateOrder = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    orderStatus: updateOrder.orderStatus,
                },
            };
            const result = await ordersCollection.updateOne(filter, updateDoc, options);
            console.log('update user id is', id)
            console.log(updateOrder)
            res.json(result)
        })

        // DELETE API
        app.delete('/orders/:Id', async (req, res) => {
            const id = req.params.Id
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query)
            res.json(result)
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log("Running server port number is", port)
})