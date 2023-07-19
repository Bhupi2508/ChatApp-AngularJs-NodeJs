/******************************************************************************
@File : chatModel.js
@overview : This application allows two people to connect and chat in a room.
@author : Bhupendra Singh
******************************************************************************/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema for chat users
const chatSchema = new Schema({
    senderId: {
        type: String
    },
    senderName: {
        type: String
    },
    receiverId: {
        type: String
    },
    receiverName: {
        type: String
    },
    message: {
        type: String
    }
}, {
    timestamps: true
});

// Create a chatModel function and schema
function chatModel() {}

const Chat = mongoose.model('chatInfo :: ', chatSchema);

try {
    chatModel.prototype.addMessage = (chatData, callback) => {
        console.log('In model => Data :: ', chatData.senderId);

        // Create a new message object
        const newMessage = new Chat({
            senderId: chatData.senderId,
            senderName: chatData.senderName,
            receiverId: chatData.receiverId,
            receiverName: chatData.receiverName,
            message: chatData.message
        });
        console.log("Created new message :: ", newMessage);

        // Save the message to the database
        newMessage.save((err, result) => {
            if (err) {
                console.log('Error : Data not saved :: ', err);
                return callback(err);
            } else {
                console.log('Chat data saved successfully');
                return callback(null, result);
            }
        });
    };
} catch (err) {
    console.log('Result not found :: ', err);
}

// Retrieve user messages from the database
chatModel.prototype.userMsg = (req, callback) => {
    Chat.find({}, (err, data) => {
        if (err) {
            callback("Error in model :: " + err);
        } else {
            callback(null, data);
        }
    });
};

module.exports = new chatModel();
