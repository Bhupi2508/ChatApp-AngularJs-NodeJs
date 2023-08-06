/******************************************************************************
@File : userServices.js
@overview : This application allows two people to connect and chat in a room.
@author : Bhupendra Singh
******************************************************************************/

const accountModel = require('../app/models/accountModel');

// Get loggedin user details
exports.loginAccountDetails = (req, callback) => {
    // Send data to model and callback from there and here
    accountModel.loginAccountDetails(req, (err, data) => {
      if (err) {
        return callback(err);
      } else {
        return callback(null, data);
      }
    });
  };