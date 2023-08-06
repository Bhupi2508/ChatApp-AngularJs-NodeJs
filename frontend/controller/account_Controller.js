/******************************************************************************
 *  @File : ForgotPassword_Controller.js
 *  @Overview : This is the main JavaScript file for the chat application.
 *  @Author : Bhupendra Singh
 ******************************************************************************/

app.controller('controlAccount', function ($scope, accountServices, $stateParams) {
    $scope.user = $stateParams.accountData; // Access the result object

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


    try {
        $scope.updateAccount = function (updateData) {
            // Call the updateAccount function from accountServices
            accountServices.updateAccount(updateData, token).then(function (response) {
                console.log("Account updated successfully ::::::: ", response);

                // If needed, handle the updated account data or any success actions here

            }).catch(function (error) {
                console.log("Error occurred during account update :::: ", error);
                // Handle the error condition, e.g., display a message to the user
                $scope.updateMessage = 'Account update failed';
            });
        };
    } catch (err) {
        console.log("Error updating account :::::: ", err);
    }

    $scope.saveChanges = function () {
        // Implement save changes logic here
    };

    $scope.cancelChanges = function () {
        // Implement cancel changes logic here
    };

});

// Define the filter in your account_Controller.js or a separate file
app.filter('formatDate', function () {
    return function (input) {
        // Implement your date formatting logic here
        // For example: return moment(input).format('YYYY-MM-DD');
        return input;
    };
});
