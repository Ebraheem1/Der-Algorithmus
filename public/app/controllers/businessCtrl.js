angular.module('businessOwnerController', ['businessOwnerServices','authServices', 'fileUploadService','fileModelDirective'])

.controller('businessCtrl', function(Authentication, AuthenticationToken, $scope, $location,BusinessOwner,fileUpload ){

	var app = this;
	
	
	/*app.addMedia = function(uploadedData){
		
		app.errMsg = false;
		app.successMsg = false ;
		console.log(app.uploadedData);
		BusinessOwner.uploadMedia({fileToUpload :app.uploadedData}).then(function(data){
			if(data.data.success){
				$scope.successMsg = data.data.message;
				app.uploadedData= {};
				}
			else{

				$scope.errMsg = data.data.message;
			}
		});
	};*/
	

	app.addOffer = function(offerData){
		
		app.errMsg = false;
		app.successMsg = false ;
		BusinessOwner.addOffer({offer : app.offerData.offer , image:app.offerData.image}).then(function(data){
			console.log(data.data.message);
			if(data.data.success){

				$scope.successMsg = data.data.message;
		
				app.offerData= {};
				}
			else{

				$scope.errMsg = data.data.message;
			}
		});
	};

	$scope.file = {};
	$scope.successMsg = false ;
    $scope.errMsg = false ;

    $scope.Submit = function() {
    $scope.uploading = true;

    fileUpload.upload($scope.file).then(function(data) {
        if (data.data.success) {
            $scope.file = {};
            var imageData = {};
            imageData.image = 'gallery/'+data.data.name;

            
            BusinessOwner.uploadMedia(imageData).then(function(data){
                if(data.data.success){
                	$scope.errMsg = false ;
					$scope.successMsg = data.data.message;
					$scope.uploading = false;
					
				}
				else{
					$scope.uploading = false;
            		$scope.errMsg = data.data.message;
            		$scope.file = {};
				}
            });
        } else {
            $scope.uploading = false;
            $scope.successMsg = false ;
            $scope.errMsg = data.data.message;
            $scope.file = {};
        }
    });
};

});