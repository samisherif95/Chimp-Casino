const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const LobbySchema = new Schema({
  lobbyName: {
    type: String,
    required: true
  },
  password: {
    type: String,
  },
  maxCapacity: {
    type: Number,
    default: 12
  },
  currentCapacity: {
    type: Number,
    default: 0
  },
  balanceLimit: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Lobby = mongoose.model("Lobby", LobbySchema);