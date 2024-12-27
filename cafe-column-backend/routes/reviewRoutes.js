const express = require('express');
const Review = require('../models/reviewModel');
//create router
const router = express.Router();
//imports functions from reviewControllers used in the api endpoints
const{addReview, getReviews} = require('../controllers/reviewController')


//API ENDPOINTS

//GETS request object and sends response object
router.get('/', getReviews)

// POST route to handle reviews
router.post('/', addReview)

//exports router object so that it is available to other files to import using require 
module.exports = router;
