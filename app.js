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
server.listen(PORT, () => console.log(`listening on port ${PORT}`));  //This console log is just for testing
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log("Connected to mongoDB"))
    .catch(err => console.log(err))
app.use(bodyParser.urlencoded({ extended: false }));
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
    let localPokerLobby;
    let localBJLobby
    //helper methods
    const findUserAndUpdateBalance = (balance, _id) => {
        User.findById(_id).then(user => {
            const balanceDiff = balance - user.balance;
            user.set({ balance })
            user.save().then(user => socket.emit("updateBalance", balance));
            if (balanceDiff > 0) {
                lobbyServer.in(localLobbyId).emit("slotsWinner", user.username, balanceDiff)
            }

        })
    }

    const findUserByUsernameAndUpdateBalance = (balance, username) => {
        User.findOne({ username }).then(user => {
            const balanceDiff = balance - user.balance;
            user.set({ balance })
            user.save().then(user => socket.emit("updateBalance", balance));
            if (balanceDiff > 0) {
                lobbyServer.in(localLobbyId).emit("slotsWinner", user.username, balanceDiff)
            }

        })
    }

    const findLobbyByIdAndChangeCapacity = num => {
        Lobby.findById(localLobbyId).then(lobby => {
            lobby.set({ currentCapacity: lobby.currentCapacity + num});
            lobby.save().then(lobby => {
                if (lobby.currentCapacity === 0) {
                    lobby.remove();
                }
            });
        })
    }




    const pokerGameOver = () => {
        if (localPokerLobby.game.cycle === 4 || localPokerLobby.game.players.length === 1) {
            const winner = localPokerLobby.game.getWinner();
            socket.emit("updateBalance", winner.bananas);
            lobbyServer.in(localLobbyId + "poker").emit("playerWon", winner)
                setTimeout(() => {
                    if (localPokerLobby.game.players.length > 1) {
                        localPokerLobby.game.handleNewHand();
                        lobbyServer.in(localLobbyId + "poker").emit("newGame",
                            localPokerLobby.game.players.map(player => {
                                return {
                                    handle: player.handle,
                                    bananas: player.bananas,
                                    hand: player.hand,
                                    bigBlind: player.bigBlind,
                                    smallBlind: player.smallBlind,
                                }
                            }), localPokerLobby.game.currentPlayers[0].handle);
                    }
                }, 10000)
                setTimeout(() => {
                    if (localPokerLobby.game.players.length > 1) {
                        lobbyServer.in(localLobbyId + "poker").emit("aboutToStart")
                    } else {
                        lobbyServer.in(localLobbyId + "poker").emit("needMorePlayers")
                    }
                }, 7000) 
        } 
    }
  //chat 
  socket.on("chat", (data) => {
    lobbyServer.in(localLobbyId).emit("receiveMessage", data);
  });

  socket.on("pokerChat", data => {
      lobbyServer.in(localLobbyId + "poker").emit("receivePokerMessage", data);
  })

  socket.on("bjChat", data => {
    lobbyServer.in(localLobbyId + "bj").emit("receiveBJMessage", data);
  })


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
    findLobbyByIdAndChangeCapacity(1);
    localPokerLobby = lobbiesCollection[lobbyId].poker
    localBJLobby = lobbiesCollection[lobbyId].bJ;
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
    findLobbyByIdAndChangeCapacity(-1);
    
  })

  //games

  // slots

  socket.on("slotChange", (balance, _id) => {
    findUserAndUpdateBalance(balance, _id);
  })

  // poker
  socket.on("joinPokerGame", () => {
    //send him information about other players in game
    socket.emit("currentPokerPlayers", localPokerLobby.game.players.map(player => {
        return {
            handle: player.handle,
            bananas: player.bananas,
            hand: player.hand,
            bigBlind: player.bigBlind,
            smallBlind: player.smallBlind,
        }
    }), localPokerLobby.game.communityCards, localPokerLobby.game.turnStarted);

    socket.join(localLobbyId + "poker")
  })

  socket.on("addPokerGamePlayer", (username, balance) => {
    // add him to the game

    if (localPokerLobby.game.addPlayer(username, socket.id, balance)) {
        const player = localPokerLobby.game.players[0]
        lobbyServer.in(localLobbyId + "poker").emit("addPokerGamePlayer", {
            handle: player.handle,
            bananas: player.bananas,
            hand: player.hand,
            bigBlind: player.bigBlind,
            smallBlind: player.smallBlind,
        });
        if (localPokerLobby.game.players.length > 1 && !localPokerLobby.game.turnStarted) {
            lobbyServer.in(localLobbyId + "poker").emit("aboutToStart")
            setTimeout(() => {
                localPokerLobby.game.startGame();
                lobbyServer.in(localLobbyId + "poker").emit("gameStarted", localPokerLobby.game.currentPlayers[0].handle )
            }, 3000)
        }
    }   
    // send other players information that he joined
  })

  socket.on("playerCalled", username => {
    const currentPlayer = localPokerLobby.game.players[0];
    localPokerLobby.game.handleCall();
    socket.emit("updateBalance", currentPlayer.bananas);
    lobbyServer.in(localLobbyId + "poker").emit("playerCalled", 
    username, 
    localPokerLobby.game.pot, 
    localPokerLobby.game.currentPlayers[0].handle,
    localPokerLobby.game.communityCards,
    localPokerLobby.game.raised,
    localPokerLobby.game.bet )
    if (localPokerLobby.game.cycle === 4) {
        const winner = localPokerLobby.game.getWinner();
        socket.emit("updateBalance", winner.bananas);
        lobbyServer.in(localLobbyId + "poker").emit("playerWon", winner)
        setTimeout(() => {
            if (localPokerLobby.game.players.length > 1) {
                localPokerLobby.game.handleNewHand();
                lobbyServer.in(localLobbyId + "poker").emit("newGame",
                    localPokerLobby.game.players.map(player => {
                        return {
                            handle: player.handle,
                            bananas: player.bananas,
                            hand: player.hand,
                            bigBlind: player.bigBlind,
                            smallBlind: player.smallBlind,
                        }
                    }), localPokerLobby.game.currentPlayers[0].handle);
            }
        }, 10000)
        setTimeout(() => {
            if (localPokerLobby.game.players.length > 1) {
                lobbyServer.in(localLobbyId + "poker").emit("aboutToStart")
            } else {
                lobbyServer.in(localLobbyId + "poker").emit("needMorePlayers")
            }
        }, 7000)
    } 
  })

  socket.on("playerRaised", (username, amount) => {
      const currentPlayer = localPokerLobby.game.players[0];
    if (localPokerLobby.game.handleRaise(amount)) {
        socket.emit("updateBalance", currentPlayer.bananas);
        lobbyServer.in(localLobbyId + "poker").emit("playerRaised", 
        username, 
        amount,
        localPokerLobby.game.currentPlayers[0].handle,
        localPokerLobby.game.communityCards,
        localPokerLobby.game.raised, 
        localPokerLobby.game.bet )
        pokerGameOver();
    } else {
        socket.emit("alert", "You must enter a valid amount")
    }
  })

  socket.on("playerChecked", username => {
    localPokerLobby.game.handleCheck();
    lobbyServer.in(localLobbyId + "poker").emit("playerChecked",
        username,
        localPokerLobby.game.currentPlayers[0].handle,
        localPokerLobby.game.communityCards,
        localPokerLobby.game.raised,
        localPokerLobby.game.bet )
        pokerGameOver();

  })

  socket.on("playerFolded", username => {
    localPokerLobby.game.handleFold();
    lobbyServer.in(localLobbyId + "poker").emit("playerFolded",
        username,
        localPokerLobby.game.currentPlayers[0].handle,
        localPokerLobby.game.communityCards,
        localPokerLobby.game.raised,
        localPokerLobby.game.bet );
        pokerGameOver();

  })

  // bj
  socket.on("joinBJGame", (username, balance) => {

    socket.emit(
      "currentBJPlayers",
      localBJLobby.game.players.map(player => {
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

    localBJLobby.game.addPlayer(socket.id, username, balance)
    socket.join(localLobbyId + "bj")
    const player = localBJLobby.game.players[localBJLobby.game.players.length-1]
    lobbyServer.in(localLobbyId + "bj").emit("newBJPlayer", {
        userId: player.userId,
        pool: player.pool,
        poolSplit: player.poolSplit,
        balance: player.balance,
        hand: player.hand,
        handSplit: player.handSplit,
        handValue: player.getHandValue(),
        splitHandValue: player.getHandValue()
    }, localBJLobby.game.currentPhase, localBJLobby.game.players[0].userId )

 
  })

  socket.on("bet", (amount) => {
    if (localBJLobby.game.getBetFromCurrentTurn(amount)) {
        if (localBJLobby.game.currentPhase === "options") {
            const playerCards = {};
            localBJLobby.game.players.forEach(player => playerCards[player.userId] = player.hand)
            const dealerCards = localBJLobby.game.dealer.hand

            lobbyServer.in(localLobbyId + "bj").emit("dealPlayerCards", playerCards)
            lobbyServer.in(localLobbyId + "bj").emit("dealDealerCards", dealerCards)

            lobbyServer.in(localLobbyId + "bj").emit("changePhase", localBJLobby.game.currentPhase);
            lobbyServer.in(localLobbyId + "bj").emit("lastBetter", 
                localBJLobby.game.players[localBJLobby.game.players.length-1].userId,
                localBJLobby.game.players[localBJLobby.game.players.length - 1].balance)
            lobbyServer.in(localLobbyId + "bj").emit("changeTurn",
                localBJLobby.game.players[0].userId)
        } else {
            lobbyServer.in(localLobbyId + "bj").emit("changeTurn", 
                localBJLobby.game.players[0].userId)
        }
    } else {
        lobbyServer.in(localLobbyId + "bj").emit("betFailed")
    }
  })

  socket.on("playerHit", () => {
    localBJLobby.game.players[0].hit();
    const playerCards = {};
    // if (localBJLobby.game.players[0].bust) {
    if (localBJLobby.game.checkCurrentPlayerBust()) {
        // Switches to next player, since cCPB will run nextTurn if the current player 
        const player = localBJLobby.game.players[localBJLobby.game.players.length-1];
        playerCards[player.userId] = player.hand;
        lobbyServer.in(localLobbyId + "bj").emit("playerBust", player.userId)
        lobbyServer.in(localLobbyId + "bj").emit("changePhase", localBJLobby.game.currentPhase);
    } else {
        const player = localBJLobby.game.players[0];
        playerCards[player.userId] = player.hand;
        lobbyServer.in(localLobbyId + "bj").emit("playerHit", player.userId)
    }
    lobbyServer.in(localLobbyId + "bj").emit("dealPlayerCards", playerCards)
  })

    socket.on("dealerHit", () => {
        localBJLobby.game.dealerHit();
        const dealerHand = localBJLobby.game.dealer.hand;
        socket.emit("dealDealerCards", dealerHand)
        socket.emit("sendDealer", localBJLobby.game.dealer)
    })

    socket.on("payoutPlayers", () => {
        localBJLobby.game.compareHands();
        // Update player's balances on the front end 
        let playersObj = {};

        localBJLobby.game.players.forEach(player => {
            playersObj[player.userId] = player.balance;
        })

        socket.emit("updatePlayersBalance",
            playersObj
        )

        socket.emit("changePhase", localBJLobby.game.currentPhase);
    })

    let t = null;

    socket.on("newRound", () => {
        console.log("newRound is hit");
        lobbyServer.in(localLobbyId + "bj").emit("aboutToStart")
        socket.emit("resetBJGame")
        if (t === null) {
            t = setTimeout(() => {
                localBJLobby.game.resetGame()
                if (localBJLobby.game.players.length) {
                    socket.emit("changePhase", localBJLobby.game.currentPhase)
                    socket.emit("sendDealer", localBJLobby.game.dealer)
                    socket.emit("resetPlayers", null)
                    lobbyServer.in(localLobbyId + "bj").emit("changeTurn", localBJLobby.game.players[0].userId)
                    console.log(localBJLobby.game.players);
                }
                t = null;
            }, 5000)
        }
    })

  socket.on("playerStand", () => {
    localBJLobby.game.players[0].stand();
    localBJLobby.game.nextTurn();
    socket.emit("changeTurn", localBJLobby.game.players[0].userId)
    socket.emit("changePhase", localBJLobby.game.currentPhase);
    socket.emit("standOption", localBJLobby.game.players[0].userId)
  })

  //leave games

  socket.on("leavePokerGame", () => {
    socket.leave(localLobbyId + "poker");
    const pokerPlayer = localPokerLobby.game.getPlayerBySocketId(socket.id)
    if (pokerPlayer) {
        localPokerLobby.game.removePlayer(pokerPlayer)
        lobbyServer.in(localLobbyId + "poker").emit("removePlayer", pokerPlayer.handle)
        if (localPokerLobby.game.players.length === 0) {
            localPokerLobby.game = new PokerGame();
        } 
        pokerGameOver();
    }
  })

  socket.on("leaveBJGame", () => {
    socket.leave(localLobbyId + "bj")
    const bJPlayer = lobbiesCollection[localLobbyId].bJ.game.getPlayerBySocketId(socket.id)
    lobbiesCollection[localLobbyId].bJ.game.removePlayer(bJPlayer)
    if (!lobbiesCollection[localLobbyId].bJ.game.players.length) {
        lobbiesCollection[localLobbyId].bJ.game.resetGame();
    }
    lobbyServer.in(localLobbyId + "bj").emit("removePlayer", bJPlayer.userId)
    // emit method that removes player to all players still playing
  })


  //disconect
  socket.on("disconnect", () => {
    if (localLobbyId) {
        findLobbyByIdAndChangeCapacity(-1);
        delete lobbiesCollection[localLobbyId].players[socket.id]
        const bJPlayer = lobbiesCollection[localLobbyId].bJ.game.getPlayerBySocketId(socket.id)
        if (bJPlayer) {
            lobbiesCollection[localLobbyId].bJ.game.removePlayer(bJPlayer)
            lobbyServer.in(localLobbyId + "bj").emit("removePlayer", bJPlayer.userId)
            if (!lobbiesCollection[localLobbyId].bJ.game.players.length) {
                lobbiesCollection[localLobbyId].bJ.game.resetGame();
            }
        }
        const pokerPlayer = localPokerLobby.game.getPlayerBySocketId(socket.id)
        if (pokerPlayer) {
            localPokerLobby.game.removePlayer(pokerPlayer)
            lobbyServer.in(localLobbyId + "poker").emit("removePlayer", pokerPlayer.handle);
            if (localPokerLobby.game.players.length === 0) {
                localPokerLobby.game = new PokerGame();
            }
            pokerGameOver();
        }
      socket.to(localLobbyId).emit('removePlayerSprite', socket.id)
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
        
      
