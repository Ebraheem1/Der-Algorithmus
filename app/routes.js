var express = require('express');
var router = express.Router();

var reviewController = require('./controllers/reviewController');
var clientController = require('./controllers/clientController');

router.get('/review/view', reviewController.viewBusinessReviews );

router.get('/business/rate', clientController.rateBusiness );

module.exports = router;