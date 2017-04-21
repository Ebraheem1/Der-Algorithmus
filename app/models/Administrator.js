var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var administratorSchema = mongoose.Schema({
    password:String,
});


var Administrator = mongoose.model("Administrator", administratorSchema);

module.exports = Administrator;