//Dependencies

var express = require('express');
var router = express.Router();
var appController = require('./controllers/applicationController');
var userController = require('./controllers/userController');
//Routes

router.post('/application/:username/reject',appController.reject);
router.post('/application/:username/accept',appController.accept);
router.post('/user/forgotPassword',userController.forgotPassword);

//Export
module.exports = router;
