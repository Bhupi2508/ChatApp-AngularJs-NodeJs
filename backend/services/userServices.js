/******************************************************************************
@File : userServices.js
@overview : This application allows two people to connect and chat in a room.
@author : Bhupendra Singh
******************************************************************************/

const userModel = require('../app/models/userModels');

// Signup
exports.signup = (req, callback) => {
  // Send data to model and callback from there and here
  userModel.signup(req, (err, data) => {
    if (err) {
      return callback(err);
    } else {
      return callback(null, data);
    }
  });
};

// Login
exports.login = (req, callback) => {
  // Send data to model and callback from there and here
  userModel.login(req, (err, data) => {
    if (err) {
      return callback(err);
    } else {
      return callback(null, data);
    }
  });
};

// Forgot password
exports.forgotPassword = (req, callback) => {
  // Send data to model and callback from there and here
  userModel.forgotPassword(req, (err, data) => {
    if (err) {
      return callback(err);
    } else {
      return callback(null, data);
    }
  });
};

// Reset password
exports.resetPassword = (req, callback) => {
  // Send data to model and callback from there and here
  userModel.resetPassword(req, (err, data) => {
    if (err) {
      return callback(err);
    } else {
      return callback(null, data);
    }
  });
};

// Update password
exports.updatePassword = (req, callback) => {
  // Send data to model and callback from there and here
  userModel.updatePassword(req, (err, data) => {
    if (err) {
      return callback(err);
    } else {
      return callback(null, data);
    }
  });
};

// Get all users data
exports.getAllUser = (req, callback) => {
  // Send data to model and callback from there and here
  userModel.getAllUser(req, (err, data) => {
    if (err) {
      return callback(err);
    } else {
      return callback(null, data);
    }
  });
};

// Search users
exports.searchUser = (req, callback) => {
  // Send data to model and callback from there and here
  userModel.searchUser(req, (err, data) => {
    if (err) {
      return callback(err);
    } else {
      return callback(null, data);
    }
  });
};