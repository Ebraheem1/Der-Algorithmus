var express = require('express');
var router = express.Router();
var businessownerController = require('./controllers/businessownerController');
var userController = require('./controllers/userController');

router.post('/gallery', businessownerController.addPicture);
router.post('/create', userController.create);
router.post('/createBusiness', businessownerController.createBusiness);
router.post('/offer', businessownerController.addOffer);
module.exports = router;