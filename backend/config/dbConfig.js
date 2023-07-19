/******************************************************************************
@File : dbConfig.js
@overview : This application allows two people to connect and chat in a room.
@author : Bhupendra Singh
******************************************************************************/

module.exports = {
    // MongoDB database URL
    url: process.env.db_url || 'mongodb://localhost:27017/chatapp'
};