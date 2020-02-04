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
const PokerGame = require("./frontend/src/components/poker/game");
const GameLogic = require("./frontend/src/components/blackjack/blackjack/blackjack")

//SETUP
const app = express();
const server = require('http').createServer(app)
const db = require("./config/keys").mongoURI;
const PORT = process.env.PORT || 5000;
// app.listen(PORT, () =>  console.log(`listening on port ${PORT}`));  //This console log is just for testing
server.listen(PORT, () =>  console.log(`listening on port ${PORT}`));  //This console log is just for testing
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
// const lobbyPort = 7000;

// const lobbySocket = app.listen(lobbyPort, function () {
//   console.log("Listening at http://localhost: " + lobbyPort);
// })



const lobbyServer = socket(server)

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
  socket.on("getLobbies", () => {
    const lobbies = Object.keys(lobbiesCollection).map(lobbyId => {
        const { lobbyName, password, maxCapacity, balanceLimit } = lobbiesCollection[lobbyId];
        return {
            lobbyName,
            password,
            maxCapacity,
            balanceLimit
        }
    })
    socket.emit("receiveLobbies", lobbies);
  })

//   socket.on("createLobby", (lobbyData) => {
    
//   })

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
        id: lobbyId,
        bJ: {
            game: new GameLogic.Blackjack(),
        },
        poker: {
            game: new PokerGame(),
        }
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
    socket.leave(localLobbyId);
    delete lobbiesCollection[localLobbyId].players[socket.id];
    localLobbyId = null;
  })

  //games

  // poker
  socket.on("joinPokerGame", () => {
    socket.join(localLobbyId + "poker")
  })

  socket.on("addPokerGamePlayer", username => {
    lobbiesCollection[localLobbyId].poker.game.addPlayer(username)
    socket.emit("currentPokerPlayers", Object.values(lobbiesCollection[localLobbyId].poker.players));
    lobbiesCollection[localLobbyId].poker.players[socket.id] = {username};
    lobbyServer.in(localLobbyId + "poker").emit("addPokerGamePlayer", username);
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
  socket.on("joinBJGame", (username, balance) => {

    const locBJLobby = lobbiesCollection[localLobbyId].bJ


    socket.emit(
      "currentBJPlayers",
      locBJLobby.game.players.map(player => {
          return {
              userId: player.userId,
              pool: player.pool,
              poolSplit: player.poolSplit,
              balance: player.balance,
              hand: player.hand,
              handSplit: player.handSplit,
              handValue: player.getHandValue(),
              splitHandValue: player.getHandValue()
          }
      })
    );
    locBJLobby.game.addPlayer(socket.id, username, balance)
    socket.join(localLobbyId + "bj")
    const player = locBJLobby.game.players[locBJLobby.game.players.length-1]
    lobbyServer.in(localLobbyId + "bj").emit("newBJPlayer", {
        userId: player.userId,
        pool: player.pool,
        poolSplit: player.poolSplit,
        balance: player.balance,
        hand: player.hand,
        handSplit: player.handSplit,
        handValue: player.getHandValue(),
        splitHandValue: player.getHandValue()
    })
  })

  socket.on("bet", () => {
      
  })

  //leave games

  socket.on("leavePokerGame", () => {
    // delete lobbiesCollection[localLobbyId].poker.players[socket.id];
    socket.leave(localLobbyId + "poker");
  })

  socket.on("leaveBJGame", () => {
    // delete lobbiesCollection[localLobbyId].bJ.players[socket.id];
    socket.leave(localLobbyId + "bj")
    const bJPlayer = lobbiesCollection[localLobbyId].bJ.game.getPlayerBySocketId(socket.id)
    lobbiesCollection[localLobbyId].bJ.game.removePlayer(bJPlayer)
    lobbyServer.in(localLobbyId + "bj").emit("removePlayer", bJPlayer.userId)
    // emit method that removes player to all players still playing
  })


  //disconect
  socket.on("disconnect", () => {
    if (localLobbyId) {
        delete lobbiesCollection[localLobbyId].players[socket.id]
        const bJPlayer = lobbiesCollection[localLobbyId].bJ.game.getPlayerBySocketId(socket.id)
        if (bJPlayer) {
            lobbiesCollection[localLobbyId].bJ.game.removePlayer(bJPlayer)
            lobbyServer.in(localLobbyId + "bj").emit("removePlayer", bJPlayer.userId)
        }
    //   delete lobbiesCollection[localLobbyId].bJ.players[socket.id]
    //   delete lobbiesCollection[localLobbyId].poker.players[socket.id]
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
        
      