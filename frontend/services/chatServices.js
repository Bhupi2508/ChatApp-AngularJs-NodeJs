/******************************************************************************
 *  @File : chatService.js
 *  @Overview : This is the main JavaScript file for the chat application.
 *  @Author : Bhupendra Singh
 ******************************************************************************/

app.service('chatServices', function ($http) {
    try {
        var baseUrl = window.location.origin;
        console.log("baseUrl :: ", baseUrl);

        this.getAllUser = function ($scope, usertoken) {
            $http({
                /*
                GET request to fetch user data
                */
                method: 'GET',
                url: baseUrl + '/getAllUser',
                headers: {
                    'token': usertoken,
                }
            }).then(
                /*
                Success callback function
                */
                function successCallback(response) {
                    console.log("All users data:", response.data.result);
                    $scope.allUser = response.data.result;
                },
                /*
                Error callback function
                */
                function errorCallback(response) {
                    console.log("Failed to fetch user data");
                    console.log("Error:", response);
                }
            );
        }
    } catch (err) {
        console.log("Error occurred while getting users:", err);
    }

    try {
        this.userMsg = function ($scope) {
            var arr = [];
            var usertoken = localStorage.getItem('token');
            $http({
                /*
                GET request to fetch user messages
                */
                method: 'GET',
                url: baseUrl + '/userMsg',
                headers: {
                    'token': usertoken,
                }
            }).then(
                /*
                Success callback function
                */
                function successCallback(response) {
                    console.log("Response:", response);
                    console.log("Response data message:", response.data.message);
                    console.log("Response data:", response.data);
                    console.log("Message:", message);
                    console.log("Response data result:", response.data.result);
                    console.log("Response data result length:", response.data.result.length);

                    for (let i = 0; i < response.data.result.length; i++) {
                        var a = response.data.result[i];

                        if (
                            (localStorage.getItem('userid') == a.senderId && localStorage.getItem('ruserId') == a.receiverId) ||
                            (localStorage.getItem('userid') == a.receiverId && localStorage.getItem('ruserId') == a.senderId)
                        ) {
                            console.log("Local user:", localStorage.getItem('userid'));
                            console.log("A user:", a.senderId);
                            console.log("Local receiver id:", localStorage.getItem('ruserId'));
                            console.log("Receiver id:", a.receiverId);

                            arr.push(a);
                        }
                    }

                    $scope.allUserArr = arr;
                    console.log("User messages retrieved successfully:", arr);
                },
                /*
                Error callback function
                */
                function errorCallback(response) {
                    console.log("Failed to retrieve user messages");
                    console.log("Error:", response);
                }
            );
        }
    } catch (err) {
        console.log("Error occurred while getting messages:", err);
    }

});