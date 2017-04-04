var express = require('express');
var router = express.Router();
var clientController = require('./controllers/clientController');
var userController = require('./controllers/userController');


router.post('/register',userController.createUser);

router.get('/view-summary',clientController.viewSummaries);

router.post('/update-Info',clientController.updateInfo);

router.get('/businessOwner/:id', clientController.viewBusiness);

router.post('/change-username',userController.changeUsername);

module.exports = router;
