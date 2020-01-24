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
    default: 16
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