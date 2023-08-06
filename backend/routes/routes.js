/******************************************************************************
@File :  routes.js
@overview : This application allows two people to connect and chat in a room.
@author : Bhupendra Singh
******************************************************************************/

const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const chatController = require('../controller/chatController');
const accountController = require('../controller/accountController');
const authMiddleware = require('../authantication/auth');

// User Routes
router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPassword', authMiddleware.auth, userController.resetPassword);
router.post('/searchUser', authMiddleware.auth, userController.searchUser);
router.get('/getAllUser', authMiddleware.auth, userController.getAllUser);

// Chat Routes
router.post('/addMessage', chatController.addMessage);
router.get('/userMsg', authMiddleware.auth, chatController.userMsg);

// Account Routes
router.get('/fetchAccount', authMiddleware.auth, accountController.fetchAccount);

// router.post('/upload', controllerChat.uploadFile);

module.exports = router;