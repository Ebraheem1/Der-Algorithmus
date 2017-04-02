var express = require('express');
var router = express.Router();

var businessownerController=require('./controllers/businessownerController');
var administratorController=require('./controllers/administratorController');


router.post('/addActivity',businessownerController.addActivity);
router.get('/deleteActivity/:activityId',businessownerController.deleteActivity);

router.get('/viewBusinesses',administratorController.viewBusinesses);
router.get('/removeBusiness/:businessId',administratorController.removeBusiness);







module.exports = router;