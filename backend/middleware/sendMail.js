/******************************************************************************
@File :  sendMail.js
@overview : This application allows two people to connect and chat in a room.
@author : Bhupendra Singh
******************************************************************************/

const nodemailer = require('nodemailer');

exports.sendEmailFunction = (url) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.email,
            pass: process.env.password
        }
    });

    const mailOptions = {
        from: process.env.email,
        to: process.env.email,
        subject: 'Chat-app password reset link',
        text: 'Please click on the link below to reset your password:\n\n' + url
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log('Error sending email ::', err);
        } else {
            console.log('Email sent successfully ::', info);
        }
    });
};
