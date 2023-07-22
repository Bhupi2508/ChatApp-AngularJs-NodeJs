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
                    if (response.data.message === "Token has expired") {
                        localStorage.clear();
                        // Redirect the user to the login page
                        $window.location.href = '/login';
                    }
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
                    console.log("Response : ", response);
                    console.log("Response data result : ", response.data.result);
                    console.log("Response data result length : ", response.data.result.length);

                    let lastAaaaValue = null;
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
                        if (localStorage.getItem('userid') !== a._id) {
                            lastAaaaValue = a;
                        }
                    }

                    console.log("::::::::::::::: ", lastAaaaValue)
                    if (localStorage.getItem('rusername') === null) {
                        localStorage.setItem('rusername', lastAaaaValue.receiverName);
                    }

                    if (localStorage.getItem('ruserId') === null) {
                        localStorage.setItem('ruserId', lastAaaaValue.receiverId);
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

    try {
        this.searchUser = function ($scope) {
            console.log("::::::::::::::::::::: ", $scope.searchText)
            const searchName = $scope.searchText
            var usertoken = localStorage.getItem('token');
            $http({
                /*
                GET request to fetch user messages
                */
                method: 'POST',
                url: baseUrl + '/searchUser',
                data: { searchName },
                headers: {
                    'token': usertoken,
                    'Content-Type': 'application/json' // Set the Content-Type header for POST requests
                }
            }).then(
                /*
                Success callback function
                */
                function successCallback(response) {
                    console.log("Response:", response);
                    console.log("Response data:", response.data);

                    $scope.searchResults = response.data;
                },
                /*
                Error callback function
                */
                function errorCallback(response) {
                    console.log("Failed to search user");
                    console.log("Error:", response);
                }
            );
        }
    } catch (err) {
        console.log("Error occurred while searching users:", err);
    }

});