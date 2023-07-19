/******************************************************************************
@File : userModel.js
@overview : This application allows two people to connect and chat in a room.
@author : Bhupendra Singh
******************************************************************************/

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define user schema
const userSchema = new mongoose.Schema({
    firstname: { type: String, required: [true, "First name is required"] },
    lastname: { type: String, required: [true, "Last name is required"] },
    email: { type: String, required: [true, "Email is required"] },
    password: { type: String, required: [true, "Password is required"] }
}, { timestamps: true });

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
            password: bcrypt.hashSync(body.password, salt)
        });
        newUser.save((err, result) => {
            if (err) return callback(err);
            console.log("Data saved successfully :: ", result);
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
    User.find({}, (err, data) => {
        if (err) {
            callback("Error in model :: " + err);
        } else {
            callback(null, data);
        }
    });
};

module.exports = new userModel();