/******************************************************************************
 *  @File : ServiceSignUp.js
 *  @Overview : This is the main JavaScript file for the chat application.
 *  @Author : Bhupendra Singh
 ******************************************************************************/

app.service('serviceSignUp', function ($http, $location) {
    var baseUrl = window.location.origin;
    console.log("baseUrl :: ", baseUrl);

    this.signUpUser = function (data, $scope) {
        console.log("data on service register --- ", data);

        // Make an HTTP POST request to sign up a new user
        $http({
            method: 'POST',
            url: baseUrl + '/signup',
            data: data
        }).then(
            // Success callback
            function successCallback(response) {
                console.log("Register successful");
                console.log(response);

                // Update the message in the provided $scope
                $scope.message = "Register successful";

                // Redirect to the login page using $location
                $location.path('/login');
            },
            // Error callback
            function errorCallback(response) {
                console.log("Register unsuccessful");

                // Update the message in the provided $scope with the error message from the response
                $scope.message = response.data.message.message;
            }
        );
    }
});
