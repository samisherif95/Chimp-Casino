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
const chatPort = 8000;
const lobbyPort = 7000;
const chatSocket = app.listen(chatPort, function () {
  console.log("Listening at http://localhost: " + chatPort);
});
const lobbySocket = app.listen(lobbyPort, function () {
  console.log("Listening at http://localhost: " + lobbyPort);
})
const lobbyServer = socket(lobbySocket)
const chatServer = socket(chatSocket);


//Chat Server
chatServer.on("connection", (socket) => {
  console.log("made connection with socket " + socket.id);
  socket.on("chat", (data) => {
    chatServer.sockets.emit("receiveMessage", data);
  });
  // socket.on("typing", (data) => {
  //   // send an event to everyone but the person who emitted the typing event to the server
  //   socket.broadcast.emit("typing", data);
  // });
});


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
  socket.emit("requestLobby")

  socket.on("joinLobby", (lobbyId, username) => {
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
        poker: {},
        blackjack: {},
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

  socket.on('playerMovement', (position, lobbyId) => {
    const movedPlayer = lobbiesCollection[lobbyId].players[socket.id];
    movedPlayer.x = position.x;
    movedPlayer.y = position.y;
    socket.to(lobbyId).emit("playerMoved", movedPlayer)
  })

  socket.on("disconnect", () => {
    Object.values(lobbiesCollection).forEach(lobby => {
      if (lobby.players.hasOwnProperty(socket.id)) {
        delete lobby.players[socket.id]
        socket.to(lobby.id).emit('removePlayer', socket.id)
        if (!Object.values(lobby.players).length) {
          delete lobbiesCollection[lobby.id]
          Lobby.findByIdAndRemove(lobby.id)
        }
      }
    })
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
        
      