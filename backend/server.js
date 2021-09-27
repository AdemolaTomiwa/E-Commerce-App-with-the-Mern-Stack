const express = require('express');
const mongoose = require('mongoose');
// const config = require('config');

const productRoute = require('./routes/api/products');
const uploadRoute = require('./routes/api/upload');

const app = express();

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Db Config
// const db = config.get('mongoURI');

// Mongo Connect
mongoose
   .connect(
      'mongodb+srv://tomiwa:tomiwa12345@cluster0.xwfyb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
   )
   .then(() => console.log('Mongo DB Connected...'))
   .catch((err) => console.log('Not Connected...'));

// Routes
app.use('/api/products', productRoute);
app.use('/api/upload', uploadRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server Stated...'));
