/******************************************************************************
@File : userController.js
@overview : This application allows two people to connect and chat in a room.
@author : Bhupendra Singh
******************************************************************************/

const userService = require('../services/userServices');
const jwt = require('jsonwebtoken');
const sendMail = require('../middleware/sendMail');

// User signup
module.exports.signup = (req, res) => {
    req.checkBody('firstname', 'First name is not valid').isLength({ min: 3 }).isAlpha();
    req.checkBody('lastname', 'Last name is not valid').isLength({ min: 3 }).isAlpha();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is not valid').isLength({ min: 6 }).equals(req.body.password);

    const errors = req.validationErrors();
    const response = {};
    if (errors) {
        response.success = false;
        response.error = errors;
        return res.status(422).send(response);
    } else {
        userService.signup(req.body, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).send({
                    message: err
                });
            } else {
                console.log(data);
                return res.status(200).send({
                    message: data
                });
            }
        });
    }
};

// User login
module.exports.login = (req, res) => {
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is not valid').isLength({ min: 6 });

    const secret = process.env.secret;
    const errors = req.validationErrors();
    const response = {};

    if (errors) {
        response.success = false;
        response.error = errors;
        return res.status(422).send(response);
    } else {
        userService.login(req.body, (err, data) => {
            if (err) {
                return res.status(500).send({
                    message: err
                });
            } else {
                const token = jwt.sign({ email: req.body.email, id: data._id }, secret, { expiresIn: process.env.token_expire_time });
                return res.status(200).send({
                    message: data,
                    token: token
                });
            }
        });
    }
};

// Forgot password
module.exports.forgotPassword = (req, res) => {
    req.checkBody('email', 'Email is not valid').isEmail();
    const secret = process.env.secret;
    const errors = req.validationErrors();
    const response = {};

    if (errors) {
        response.success = false;
        response.error = errors;
        return res.status(422).send(response);
    } else {
        userService.forgotPassword(req.body, (err, data) => {
            if (err) {
                return res.status(500).send({
                    message: err
                });
            } else {
                response.success = true;
                response.result = data;
                const token = jwt.sign({ _id: data._id }, secret, { expiresIn: process.env.token_expire_time });
                const url = `${req.protocol}://${req.get('host')}/#!/resetPassword/${token}`;

                console.log("url :: ", url)
                sendMail.sendEmailFunction(url);
                res.status(200).send([
                    {
                        id: data._id,
                        token: token,
                    },
                    {
                        message: "A link has been sent to your email. Please check it."
                    }
                ]);
            }
        });
    }
};

// Reset password
module.exports.resetPassword = (req, res) => {
    const response = {};

    userService.resetPassword(req, (err, result) => {
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

// Get all users
module.exports.getAllUser = (req, res) => {
    userService.getAllUser(req, (err, data) => {
        const response = {};

        if (err) {
            response.success = false;
            response.error = err;
            res.status(500).send(response);
        } else {
            response.success = true;
            response.result = data;
            res.status(200).send(response);
        }
    });
};
