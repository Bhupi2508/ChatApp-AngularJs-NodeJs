/******************************************************************************
 *  @File : ServiceForgotPassword.js
 *  @Overview : This is the main JavaScript file for the chat application.
 *  @Author : Bhupendra Singh
 ******************************************************************************/

app.service('serviceForgotPassword', function ($http, $location) {
    var baseUrl = window.location.origin;
    console.log("baseUrl :: ", baseUrl);

    this.forgotPassword = function (data, $scope) {
        $http({
            method: 'POST',
            url: baseUrl + '/forgotPassword',
            data: data,
        }).then(
            function successCallback(response) {
                console.log("Forgot password successful");
                var userid = response.data.message[0]._id;
                var name = response.data.message[0].firstname;
                var token = response.data.token;
                localStorage.setItem("userid", userid);
                localStorage.setItem("name", name);
                localStorage.setItem("token", token);

                $scope.loginMessage = "Login successful";
            },
            function errorCallback(response) {
                console.log("Forgot password unsuccessful");
                console.log(response);
                $scope.loginMessage = 'Incorrect Email ID';
            }
        );
    }
});