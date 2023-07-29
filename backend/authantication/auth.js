/******************************************************************************
@File : auth.js
@overview : This application allows two people to connect and chat in a room.
@author : Bhupendra Singh
******************************************************************************/

require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.secret;

// Middleware function for authentication
const auth = (req, res, next) => {
    console.log("In auth");
    const token = req.headers["token"];
    console.log("Token in auth :: ", token);
    const response = "Unauthorized user";

    // Verify the token and handle the response
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            console.log("Error :: ", err);
            if (err.name === "TokenExpiredError") {
                // Token has expired
                return res.status(401).send(`${response} | ${err.name}`);
            }
            return res.status(401).send(`${response} | ${err.name}`);
        } else {
            console.log("Decoded Data :: ", decoded);
            req.decoded = decoded;
            next();
        }
    });
};


// Generate a token with the provided payload
const generateToken = (payload) => {
    const token = jwt.sign({ payload }, secret, { expiresIn: process.env.token_expire_time }); // Expires in the specified time
    return {
        success: true,
        message: 'Token Generated!',
        token: token
    };
};


// Function to check if a JWT token has expired or not
const isTokenExpired = (token, secret) => {
    try {
        // Verify the token and decode its payload
        const decodedToken = jwt.verify(token, secret);

        // Check the expiration time
        return Date.now() >= decodedToken.exp * 1000;
    } catch (error) {
        // If there's an error, the token is either invalid or expired
        return true;
    }
}

module.exports = { auth, generateToken };

