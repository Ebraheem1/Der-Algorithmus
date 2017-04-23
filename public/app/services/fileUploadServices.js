// a service for uploading a file, and calling the backend route responsible for uploading
angular.module('fileUploadService', [])


.service('fileUpload', function($http){

	this.upload = function(file){
		var fd = new FormData();

		fd.append('myfile', file.upload);


		return $http.post('/api/upload', fd, {

			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		});
	};
	
});
