var express = require('express');
var router = express.Router();
var administratorController = require('./controllers/administratorController');

//routing for viewing applications
router.get('/applications/:page', administratorController.viewApplicationsIndex);
router.get('/applications', administratorController.viewApplications);

module.exports = router;

