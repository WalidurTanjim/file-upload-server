const express = require('express');
const cors = require('cors');
const cloudinary = require('./cloudinary/cloudinary');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv').config();
const port = 5000 || process.env.PORT;

// middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a1a1zbo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const usersCollection = client.db('FileUpload').collection('users');

    app.get('/user', async(req, res) => {
        const result = await usersCollection.find().toArray();
        res.send(result);
    })

    app.post('/user', async(req, res) => {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Welcome to the File Upload server');
});

app.post('/', async(req, res) => {
    const { image } = req.body;
    cloudinary.uploader
        .upload(image, {
            upload_preset: "images_preset",
            allowed_formats: ['png', 'jpg', 'jpeg', 'svg', 'ico', 'jfif', 'webp']
        })
        .then(result => {
            console.log(result);
            res.status(200).send(result);
        })
});

app.listen(port, () => {
    console.log('File Upload server is running...');
});