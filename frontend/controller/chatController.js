/******************************************************************************
 *  @File : chatController.js
 *  @Overview : This is the main JavaScript file for the chat application.
 *  @Author : Bhupendra Singh
 ******************************************************************************/

app.controller('chatController', function ($scope, SocketService, $state, chatServices) {
    $scope.message = "";
    $scope.allUserArr = [];
    $scope.currUserName = localStorage.getItem('name');
    $scope.currUser = localStorage.getItem('userid');
    $scope.receiverName = localStorage.getItem('rusername');
    $scope.receiverId = localStorage.getItem('ruserId');
    $scope.receiverUserName = localStorage.getItem('rusername');

    var token = localStorage.getItem("token");
    console.log("token: ", token);

    if (token === null) {
        $state.go('login');
    }

    var baseUrl = window.location.origin;

    try {
        SocketService.on('startMessage', (message) => {
            if (
                localStorage.getItem('userid') == message.senderId ||
                (localStorage.getItem('userid') == message.receiverId && localStorage.getItem('ruserId') == message.senderId)
            ) {
                if ($scope.allUserArr === undefined) {
                    $scope.allUserArr = message;
                } else {
                    $scope.allUserArr.push(message);
                    console.log("allUserArr", $scope.allUserArr);
                }
            }
        });
    } catch (err) {
        console.log("Error finding message");
    }

    $scope.getAllUser = function () {
        chatServices.getAllUser($scope, token, baseUrl);
    };

    $scope.getAllUser();

    $scope.person = function (userData) {
        console.log(":::::::::::::::::::::::::::: ", userData)
        $scope.allUserArr = '';
        localStorage.setItem('rusername', userData.firstname);
        localStorage.setItem('ruserId', userData._id);

        $scope.receiverUserName = localStorage.getItem('rusername');
        $scope.userMsg();
    };

    $scope.userMsg = function () {
        console.log("Function calling....");
        chatServices.userMsg($scope, baseUrl);
    };

    $scope.userMsg();


    // Function to format time in "05:25 pm" format
    $scope.formatTime = function (timeString) {
        const date = new Date(timeString);
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const meridian = hours >= 12 ? 'pm' : 'am';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = String(minutes).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes} ${meridian}`;
    };

    try {
        $scope.addMessage = function () {
            var msg = {
                senderId: localStorage.getItem('userid'),
                senderName: localStorage.getItem('name'),
                receiverId: localStorage.getItem('ruserId'),
                receiverName: localStorage.getItem('rusername'),
                message: $scope.message
            };
            $scope.message = '';

            SocketService.emit('createMessage', msg);
        };
    } catch (err) {
        console.log("Error in sending message to the receiver");
    }

    try {
        $scope.logout = function () {
            localStorage.clear();
            $state.go('login');
        };
    } catch (err) {
        console.log("Error in logging out");
    }
});