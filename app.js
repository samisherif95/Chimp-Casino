//Libary Imports
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport');
const socket = require('socket.io')

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

//Routes
app.use("/api/users", users);
app.use("/api/chatrooms", chatrooms);
app.use("/api/lobbies", lobbies);


//Websockets Setup

const lobbyPort = 7000;

const lobbySocket = app.listen(lobbyPort, function () {
  console.log("Listening at http://localhost: " + lobbyPort);
})
// const socket = app.listen(port, function () {
//   console.log("Listening at http://localhost: " + port);
// })
const lobbyServer = socket(lobbySocket)
// const server = socket(socket);

//server 

// server.on("connection", (socket) => {
//   console.log("6000 made connection with socket " + socket.id );
// })






// lobbiesCollection: {
//   lobbyId: {
//     poker: {
      
//     }
//     blackjack: {

//     }
//     players: {
//       socket-id: {

//       }
//     }
//   }
// }
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
  // socket.on("disconnect", () => {
  //   Object.values(lobbiesCollection).forEach(lobby => {
  //     if (lobby.players.hasOwnProperty(socket.id)) {
  //       delete lobby.players[socket.id]
  //       socket.to(lobby.id).emit('removePlayer', socket.id)
  //       if (!Object.values(lobby.players).length) {
  //         delete lobbiesCollection[lobby.id]
  //         Lobby.findByIdAndRemove(lobby.id)
  //       }
  //     }
  //   })
  // })

  //games
  socket.on("joinPokerGame", () => {
    socket.join(localLobbyId + "poker")
  })

  socket.on("joinBlackjackGame", () => {
    socket.join(localLobbyId + "bj")
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
        
      