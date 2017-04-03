let User = require('../models/User');
let BusinessOwner= require('../models/BusinessOwner');
let Activity = require('../models/Activity');
var bcrypt = require('bcryptjs');

let userController={

//Write here the functions in the format of function_name:function(params)
search:function(req,res)
{
	var keyword = req.params.keyword;
	var flag=0;
	var list=[];
	BusinessOwner.find({$or:[{name:new RegExp(".*"+keyword+".*")},{description:new RegExp(".*"+keyword+".*")}]},function(err,businesses)
	{
		if(businesses.length > 0)
		{
			
			for(var i =0 ; i < businesses.length  ; i++)
			{
				flag  = 0 ;
				for(var j =0; j < list.length && (!flag); j++)
				{
					if(list[j] == businesses[i])
					{
						flag = 1;
					}
				}
				if(!flag)
				{
					list.push(businesses[i]);
				}
			}
		}
		Activity.find({type: new RegExp(".*"+keyword+".*")},function(err,activities)
		{
			for(var i = 0 ; i< activities.length ; i++)
			{
				flag = 0;
				BusinessOwner.findById(activities[i].BusinessOwner_id, function(error,business)
					{
						if(business)
						{
							for(var j = 0; j < list.length && (!flag) ; j++)
							{
								if(list[j] == business)
								{
									flag = 1;
								}
							}
							if(!flag)
							{
								list.push(business);
							}

						}
					});
			}
		});

	});
	//Here we render to the view + the list variable

}

};

module.exports = userController;