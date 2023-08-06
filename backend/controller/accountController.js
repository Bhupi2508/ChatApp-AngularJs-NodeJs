/******************************************************************************
@File : accountController.js
@overview : This application allows two people to connect and chat in a room.
@author : Bhupendra Singh
******************************************************************************/

const accountService = require('../services/accountServices');

// Get loggedin user details
module.exports.loginAccountDetails = (req, res) => {
    const response = {};

    accountService.loginAccountDetails(req, (err, result) => {
        if (err) {
            response.success = false;
            response.error = err;
            res.status(500).send(response);
        } else {
            response.success = true;
            response.result = result;
            res.status(200).send(response);
        }
    });
};