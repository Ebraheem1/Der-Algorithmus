var bcrypt = require('bcryptjs');

let Administrator = require('../models/Administrator');
let BusinessOwner= require('../models/BusinessOwner');


let administratorController={

	viewBusinesses:function(req,res){

		BusinessOwner.find( {}, function(err,BusinessesArray){

			if(err) throw err;

			// should be replaced with page rendering in sprint 2
			res.json(BusinessesArray);

		});
	},

	removeBusiness: function(req,res){

		BusinessOwner.findByIdAndRemove( req.params.businessId, function(err){

			if(err) throw err;

			// should be replaced with page rendering in sprint 2
			res.end('Business removed successfully !');

		});
	}


};

module.exports = administratorController;