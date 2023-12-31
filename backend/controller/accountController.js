/******************************************************************************
@File : accountController.js
@overview : This application allows two people to connect and chat in a room.
@author : Bhupendra Singh
******************************************************************************/

const accountService = require('../services/accountServices');

// Get logged-in user details
module.exports.fetchAccount = (req, res) => {
    const response = {};

    // Call the fetchAccount function from the accountService
    accountService.fetchAccount(req.decoded, (err, result) => {
        if (err) {
            response.success = false;
            response.error = err;
            res.status(500).send(response);
        } else {
            if (!result) {
                response.success = false;
                response.result = [];
                response.message = "No Data Found";
                res.status(200).send(response);
            } else {
                response.success = true;
                response.result = result;
                response.message = "Data fetched Successfully";
                res.status(200).send(response);
            }
        }
    });
};


// Update user account details
module.exports.updateAccount = (req, res) => {
    const response = {};

    // Call the updateAccount function from the accountService
    accountService.updateAccount(req.decoded.email, req.body, (err, result) => {
        if (err) {
            response.success = false;
            response.error = err;
            res.status(500).send(response);
        } else {
            if (!result) {
                response.success = false;
                response.message = "Failed to update account";
                res.status(400).send(response);
            } else {
                response.success = true;
                response.message = "Account updated successfully";
                res.status(200).send(response);
            }
        }
    });
};
