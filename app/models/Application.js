var mongoose = require('mongoose');


var applicationSchema = mongoose.Schema({
    username:{
        type:String,
        required:true, 
        unique:true
    },
    password:String,
    email:{
    	type:String,
    	unique:true
    },
    phoneNumber: String,
    description:String,
    name:String,
    locations:[String]
});

var Application = mongoose.model("Application", applicationSchema);

module.exports = Application;