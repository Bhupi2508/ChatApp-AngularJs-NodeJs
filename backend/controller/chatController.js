/******************************************************************************
@File : chatController.js
@overview : This application allows two people to connect and chat in a room.
@author : Bhupendra Singh
******************************************************************************/

const chatService = require('../services/chatServices');

// Add a message
module.exports.addMessage = (req, callback) => {
    chatService.addMessage(req, (err, data) => {
        console.log("Request :: ", req);
        if (err) {
            console.log("Error in controller :: ", err);
            return callback(err);
        } else {
            console.log("Controller is working fine");
            return callback(null, data);
        }
    });
};

// Get user messages
module.exports.userMsg = (req, res) => {
    console.log("User message value");
    chatService.userMsg(req, (err, data) => {
        const response = {};
        if (err) {
            response.status = false;
            response.error = err;
            res.status(500).send(response);
        } else {
            response.status = true;
            response.result = data;
            res.status(200).send(response);
        }
    });
};
