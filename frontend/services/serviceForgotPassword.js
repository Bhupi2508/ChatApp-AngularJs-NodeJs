/******************************************************************************
 *  @File : ServiceForgotPassword.js
 *  @Overview : This is the main JavaScript file for the chat application.
 *  @Author : Bhupendra Singh
 ******************************************************************************/

app.service('serviceForgotPassword', function ($http, $location) {
    var baseUrl = window.location.origin;
    console.log("baseUrl :: ", baseUrl);

    this.forgotPassword = function (data, $scope) {
        // Make an HTTP POST request to initiate the forgot password process
        $http({
            method: 'POST',
            url: baseUrl + '/forgotPassword',
            data: data,
        }).then(
            // Success callback
            function successCallback(response) {
                console.log("Forgot password successful");
                var userid = response.data.message[0]._id;
                var name = response.data.message[0].firstname;
                var token = response.data.token;

                // Store user information in local storage
                localStorage.setItem("userid", userid);
                localStorage.setItem("name", name);
                localStorage.setItem("token", token);

                $scope.loginMessage = "Login successful";
            },
            // Error callback
            function errorCallback(response) {
                console.log("Forgot password unsuccessful");
                console.log(response);
                $scope.loginMessage = 'Incorrect Email ID';
            }
        );
    }
});
