/******************************************************************************
 *  @File : ForgotPassword_Controller.js
 *  @Overview : This is the main JavaScript file for the chat application.
 *  @Author : Bhupendra Singh
 ******************************************************************************/

app.controller('controlAccount', function ($scope, accountServices) {

    try {
        $scope.getAllUser = function () {
            // Call the fetchAccount function from accountServices
            accountServices.fetchAccount(token).then(function (data) {
                console.log("Account fetched successfully ::::::: ", data);

                // If needed, handle the fetched account data (users) here

            }).catch(function (error) {
                console.log("Error occurred during fetching accounts :::: ", error);
            });
        };
    } catch (err) {
        console.log("Error getting all users :::::: ", err);
    }
});
