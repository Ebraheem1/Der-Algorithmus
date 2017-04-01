var express = require('express');
var router = express.Router();
var administratorController = require('./controllers/administratorController');
var applicationController = require('./controllers/applicationController');
var businessOwnerController = require('./controllers/businessownerController');

//routing for viewing applications
router.get('/applications/:page', administratorController.viewApplicationsIndex);
router.get('/applications', administratorController.viewApplications);

//routing for creating application
router.post('/business/apply', applicationController.createApplication);

//routing for updating basic info
router.post('/business/update-info', businessOwnerController.updateInfo);

//routing for locations operations
router.post('/business/locations/add', businessOwnerController.addLocation);

//routing for security
router.post('/security/change-password', businessOwnerController.changePassword);


module.exports = router;

