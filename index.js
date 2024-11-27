const express = require('express');
const cors = require('cors');
const cloudinary = require('./cloudinary/cloudinary');
const app = express();
require('dotenv').config();
const port = 5000 || process.env.PORT;

// middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

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