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

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected'); // This method fires if it connects

    // listen for requests only if database connection is successful
    app.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err); // Catches error if there is one
  });



// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use('/api/reviews', reviewRoutes)


// Serve static files (optional)
app.use(express.static(path.join(__dirname, 'client')));


