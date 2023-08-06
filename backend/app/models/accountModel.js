/******************************************************************************
@File : accountModel.js
@overview : This application allows two people to connect and chat in a room.
@author : Bhupendra Singh
******************************************************************************/

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define user schema
const accountSchema = new mongoose.Schema({
    userId: { type: String, required: [true, "User Id is required"] },
    firstName: { type: String, required: [true, "First name is required"] },
    lastName: { type: String, required: [true, "Last name is required"] },
    email: { type: String, required: [true, "Email is required"] },
    profilePic: { type: String },
    dateOfBirth: { type: String },
    gender: { type: String },
    createdAt: { type: String },
    updatedAt: { type: String }
});

// Create user model
const Account = mongoose.model('profile', accountSchema);

function accountModel() { }

// Get loggedin user details
accountModel.prototype.fetchAccount = (body, callback) => {
    Account.findOne({ email: body.email }, (err, data) => {
        if (err) {
            callback("Error in model :: " + err);
        } else {
            callback(null, data);
        }
    });
};


// Update user account details
accountModel.prototype.updateAccount = (email, newData, callback) => {
    const updateData = {
        firstName: newData.firstName,
        lastName: newData.lastName,
        profilePic: newData.profilePic || null,
        dateOfBirth: newData.dateOfBirth || null,
        gender: newData.gender || null,
        updatedAt: new Date().toISOString()
    };

    Account.findOneAndUpdate({ email: email }, updateData, { new: true }, (err, updatedData) => {
        if (err) {
            callback("Error in model :: " + err);
        } else {
            callback(null, updatedData);
        }
    });
};


module.exports = {
    accountModel: accountModel,
    Account: Account
};