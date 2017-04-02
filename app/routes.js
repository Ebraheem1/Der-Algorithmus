var express = require('express');
var router = express.Router();
var clientController = require('./controllers/clientController');
var userController = require('./controllers/userController');


router.get('/register',userController.register);
router.post('/register',userController.createUser);

router.get('/view_summary',clientController.view_summary);

router.get('/update_Info',clientController.get_update_Info);
router.post('/update_Info',clientController.update_Info);

router.get('/BusinessOwner/:id', clientController.view_Business);


module.exports = router;
