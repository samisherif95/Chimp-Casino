//Libary Imports
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport');
const socket = require('socket.io')
const path = require('path');

//File Imports
const User = require("./models/User");
const Lobby = require("./models/Lobby");
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

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/build'));
    app.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    })
}

//Routes
app.use("/api/users", users);
app.use("/api/chatrooms", chatrooms);
app.use("/api/lobbies", lobbies);


//Websockets Setup

const lobbyPort = 7000;

const lobbySocket = app.listen(lobbyPort, function () {
  console.log("Listening at http://localhost: " + lobbyPort);
})

lobbySocket.configure(function () {
    lobbySocket.set("transports", ["xhr-polling"]);
    lobbySocket.set("polling duration", 10);
});

const lobbyServer = socket(lobbySocket)




//Lobby Server
const lobbiesCollection = {};

lobbyServer.on("connection", (socket) => {
  console.log("made connection with socket " + socket.id);
  let localLobbyId

  //chat 
  socket.on("chat", (data) => {
    lobbyServer.in(localLobbyId).emit("receiveMessage", data);
  });


  //lobbies
  socket.on("joinLobby", (lobbyId, username) => {
    localLobbyId = lobbyId

    socket.join(lobbyId)
    if (lobbiesCollection[lobbyId]) {
      lobbiesCollection[lobbyId].players[socket.id] = {
        x: 200,
        y: 250,
        playerId: socket.id,
        username
      }
    } else {
      lobbiesCollection[lobbyId] = {
        players: {},
        id: lobbyId
      }
      lobbiesCollection[lobbyId].players[socket.id] = {
        x: 200,
        y: 250,
        playerId: socket.id,
        username
      }
    }
    socket.to(lobbyId).emit('newPlayer', lobbiesCollection[lobbyId].players[socket.id]);
    socket.emit('lobbyPlayers', lobbiesCollection[lobbyId].players);
  });

  socket.on('playerMovement', position => {
    const movedPlayer = lobbiesCollection[localLobbyId].players[socket.id];
    movedPlayer.x = position.x;
    movedPlayer.y = position.y;
    socket.to(localLobbyId).emit("playerMoved", movedPlayer)
  })

  socket.on("leaveLobby", () => {
    socket.leave(localLobbyId)
    delete lobbiesCollection[localLobbyId].players[socket.id]
    localLobbyId = null;
  })

  //games

  // poker
  socket.on("joinPokerGame", () => {
    socket.join(localLobbyId + "poker")
  })

  socket.on("addPokerGamePlayer", username => {
    lobbyServer.in(localLobbyId + "poker").emit("addPokerGamePlayer", username)
  })

  socket.on("playerCalled", username => {
    lobbyServer.in(localLobbyId + "poker").emit("playerCalled", username)
  })

  socket.on("playerRaised", (username, amount) => {
    lobbyServer.in(localLobbyId + "poker").emit("playerRaised", username, amount)
  })

  socket.on("playerChecked", username => {
    lobbyServer.in(localLobbyId + "poker").emit("playerChecked", username)
  })

  socket.on("playerFolded", username => {
    lobbyServer.in(localLobbyId + "poker").emit("playerFolded", username)
  })

  socket.on("playerWon", (amount, username) => {
    lobbyServer.in(localLobbyId + "poker").emit("playerWon", username, amount)
  })

  // bj
  socket.on("joinBlackjackGame", (username, balance) => {
      console.log("JOINED")
    console.log(username, balance)
    socket.join(localLobbyId + "bj")
    lobbyServer.in(localLobbyId + "bj").emit("newPlayer", username, balance)
  })

  socket.on("leavePokerGame", () => {
    socket.leave(localLobbyId + "poker")
  })

  socket.on("leaveBlackjackGame", () => {
    socket.leave(localLobbyId + "bj")
  })


  //disconect
  socket.on("disconnect", () => {
    console.log(localLobbyId)
    if (localLobbyId) {
      delete lobbiesCollection[localLobbyId].players[socket.id]
      socket.to(localLobbyId).emit('removePlayer', socket.id)
    }
  })
 
})







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
        
      