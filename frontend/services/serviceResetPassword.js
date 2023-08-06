/******************************************************************************
 *  @File : ServiceResetPassword.js
 *  @Overview : This is the main JavaScript file for the chat application.
 *  @Author : Bhupendra Singh
 ******************************************************************************/

app.service('serviceResetPassword', function ($http, $location) {
    var baseUrl = window.location.origin;
    console.log("baseUrl :: ", baseUrl);

    this.resetPasswordUser = function (data, $scope) {
        console.log("data on service register --- ", data);

        // Make an HTTP POST request to reset the user's password
        $http({
            method: 'POST',
            url: baseUrl + '/resetPassword',
            data: data
        }).then(
            // Success callback
            function successCallback(response) {
                console.log("Reset password successful");
                console.log(response);

                // Update the message in the provided $scope
                $scope.message = "Reset password successful";

                // Redirect to the login page using $location
                $location.path('/login');
            },
            // Error callback
            function errorCallback(response) {
                console.log("Reset password unsuccessful");

                // Update the message in the provided $scope with the error message from the response
                $scope.message = response.data.message.message;
            }
        );
    }
});
