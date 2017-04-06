    

    updateInfo: function(req, res){

        req.checkBody('name', 'Name Required').notEmpty();
        req.checkBody('email', 'Not a valid email address').isEmail();
        
        var errors = req.validationErrors();


        if(!errors){

            var loginUsername = req.body.username;
            
            var conditions = { username: loginUsername }
            
            , update = { $set: { phoneNumber: req.body.phoneNumber,
                    email: req.body.email } };

            User.update(conditions, update, null, function (err, user){
                    
                if(err){

                    if(err.name == 'MongoError'){
                                
                        req.flash('error_msg', 'error');
                                
                    }

                }else{

                    User.findOne(conditions, function (err, user){

                        conditions = { user_id: user._id };

                        update = { $set: { name: req.body.name,
                        description: req.body.description } };

                        BusinessOwner.update(conditions, update, null, function (err, businessOwner){

                            if(err){

                                res.json(err);

                            }else{

                                res.send('Info updated successfully');

                            }

                        });

                    });                 

                }

            });

        }else{

            res.send(errors);

        }
    },
