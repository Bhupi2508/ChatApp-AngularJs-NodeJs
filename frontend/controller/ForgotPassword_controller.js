/******************************************************************************
 *  @File : ForgotPassword_Controller.js
 *  @Overview : This is the main JavaScript file for the chat application.
 *  @Author : Bhupendra Singh
 ******************************************************************************/

app.controller('controlForgotPassword', function ($scope, serviceForgotPassword) {

    $scope.forgotPassword = function () {
        var data = {
            'email': $scope.email,
        };

        var baseUrl = window.location.origin;
        
        $scope.go = function (path) { };
        serviceForgotPassword.forgotPassword(data, $scope, baseUrl);
    };
});