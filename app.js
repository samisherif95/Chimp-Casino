//Libary Imports
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport');
const socket = require('socket.io')

//File Imports
const User = require("./models/User");
const users = require("./routes/api/users");
const chatrooms = require("./routes/api/chatrooms");
const lobbies = require("./routes/api/lobbies");


//SETUP
const app = express();
const db = require("./config/keys").mongoURI;
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>  console.log(`listening on port ${PORT}`));  //This console log is just for testing
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to mongoDB"))
  .catch(err => console.log(err))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(passport.initialize());
require('./config/passport')(passport);

//Routes
app.use("/api/users", users);
app.use("/api/chatrooms", chatrooms);
app.use("/api/lobbies", lobbies);


//Websockets Setup
const socketPort = 8000;
const server = app.listen(socketPort, function () {
  console.log("Listening at http://localhost: " + socketPort);
});
const chatServer = socket(server);


//Chat Server
chatServer.on("connection", (socket) => {
  console.log("made connection with socket " + socket.id);
  socket.on("chat", (data) => {
    chatServer.sockets.emit("receiveMessage", data);
  });
  socket.on("typing", (data) => {
    // send an event to everyone but the person who emitted the typing event to the server
    socket.broadcast.emit("typing", data);
  });
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
        
        
app.get("/", (req, res) => {
  // const user = new User({
  //   username: 'mendo',
  //   password: 'password'
  // })
  // user.save();
  res.send("Hello App!")
});
        
      