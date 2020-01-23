const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const MessagesSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    authorId: {
        type: Number,
        required: true
    },
    chatroomId: {
        type: Number,
        default: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Messages = mongoose.model("Messages", MessagesSchema);