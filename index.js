import express from 'express';
import cors from 'cors'
import { ObjectId } from 'bson';
import { MongoClient, ServerApiVersion } from 'mongodb'
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

// user:saad1626
// password:KEb4raTNyzmwqYJG


const uri = "mongodb+srv://saad1626:KEb4raTNyzmwqYJG@cluster0.0hwwt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const userCollection = client.db("foodExpress").collection('user')

        app.get('/user', async (req, res) => {
            const query = {}
            const cursor = userCollection.find(query)
            const users = await cursor.toArray()
            res.send(users)
        })

        app.post('/user', async (req, res) => {
            const newUser = req.body
            const result = await userCollection.insertOne(newUser)
            res.send(result)
        })

        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })

        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.findOne(query)
            res.send(result)
        })

        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                }
            }
            const result = await userCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })

    }
    finally {
        // client.close()
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send("Hello from Node MongoDb")
})

app.listen(port, () => {
    console.log(port);
})