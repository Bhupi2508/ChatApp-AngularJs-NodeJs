/******************************************************************************
@File : app.js
@Overview : This is the main JavaScript file for the chat application.
@Author : Bhupendra Singh
******************************************************************************/

var app = angular.module("chatapp", ['ui.router', 'btford.socket-io']);

app.config(function ($stateProvider, $urlRouterProvider) {

    // Define the states and their corresponding templates and controllers

    /*
    Call the login HTML file and assign the controller
    */
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'templet/LoginForm.html',
        controller: "controlLogin"
    });

    /*
    Call the signup HTML file and assign the controller
    */
    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'templet/SignUp.html',
        controller: 'controlSignup'
    });

    /*
    Call the forgot password HTML file and assign the controller
    */
    $stateProvider.state('forgotPassword', {
        url: '/forgotPassword',
        templateUrl: 'templet/ForgotPassword.html',
        controller: 'controlForgotPassword'
    });

    /*
    Call the reset password HTML file and assign the controller
    */
    $stateProvider.state('resetPassword', {
        url: '/resetPassword/:token',
        templateUrl: 'templet/ResetPassword.html',
        controller: 'controlResetPassword'
    });

    /*
    Call the Homepage HTML file and assign the controller
    */
    $stateProvider.state('homePage', {
        url: '/homePage',
        templateUrl: 'templet/HomePage.html',
        controller: 'chatController'
    });

    /*
    Set the default login state
    */
    $urlRouterProvider.otherwise('login');
});

/*
Connect to the server using socket.io
*/
app.service('SocketService', ['socketFactory', function SocketService(socketFactory) {
    var currentHost = window.location.host;
    var socketUrl = 'http://' + currentHost;
    
    return socketFactory({
        ioSocket: io.connect(socketUrl)
    });
}]);