/******************************************************************************
 *  @File : ServiceSignUp.js
 *  @Overview : This is the main JavaScript file for the chat application.
 *  @Author : Bhupendra Singh
 ******************************************************************************/

app.service('serviceSignUp', function ($http, $location) {
    var baseUrl = window.location.origin;
    console.log("baseUrl :: ", baseUrl);

    this.signUpUser = function (data, $scope) {
        console.log("data on service register--- ", data);

        $http({
            method: 'POST',
            url: baseUrl + '/signup',
            data: data
        }).then(
            function successCallback(response) {
                console.log("Register successful");
                console.log(response);
                $scope.message = "Register successful";

                $location.path('/login');
            },
            function errorCallback(response) {
                console.log("Register unsuccessful");
                $scope.message = response.data.message.message;
            }
        );
    }
});