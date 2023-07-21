/******************************************************************************
 *  @File : chatController.js
 *  @Overview : This is the main JavaScript file for the chat application.
 *  @Author : Bhupendra Singh
 ******************************************************************************/

app.controller('chatController', function ($scope, SocketService, $state, chatServices, $timeout) {
    $scope.message = "";
    $scope.allUserArr = [];
    $scope.searchResults = [];
    $scope.showPopup = false;
    $scope.selectedResult = '';
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

    try {
        $scope.person = function (userData) {
            console.log(":::::::::::::::::::::::::::: ", userData)
            $scope.allUserArr = '';
            localStorage.setItem('rusername', userData.firstname);
            localStorage.setItem('ruserId', userData._id);

            $scope.receiverUserName = localStorage.getItem('rusername');
            $scope.userMsg();
            $scope.searchResults = []
            $scope.searchText = '';
        };
    } catch (err) {
        console.log("Error finding message");
    }

    $scope.userMsg = function () {
        console.log("Function calling....");
        chatServices.userMsg($scope, baseUrl);
    };

    $scope.userMsg();

    // Function to format time in "05:25 pm" format
    $scope.formatTime = function (timeString, module) {

        // Parse the input timeString to a Date object
        const date = new Date(timeString);

        // Get the user's local timezone offset (in minutes)
        const userTimezoneOffset = date.getTimezoneOffset();

        // Define the custom timezone offset (in minutes) to add to the date
        // Here, we assume the offset is 5.30 hours (330 minutes)
        const customTimezoneOffset = 330;

        // Calculate the total timezone offset in minutes
        // Add the custom timezone offset to the user's local offset
        const totalTimezoneOffset = userTimezoneOffset + customTimezoneOffset;

        // Create a new date by adding the total timezone offset
        const adjustedDate = new Date(date.getTime() + totalTimezoneOffset * 60 * 1000);

        // Get the adjusted hours, minutes, day, month, and year
        const hours = adjustedDate.getHours();
        const minutes = adjustedDate.getMinutes();
        const day = adjustedDate.getDate();
        const month = adjustedDate.getMonth() + 1; // Months are zero-based, so we add 1
        const year = adjustedDate.getFullYear();

        // Format the time and date
        const meridian = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = String(minutes).padStart(2, '0');

        // Combine the formatted time and date
        const formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
        const formattedTime = `${formattedHours}:${formattedMinutes} ${meridian}`;

        if (module === "message") {
            return `${formattedTime} ${formattedDate}`;
        } else if (module === "userList") {
            return `${formattedDate} ${formattedTime} `;
        }

        return `${formattedTime} ${formattedDate}`;
    };




    $scope.searchText = '';

    try {
        $scope.search = function () {
            if ($scope.searchText.length >= 3) {
                chatServices.searchUser($scope, baseUrl);
                console.log("searchRscopeesults ::: ", $scope)
            } else {
                // If search text is less than 3 characters, clear the search results
                $scope.searchResults = [];
            }
        };
    } catch (err) {
        console.log("Error searching users");
    }


    // Function to scroll to the bottom of the #messageBody div
    function scrollToBottom() {
        var objDiv = document.getElementById("messageBody");
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    // Watch for changes in the 'allUserArr' array and scroll to the bottom when it changes
    $scope.$watch('allUserArr', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $timeout(scrollToBottom, 0);
        }
    }, true);

    try {
        $scope.addMessage = function () {
            if ($scope.message) {
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
        }
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

    $scope.checkEnterKey = function (event) {
        if (event.keyCode === 13) { // 13 is the key code for Enter key
            // Call the addMessage() function when the Enter key is pressed
            $scope.addMessage();
        }
    };
});