/******************************************************************************
 *  @File : Login_Controller.js
 *  @Overview : This is the main JavaScript file for the chat application.
 *  @Author : Bhupendra Singh
 ******************************************************************************/

app.controller('controlLogin', function ($scope, $location, serviceLogin) {

    $scope.login = function () {
        var data = {
            'email': $scope.email,
            'password': $scope.password
        };

        var baseUrl = window.location.origin;

        serviceLogin.login(data);
    };

    $scope.go = function (path) {
        $location.path("/signup");
    };

    $scope.go2 = function (path) {
        $location.path("/forgotPassword");
    };
});