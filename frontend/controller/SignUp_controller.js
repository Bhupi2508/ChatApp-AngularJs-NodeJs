/******************************************************************************
 *  @File : SignUp_Controller.js
 *  @Overview : This is the main JavaScript file for the chat application.
 *  @Author : Bhupendra Singh
 ******************************************************************************/

app.controller('controlSignup', function ($scope, $location, serviceSignUp) {

    $scope.signup = function () {
        var user = {
            'firstname': $scope.firstname,
            'lastname': $scope.lastname,
            'email': $scope.email,
            'password': $scope.password
        };

        var baseUrl = window.location.origin;

        // will update this later
        if ($scope.password != $scope.password) {
            $scope.message = "Passwords do not match";
        } else {
            serviceSignUp.signUpUser(user, $scope, baseUrl);
        }
    };

    $scope.go = function (path) {
        $location.path(path);
    };
});