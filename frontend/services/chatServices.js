/******************************************************************************
 *  @File : chatService.js
 *  @Overview : This is the main JavaScript file for the chat application.
 *  @Author : Bhupendra Singh
 ******************************************************************************/

app.service('chatServices', function ($http) {
    var baseUrl = window.location.origin;

    this.getAllUser = function (usertoken) {
        return $http({
            method: 'GET',
            url: baseUrl + '/getAllUser',
            headers: {
                'token': usertoken,
            }
        }).then(function (response) {
            console.log("getAllUser =>>>> All users data : ", response.data.result);
            return response.data.result;
        }).catch(function (error) {
            console.log("Error occurred while getting users ::::::: ", error);
            return response.data.result = false;
        });
    };

    this.userMsg = function () {
        var arr = [];
        var usertoken = localStorage.getItem('token');
        return $http({
            method: 'GET',
            url: baseUrl + '/userMsg',
            headers: {
                'token': usertoken,
            }
        }).then(function (response) {
            console.log("userMsg =>>>> Response data :::::: ", response.data);

            let lastAaaaValue = null;
            for (let i = 0; i < response.data.result.length; i++) {
                var a = response.data.result[i];

                // if (
                //     (localStorage.getItem('userid') == a.senderId && localStorage.getItem('ruserId') == a.receiverId) ||
                //     (localStorage.getItem('userid') == a.receiverId && localStorage.getItem('ruserId') == a.senderId)
                // ) {

                // arr.push(a);
            }
            if (localStorage.getItem('userid') !== a._id) {
                lastAaaaValue = a;
            }
            // }
            if (localStorage.getItem('rusername') === null) {
                console.log("localStorage rusername was empty")
                localStorage.setItem('rusername', lastAaaaValue.receiverName);
            }

            if (localStorage.getItem('ruserId') === null) {
                console.log("localStorage ruserId was empty")
                localStorage.setItem('ruserId', lastAaaaValue.receiverId);
            }

            return response.data.result;
        }).catch(function (error) {
            console.log("Error occurred while getting messages ::::::: ", error);
            return response.data.result = false;
        });
    };

    this.searchUser = function (searchText) {
        var usertoken = localStorage.getItem('token');
        return $http({
            method: 'POST',
            url: baseUrl + '/searchUser',
            data: { searchName: searchText },
            headers: {
                'token': usertoken,
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            console.log("getAllUser =>>>> Response ::::::: ", response);
            return response.data;
        }).catch(function (error) {
            console.log("Error occurred while searching users ::::::: ", error);
            return [];
        });
    };
});
