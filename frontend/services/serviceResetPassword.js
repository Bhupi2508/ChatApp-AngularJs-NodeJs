/******************************************************************************
 *  @File : ServiceResetPassword.js
 *  @Overview : This is the main JavaScript file for the chat application.
 *  @Author : Bhupendra Singh
 ******************************************************************************/

app.service('serviceResetPassword', function ($http, $location) {
    var baseUrl = window.location.origin;
    console.log("baseUrl :: ", baseUrl);

    this.resetPasswordUser = function (data, $scope) {
        console.log("data on service register--- ", data);

        $http({
            method: 'POST',
            url: baseUrl + '/resetPassword',
            data: data
        }).then(
            function successCallback(response) {
                console.log("Reset password successful");
                console.log(response);
                $scope.message = "Reset password successful";

                $location.path('/login');
            },
            function errorCallback(response) {
                console.log("Reset password unsuccessful");
                $scope.message = response.data.message.message;
            }
        );
    }
});