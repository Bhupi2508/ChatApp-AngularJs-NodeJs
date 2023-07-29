/******************************************************************************
 *  @File : ServiceLogin.js
 *  @Overview : This is the main JavaScript file for the chat application.
 *  @Author : Bhupendra Singh
 ******************************************************************************/

app.service('serviceLogin', function ($http, $state) {
    var baseUrl = window.location.origin;
    console.log("baseUrl :: ", baseUrl);

    this.login = function (data, $scope) {
        $http({
            method: 'POST',
            url: baseUrl + '/login',
            data: data,
        }).then(
            function successCallback(response) {
                console.log("Login successful at serviceLogin in client side ::::: ", response.data);
                var userid = response.data.message._id;
                var name = response.data.message.firstname;
                var token = response.data.token;
                var email = response.data.message.email;
                localStorage.setItem("userid", userid);
                localStorage.setItem("name", name);
                localStorage.setItem("token", token);
                localStorage.setItem("email", email);

                $state.go('homePage');
            },
            function errorCallback(response) {
                console.log("Login unsuccessful. Please check your username or password");
                console.log(response);
                $scope.loginMessage = 'Email ID or Password Incorrect';
            }
        );
    }
});