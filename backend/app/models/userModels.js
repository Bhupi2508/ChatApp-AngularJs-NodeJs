/******************************************************************************
@File : userModel.js
@overview : This application allows two people to connect and chat in a room.
@author : Bhupendra Singh
******************************************************************************/

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Account } = require('./accountModel');


// Define user schema
const userSchema = new mongoose.Schema({
    firstname: { type: String, required: [true, "First name is required"] },
    lastname: { type: String, required: [true, "Last name is required"] },
    email: { type: String, required: [true, "Email is required"] },
    password: { type: String, required: [true, "Password is required"] },
    createdAt: { type: String },
    updatedAt: { type: String }
});

// Create user model
const User = mongoose.model('user', userSchema);
const salt = bcrypt.genSaltSync(10);

function userModel() { }

// User signup
userModel.prototype.signup = (body, callback) => {
    User.findOne({ email: body.email }, (err, data) => {
        if (err) return callback(err);
        if (data) {
            const response = { error: true, message: "Email already exists", errorCode: 404 };
            return callback(response);
        }
        const newUser = new User({
            firstname: body.firstname,
            lastname: body.lastname,
            email: body.email,
            password: bcrypt.hashSync(body.password, salt),
            createdAt: new Date().toISOString(), // Set createdAt to current timestamp in ISO 8601 format
            updatedAt: new Date().toISOString() // Set updatedAt to current timestamp in ISO 8601 format
        });

        newUser.save((err, result) => {
            if (err) return callback(err);

            // Create or update the profile in the Account model
            const accountData = new Account({
                userId: result._id,
                firstName: body.firstname,
                lastName: body.lastname,
                email: body.email,
                profilePic: null,
                dateOfBirth: null,
                gender: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            accountData.save((err, accountResult) => {
                if (err) {
                    console.error("Error while creating/updating account:", err);
                } else {
                    console.log("Account saved/updated successfully :: ", accountResult);
                }
            });

            console.log("User Data saved successfully :: ", result);
            return callback(null, result);
        });
    });
};

// User login
userModel.prototype.login = (body, callback) => {
    User.findOne({ email: body.email }, (err, data) => {
        if (err) return callback(err);
        if (!data) return callback("Invalid User");
        bcrypt.compare(body.password, data.password, (err, res) => {
            if (err) return callback(err);
            if (res) {
                console.log("Congratulations! Login successful.");
                return callback(null, data);
            } else {
                console.log("Incorrect password. Please check it once.");
                return callback("Incorrect password").status(500);
            }
        });
    });
};

// Forgot password
userModel.prototype.forgotPassword = (body, callback) => {
    User.findOne({ email: body.email }, (err, data) => {
        if (err) return callback(err);
        if (data) return callback(null, data);
        return callback("Invalid User");
    });
};

// Reset password
userModel.prototype.resetPassword = (req, callback) => {
    const newpassword = bcrypt.hashSync(req.body.password, salt);
    User.updateOne({ email: req.email }, { password: newpassword }, (err, result) => {
        if (err) {
            callback(err);
        } else {
            console.log(result);
            callback(null, result);
        }
    });
};

// Get all users
userModel.prototype.getAllUser = (req, callback) => {
    console.log(":::: ", req)
    User.find({}, (err, data) => {
        if (err) {
            callback("Error in model :: " + err);
        } else {
            callback(null, data);
        }
    });
};

// Forgot password
userModel.prototype.searchUser = (body, callback) => {
    const searchName = body.searchName;
    User.find(
        {
            $or: [
                { firstname: { $regex: searchName, $options: 'i' } },
                { lastname: { $regex: searchName, $options: 'i' } }
            ]
        },
        (err, data) => {
            if (err) return callback(err);
            if (data) return callback(null, data);
            return callback("Invalid User");
        }
    );
};

module.exports = new userModel();