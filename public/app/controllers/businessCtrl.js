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
	$scope.file = {};
	$scope.successMsg = false ;
    $scope.errMsg = false ;

	$scope.addOffer = function(offerData){
		
	

		fileUpload.upload($scope.file).then(function(data) {
        if (data.data.success) {
            //$scope.file = {};
            var imageData = {};
            imageData.image = 'gallery/'+data.data.name;
            
		BusinessOwner.addOffer({offer : $scope.offerData.offer ,exp_date: $scope.offerData.exp_date , discount:offerData.discount, image:imageData.image}).then(function(data){
			
			if(data.data.success){
				$scope.errMsg = false ;
				$scope.successMsg = data.data.message;
		          
				$scope.offerData= null;
				imageData = {};
				$scope.file={};

				}
			else{
                 $scope.successMsg = false ;
                 $scope.errMsg = data.data.message;
			}
		});
	}
	else {
            $scope.uploading = false;
            $scope.successMsg = false ;
            $scope.errMsg = data.data.message;
            $scope.file = {};
        }

});

	};

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
					$scope.successMsg = false ;
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