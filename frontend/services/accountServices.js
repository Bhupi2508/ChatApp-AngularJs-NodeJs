/******************************************************************************
 *  @File : accountServices.js
 *  @Overview : This is the main JavaScript file for the chat application.
 *  @Author : Bhupendra Singh
 ******************************************************************************/

app.service('accountServices', function ($http, $location) {
    var baseUrl = window.location.origin;
    console.log("baseUrl :: ", baseUrl);

    this.fetchAccount = function (data, $scope, usertoken) {
        // Make an HTTP GET request to fetch the account profile
        $http({
            method: 'GET',
            url: baseUrl + '/fetchAccount',
            headers: {
                'token': usertoken,
            }
        }).then(
            // Success callback
            function successCallback(response) {
                console.log("Account successfully fetched");
                // Handle the fetched account data if needed
            },
            // Error callback
            function errorCallback(response) {
                console.log("Account fetch unsuccessful");
                console.log(response);
                $scope.loginMessage = 'Incorrect Email ID';
            }
        );
    }
});
