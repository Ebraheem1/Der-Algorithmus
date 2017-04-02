var express = require('express');
var router = express.Router();

var reviewController=require('./controllers/reviewController');
var activityController=require('./controllers/activityController');


router.post('/review/newReview', reviewController.newReview);
router.put('/review/editReview/:id', reviewController.editReview);
router.delete('/review/deleteReview/:id', reviewController.deleteReview);


router.post('/activity/newActivity', activityController.newActivity);
router.put('/activity/editActivity/:id', activityController.editActivity);


module.exports = router;