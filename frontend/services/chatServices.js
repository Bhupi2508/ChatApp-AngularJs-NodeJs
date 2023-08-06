/******************************************************************************
 *  @File : chatService.js
 *  @Overview : This is the main JavaScript file for the chat application.
 *  @Author : Bhupendra Singh
 ******************************************************************************/

app.service('chatServices', function ($http) {
    var baseUrl = window.location.origin;

    this.getAllUser = function (usertoken) {
        // Make an HTTP GET request to retrieve all users
        return $http({
            method: 'GET',
            url: baseUrl + '/getAllUser',
            headers: {
                'token': usertoken,
            }
        }).then(function (response) {
            console.log("getAllUser =>>>> All users data : ", response.data.result);

            // Return the array of user data
            return response.data.result;
        }).catch(function (error) {
            console.log("Error occurred while getting users ::::::: ", error);

            // Return false if an error occurs
            return response.data.result = false;
        });
    };


    this.userMsg = function () {
        var arr = [];
        var usertoken = localStorage.getItem('token');

        // Make an HTTP GET request to the specified URL with the user token in the headers
        return $http({
            method: 'GET',
            url: baseUrl + '/userMsg',
            headers: {
                'token': usertoken,
            }
        }).then(function (response) {
            console.log("userMsg =>>>> Response data :::::: ", response);

            // If there are no messages, return an empty array
            if (response.data.result.length === 0) {
                return response.data.result = [];
            }

            let lastAaaaValue = null;
            for (let i = 0; i < response.data.result.length; i++) {
                var a = response.data.result[i];
            }

            // Check if the current message involves the user
            // if (
            //     (localStorage.getItem('userid') == a.senderId && localStorage.getItem('ruserId') == a.receiverId) ||
            //     (localStorage.getItem('userid') == a.receiverId && localStorage.getItem('ruserId') == a.senderId)
            // ) {
            // arr.push(a);
            // }

            // Check if the current message is not sent by the user and update lastAaaaValue
            if (localStorage.getItem('userid') !== a._id) {
                lastAaaaValue = a;
            }

            // Check if rusername is null and update it
            if (localStorage.getItem('rusername') === null) {
                console.log("localStorage rusername was empty");
                localStorage.setItem('rusername', lastAaaaValue.receiverName);
            }

            // Check if ruserId is null and update it
            if (localStorage.getItem('ruserId') === null) {
                console.log("localStorage ruserId was empty");
                localStorage.setItem('ruserId', lastAaaaValue.receiverId);
            }

            // Return the array of messages
            return response.data.result;
        }).catch(function (error) {
            console.log("Error occurred while getting messages ::::::: ", error);

            // Return false if an error occurs
            return response.data.result = false;
        });
    };


    // Typeahead Search for Users
    this.searchUser = function (searchText) {
        // Retrieve the user token from local storage
        var usertoken = localStorage.getItem('token');

        // Make an HTTP POST request to search for users
        return $http({
            method: 'POST',
            url: baseUrl + '/searchUser',
            data: { searchName: searchText },
            headers: {
                'token': usertoken,
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            console.log("searchUser =>>>> Response ::::::: ", response);

            // Return the search results
            return response.data;
        }).catch(function (error) {
            console.log("Error occurred while searching users ::::::: ", error);
            return [];
        });
    };

});
