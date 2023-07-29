/******************************************************************************
@File :  routes.js
@overview : This application allows two people to connect and chat in a room.
@author : Bhupendra Singh
******************************************************************************/

const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const chatController = require('../controller/chatController');
const authMiddleware = require('../authantication/auth');

router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPassword', authMiddleware.auth, userController.resetPassword);
router.post('/addMessage', chatController.addMessage);
router.get('/getAllUser', authMiddleware.auth, userController.getAllUser);
router.get('/userMsg', authMiddleware.auth, chatController.userMsg);
router.post('/searchUser', authMiddleware.auth, userController.searchUser);
// router.post('/upload', controllerChat.uploadFile);

module.exports = router;