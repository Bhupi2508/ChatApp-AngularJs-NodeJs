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

    console.log("user token ::::::: ", token);
    if (token === null) {
        localStorage.clear();
        $state.go('login');
    }

    try {
        SocketService.on('startMessage', handleNewMessage);
    } catch (err) {
        console.log("Error finding message :::::: ", err);
    }

    try {
        $scope.getAllUser = function () {
            chatServices.getAllUser(token).then(function (users) {
                console.log("All User fetched ::::::: ", users);
                $scope.allUser = users;
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
                console.log("Sender and Receiver Messages Updated :::::: ", userMessages);
                // Call the function to update last message details
                updateLastMessageDetails();
            }).catch(function (error) {
                console.log("Error occurd during fetch users :::: ", error);
                localStorage.clear();
                $state.go('login');
            });
        };
    } catch (err) {
        console.log("Error getting all users :::::: ", err);
    }

    $scope.getAllUser();

    try {
        $scope.userMsg = function () {
            let arr = [];
            chatServices.userMsg().then(function (userMessages) {
                console.log("Fetched user's mesages ::::: ", userMessages);
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
                $scope.allUserMsg = userMessages;
            }).catch(function (error) {
                console.log("Error getting user messages :::::: ", error);
                localStorage.clear();
                $state.go('login');
            });
        };
    } catch (err) {
        console.log("Error fetching user messages :::::: ", err);
    }

    $scope.userMsg();

    try {
        $scope.person = function (userData) {
            console.log("Clicked on user :::::: ", userData)
            $scope.allUserArr = '';
            $scope.allUserMsg = '';
            localStorage.setItem('rusername', userData.firstname);
            localStorage.setItem('ruserId', userData._id);

            $scope.receiverUserName = localStorage.getItem('rusername');
            $scope.userMsg();
            $scope.searchResults = []
            $scope.searchText = '';

            // Check the screen width
            const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            if (screenWidth < 1024) {
                // Hide the sidebar and display the chat area
                const chatArea = document.querySelector('.chat-area');
                const sidebar = document.querySelector('.sidebar');

                chatArea.style.display = 'flex';
                sidebar.style.display = 'none';

                // Show the back button
                $scope.showBackButton = true;

                // Toggle the 'show' class to show/hide the chat area
                chatArea.classList.toggle('show');
            }
        };
    } catch (err) {
        console.log("Error occurd during clicked on user ::::: ", err);
    }

    // Function to handle the back button click
    $scope.goBackToSidebar = function () {
        const chatArea = document.querySelector('.chat-area');
        const sidebar = document.querySelector('.sidebar');

        chatArea.style.display = 'none';
        sidebar.style.display = 'block';

        // Hide the back button
        $scope.showBackButton = false;
    };

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
                    console.log("Error getting during searchresults ::::::: ", error);
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
        console.log("Error in sending message to the receivern ::::::: ", err);
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
        console.log("Error in logging out ::::::: ", err);
    }

    $scope.checkEnterKey = function (event) {
        if (event.keyCode === 13) { // 13 is the key code for Enter key
            // Call the addMessage() function when the Enter key is pressed
            try {
                $scope.addMessage();
            } catch (err) {
                console.log("Error adding message ::::::: ", err);
            }
        }
    };

    $scope.isLessThan1024 = window.innerWidth < 1024;


    // Function to handle new incoming messages
    function handleNewMessage(message) {
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
                }
            }
            $scope.allUserMsg.push(message);
            // $scope.allUser[index].lastMessage = msg;
            // $scope.allUser[index].lastMessageTime = time;
        } catch (err) {
            console.log("Error handling new message :::::::: ", err);
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
                    for (let i = $scope.allUserMsg.length - 1; i >= 0; i--) {
                        const chat = $scope.allUserMsg[i];
                        // Check if the message is related to the current user
                        if (chat.senderId === user._id || chat.receiverId === user._id) {
                            // Update last message details for the user
                            lastMessage = chat.message;
                            lastMessageTime = new Date(chat.createdAt); // Convert to Date object
                            break; // Stop searching for last message once found
                        }
                    }

                    // Update the user's last message details
                    user.lastMessage = lastMessage;
                    user.lastMessageTime = lastMessageTime;
                }
            });
        } catch (err) {
            console.log("Error updating last message details :::::::", err);
        }
    }

    // Function to handle file upload and show a preview
    $scope.uploadFile = function (event) {
        console.log("::::::::::::: ", event);
        // Get the selected file from the event
        const fileInput = event.target;

        // Check if a file is selected
        if (fileInput.files && fileInput.files.length > 0) {
            // Read the selected file
            const file = fileInput.files[0];

            // Check if the file is an image
            if (file.type.startsWith('image/')) {
                // Display the file preview (assuming you have an image element with the ID 'previewImage')
                const reader = new FileReader();
                reader.onload = function (e) {
                    const previewImage = document.getElementById('previewImage');
                    previewImage.src = e.target.result;
                    document.getElementById('filePreview').style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                // Handle other file types if needed
                console.log('Selected file is not an image.');
            }
        } else {
            // If no file is selected, hide the file preview
            document.getElementById('filePreview').style.display = 'none';
        }
    };
    // Function to check if the file URL points to an image
    // $scope.isImage = function (fileUrl) {
    //     const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    //     const extension = fileUrl.substr(fileUrl.lastIndexOf('.')).toLowerCase();
    //     return imageExtensions.includes(extension);
    // };
    // Add the 'uploadFile' function to handle file selection
});



// Custom filter to truncate the message and add '...ish'
app.filter('truncateMessage', function () {
    return function (input, maxLength) {
        if (!input || input.length <= maxLength) {
            return input;
        }
        return input.substring(0, maxLength) + '...';
    };
});