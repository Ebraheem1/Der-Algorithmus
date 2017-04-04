var express = require('express');
var router = express.Router();
var businessownerController = require('./controllers/businessownerController');
var reviewController = require('./controllers/reviewController');
var userController = require('./controllers/userController');

router.post('/gallery', businessownerController.addMedia);
router.post('/offer', businessownerController.addOffer);
router.get('/showReview', businessownerController.showReview);
router.post('/reply', businessownerController.reply);
module.exports = router;