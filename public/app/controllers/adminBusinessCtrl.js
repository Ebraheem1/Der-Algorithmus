angular.module('adminBusinessController', ['adminServices', 'authServices', 'pagingServices'])

    .controller('adminBusinessCtrl', function ($http, Admin, Authentication, Pager, $scope, $routeParams) {

        var app = this;

        $scope.business = {};


        Admin.getBusiness().then(function (data) {

            app.message = data.data.message;
            app.success = data.data.success;
            console.log(data.data.business);

            if (data.data.success) {

                $scope.business = data.data.business;

                //start of pagination logic for controller
                app.Items = $scope.business; //array of items to be paged
                app.pager = {};

                app.setPage = function (page) {

                    if (page < 1 || page > app.pager.totalPages) {

                        return;

                    }
                    // get pager object from service
                    app.pager = Pager.getPager(app.Items.length, page);
                    // get current page of items
                    app.items = app.Items.slice(app.pager.startIndex, app.pager.endIndex + 1);

                };
                // initialize to page 1
                app.setPage(1);
                //end of pagination logic for controller			

            } else {

                console.log(app.message);

            }



        });

        app.deleteBusiness = function (businessId) {

            Admin.deleteBusiness(businessId).then(function (data1) {
                app.deleteSuccess = data1.success;
                app.deleteMessage = data1.message;

                Admin.getBusiness().then(function (data2) {
                    $scope.business = data2.data.business;
                    app.message = data2.data.message;
                    app.success = data2.data.success;
                    console.log(data2.data.business);
                });
            });

        };



    });