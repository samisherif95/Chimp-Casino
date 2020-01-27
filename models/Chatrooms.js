const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ChatRoomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);