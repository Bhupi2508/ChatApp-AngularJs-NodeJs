/******************************************************************************
@File : chatServices.js
@overview : This application allows two people to connect and chat in a room.
@author : Bhupendra Singh
******************************************************************************/

const chatModel = require('../app/models/chatModel');

// Add message by sender
exports.addMessage = (req, callback) => {
    console.log("Service request");

    // Send data to model and callback from there
    chatModel.addMessage(req, (err, data) => {
        if (err) {
            console.log("Error on service file :: ", err);
            return callback(err);
        } else {
            console.log("Returning from services => Data on service file :: ", data);
            return callback(null, data);
        }
    });
};

// Get user messages from the database
exports.userMsg = (req, callback) => {
    console.log("User request");

    // Send data to model and callback from there
    chatModel.userMsg(req, (err, data) => {
        if (err) {
            console.log("Chat services are not working");
            callback(err);
        } else {
            console.log("Chat service is working fine");
            callback(null, data);
        }
    });
};


// Get user messages from the database
// exports.uploadFile = (req, callback) => {
//     console.log("User request");

//     // Send data to model and callback from there
//     chatModel.uploadFile(req, (err, data) => {
//         if (err) {
//             console.log("Chat services are not working");
//             callback(err);
//         } else {
//             console.log("Chat service is working fine");
//             callback(null, data);
//         }
//     });
// };