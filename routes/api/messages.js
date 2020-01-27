const express = require('express');
const router = express.Router();
const validateMessage = require('../../validation/message');
const Message = require('../../models/Messages');


router.post('/', (req, res) => {
    const { errors, isValid } = validateMessage(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const newMessage =  new Tweet({
        text: req.body.text,
        authorId: req.body.authorId,
        chatroomId: req.body.chatroomId
    })    

    newMessage.save()
        .then(message => res.json(message))
})

module.exports = router;
