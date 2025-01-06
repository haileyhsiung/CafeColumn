const express = require('express');
const mongoose = require('mongoose'); //import mongoose to connect to database
const cors = require('cors');
//express app 
const app = express();
const path = require('path');
const reviewRoutes = require('./routes/reviewRoutes')
// Start the server
const PORT = process.env.PORT || 5001;

// Environment variable configurations
require('dotenv').config();

// use mongoose to connect to database 
const MONGO_URI = process.env.MONGO_URI;

// Connect node.js to MongoDB using mongoose library 
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected'); // This shows up in terminal if connected 

    // listen for requests only if database connection is successful
    app.listen(PORT, () => { // creates a server and uses http.createServer() under the hood using express
      console.log(`Listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err); // Catches error if it doesnt connect 
  });



// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use('/api/reviews', reviewRoutes)


// Serve static files (optional)
app.use(express.static(path.join(__dirname, 'client')));


