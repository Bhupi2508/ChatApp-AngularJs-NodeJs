/******************************************************************************
@File : userServices.js
@overview : This application allows two people to connect and chat in a room.
@author : Bhupendra Singh
******************************************************************************/

const { accountModel } = require('../app/models/accountModel'); // Destructure accountModel from the module

// Get logged-in user details
exports.fetchAccount = (req, callback) => {
  // Send data to model and callback from there and here
  const model = new accountModel(); // Create an instance of accountModel
  model.fetchAccount(req, (err, data) => {
    if (err) {
      return callback(err);
    } else {
      return callback(null, data);
    }
  });
};