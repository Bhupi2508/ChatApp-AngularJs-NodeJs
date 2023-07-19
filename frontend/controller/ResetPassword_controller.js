/******************************************************************************
 *  @File : ResetPassword_Controller.js
 *  @Overview : This is the main JavaScript file for the chat application.
 *  @Author : Bhupendra Singh
 ******************************************************************************/

app.controller('controlResetPassword', function ($scope, serviceResetPassword) {

    $scope.resetPassword = function () {
        var user = {
            'Password': $scope.password,
        };

        var baseUrl = window.location.origin;

        // wil update this later
        if ($scope.password != $scope.password) {
            $scope.message = "Passwords do not match";
        } else {
            serviceResetPassword.resetPasswordUser(user, $scope, baseUrl);
        }
    };
});