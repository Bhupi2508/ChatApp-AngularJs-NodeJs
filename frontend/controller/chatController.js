/******************************************************************************
 *  @File : chatController.js
 *  @Overview : This is the main JavaScript file for the chat application.
 *  @Author : Bhupendra Singh
 ******************************************************************************/

app.controller('chatController', function ($scope, SocketService, $state, chatServices, $timeout) {
    var baseUrl = window.location.origin;
    var token = localStorage.getItem("token");

    $scope.message = "";
    $scope.allUserArr = [];
    $scope.allUserMsg = [];
    $scope.searchResults = [];
    $scope.showPopup = false;
    $scope.selectedResult = '';
    $scope.currUserName = localStorage.getItem('name');
    $scope.currUser = localStorage.getItem('userid');
    $scope.receiverName = localStorage.getItem('rusername');
    $scope.receiverId = localStorage.getItem('ruserId');
    $scope.receiverUserName = localStorage.getItem('rusername');

    console.log("token : ", token);

    if (token === null) {
        $state.go('login');
    }

    try {
        SocketService.on('startMessage', handleNewMessage);
    } catch (err) {
        console.log("Error finding message:", err);
    }

    try {
        $scope.getAllUser = function () {
            chatServices.getAllUser(token).then(function (users) {
                $scope.allUser = users;
                console.log("Users fetched:", users);
                return chatServices.userMsg(); // Call userMsg after fetching users
            }).then(function (userMessages) {
                let array = [];
                for (let i = 0; i < userMessages.length; i++) {
                    var a = userMessages[i];
                    if (
                        (localStorage.getItem('userid') == a.senderId && localStorage.getItem('ruserId') == a.receiverId) ||
                        (localStorage.getItem('userid') == a.receiverId && localStorage.getItem('ruserId') == a.senderId)
                    ) {
                        array.push(a);
                    }
                }
                $scope.allUserArr = array;
                // all msg
                $scope.allUserMsg = userMessages
                console.log("User messages fetched:", userMessages);
                // Call the function to update last message details
                updateLastMessageDetails();
            }).catch(function (error) {
                console.log("Error getting all users or user messages:", error);
            });
        };
    } catch (err) {
        console.log("Error getting all users:", err);
    }

    $scope.getAllUser();

    try {
        $scope.userMsg = function () {
            let arr = [];
            chatServices.userMsg().then(function (userMessages) {
                console.log("User messages fetched:", userMessages);
                // $scope.allUserMsg = userMessages;
                for (let i = 0; i < userMessages.length; i++) {
                    var a = userMessages[i];
                    if (
                        (localStorage.getItem('userid') == a.senderId && localStorage.getItem('ruserId') == a.receiverId) ||
                        (localStorage.getItem('userid') == a.receiverId && localStorage.getItem('ruserId') == a.senderId)
                    ) {
                        arr.push(a);
                    }
                }
                $scope.allUserArr = arr;
            }).catch(function (error) {
                console.log("Error getting user messages:", error);
            });
        };
    } catch (err) {
        console.log("Error fetching user messages:", err);
    }

    $scope.userMsg();

    try {
        $scope.person = function (userData) {
            console.log(":::::::::::::::::::::::::::: ", userData)
            $scope.allUserArr = '';
            $scope.allUserMsg = '';
            localStorage.setItem('rusername', userData.firstname);
            localStorage.setItem('ruserId', userData._id);

            $scope.receiverUserName = localStorage.getItem('rusername');
            $scope.userMsg();
            $scope.searchResults = []
            $scope.searchText = '';
        };
    } catch (err) {
        console.log("Error setting user data:", err);
    }

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
                chatServices.searchUser($scope.searchText, baseUrl).then(function (data) {
                    console.log("searchResults ::: ", data.searchData)
                    $scope.searchResults = data;
                }).catch(function (error) {
                    console.log("Error getting user results:", error);
                });;;
            } else {
                // If search text is less than 3 characters, clear the search results
                $scope.searchResults = [];
            }
        };
    } catch (err) {
        console.log("Error searching users:", err);
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
        // Function to handle file uploads and add a new message
        $scope.addMessage = function () {
            if ($scope.message || $scope.selectedFile) {
                var msg = {
                    senderId: localStorage.getItem('userid'),
                    senderName: localStorage.getItem('name'),
                    receiverId: localStorage.getItem('ruserId'),
                    receiverName: localStorage.getItem('rusername'),
                    message: $scope.message || '',
                    // file: $scope.selectedFile // Include the file as part of the message
                };
                $scope.message = '';
                // $scope.selectedFile = null; // Reset the selectedFile after sending the message

                // // Send the message to the server using the /upload route
                // $http.post('/upload', msg).then(function (response) {
                //     // Message with file uploaded successfully
                //     console.log(response.data.message);
                // }).catch(function (error) {
                //     // Handle error
                //     console.log('Error sending message:', error);
                // });

                // Emit the message to all connected sockets (excluding the file)
                SocketService.emit('createMessage', {
                    senderId: msg.senderId,
                    senderName: msg.senderName,
                    receiverId: msg.receiverId,
                    receiverName: msg.receiverName,
                    message: msg.message
                });
            }
        };
    } catch (err) {
        console.log("Error in sending message to the receiver:", err);
    }

    // Function to handle file selection
    // $scope.onFileSelect = function (event) {
    //     $scope.selectedFile = event.target.files[0];
    // };

    try {
        $scope.logout = function () {
            localStorage.clear();
            $state.go('login');
        };
    } catch (err) {
        console.log("Error in logging out:", err);
    }

    $scope.checkEnterKey = function (event) {
        if (event.keyCode === 13) { // 13 is the key code for Enter key
            // Call the addMessage() function when the Enter key is pressed
            try {
                $scope.addMessage();
            } catch (err) {
                console.log("Error adding message:", err);
            }
        }
    };

    // Function to handle new incoming messages
    function handleNewMessage(message) {
        let msg;
        let time;
        try {
            if (
                localStorage.getItem('userid') == message.senderId ||
                (localStorage.getItem('userid') == message.receiverId && localStorage.getItem('ruserId') == message.senderId)
            ) {
                $scope.allUserArr.push(message);

                // Update last message details for the corresponding user
                const userId = message.senderId === localStorage.getItem('userid') ? message.receiverId : message.senderId;
                const index = $scope.allUser.findIndex(user => user._id === userId);
                if (index !== -1) {
                    $scope.allUser[index].lastMessage = message.message;
                    $scope.allUser[index].lastMessageTime = message.createdAt;
                    msg = message.mess;
                    time = message.createdAt;
                }
            }
            $scope.allUserMsg.push(message);
            $scope.allUser[index].lastMessage = msg;
            $scope.allUser[index].lastMessageTime = time;
        } catch (err) {
            console.log("Error handling new message:", err);
        }
    }

    // Function to update last message details for each user
    function updateLastMessageDetails() {
        try {
            // Loop through all users in $scope.allUser
            $scope.allUser.forEach(user => {
                // Initialize variables to store the last message details for each user
                let lastMessage = null;
                let lastMessageTime = null;

                // Loop through all messages in $scope.allUserArr
                if ($scope.currUser !== user._id) {
                    console.log("USER ::::: ", user)
                    for (let i = $scope.allUserMsg.length - 1; i >= 0; i--) {
                        const chat = $scope.allUserMsg[i];
                        console.log("user chat ", chat)
                        // Check if the message is related to the current user
                        if (chat.senderId === user._id || chat.receiverId === user._id) {
                            console.log("In IF CONDITION ", chat)
                            // Update last message details for the user
                            lastMessage = chat.message;
                            lastMessageTime = new Date(chat.createdAt); // Convert to Date object
                            console.log("Final Message :::: ", lastMessage, ":::: ", lastMessageTime)
                            break; // Stop searching for last message once found
                        }
                    }

                    // Update the user's last message details
                    user.lastMessage = lastMessage;
                    user.lastMessageTime = lastMessageTime;
                }
            });
        } catch (err) {
            console.log("Error updating last message details:", err);
        }
    }


    // Function to check if the file URL points to an image
    // $scope.isImage = function (fileUrl) {
    //     const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    //     const extension = fileUrl.substr(fileUrl.lastIndexOf('.')).toLowerCase();
    //     return imageExtensions.includes(extension);
    // };

});

// Function to show a preview of the selected image
function showPreview(event) {
    console.log("showPreview function called." , event);
    const fileInput = event.target;
    const filePreview = document.getElementById("filePreview");
    const previewImage = document.getElementById("previewImage");

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            console.log("Image loaded. Displaying preview.");
            previewImage.src = e.target.result;
            filePreview.style.display = "block";
        };

        reader.readAsDataURL(fileInput.files[0]);
    }
}

// Attach the function to the file input change event
document.getElementById("fileInput").addEventListener("change", showPreview);


// Custom filter to truncate the message and add '...ish'
app.filter('truncateMessage', function () {
    return function (input, maxLength) {
        if (!input || input.length <= maxLength) {
            return input;
        }
        return input.substring(0, maxLength) + '...';
    };
});