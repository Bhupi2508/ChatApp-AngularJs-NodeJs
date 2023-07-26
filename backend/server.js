/******************************************************************************
@Purpose : Room chatting with two people in the same room.
@overview : This application allows two people to connect and chat in a room.
@author : Bhupendra Singh
******************************************************************************/

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const route = require('./routes/routes');
const server = require('http').createServer(app);
const ioSocket = require('socket.io').listen(server);
const controllerChat = require('./controller/chatController');
const expressValidator = require('express-validator');
require('dotenv').config();

// Enable CORS
app.use(cors());

// Parse URL encoded data and JSON in request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable Express Validator
app.use(expressValidator());
const port = process.env.port;

// Start the server and listen on port 4000
server.listen(port, () => {
    console.log(`Server is listening to port :: ${port}`);
});

// Establish socket.io connection with clients
const connections = [];
ioSocket.sockets.on('connection', function (socket) {
    connections.push(socket);
    console.log("Connected: %s sockets connected", connections.length);

    // Listen for 'createMessage' event to receive messages
    socket.on('createMessage', function (message) {
        console.log("::::: message", message)
        controllerChat.addMessage(message, (err, data) => {
            if (err) {
                console.log("Error on message :: ", err);
            } else {
                console.log("Data shown in server :: ", data);

                // Emit the message to all connected sockets
                ioSocket.sockets.emit('startMessage', data);
            }
        });
    });

    // Handle 'disconnect' event when a client disconnects
    socket.on('disconnect', function () {
        console.log("Socket disconnected...!!!");
    });
});

// Use the defined routes
app.use('/', route);

// Serve static files from the frontend directory
app.use(express.static('../frontend'));

// Use native promises for Mongoose
mongoose.Promise = global.Promise;

// Connect to the MongoDB database
const dbConfig = require('./config/dbConfig');

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log("Could not connect to the database");
    process.exit();
});

