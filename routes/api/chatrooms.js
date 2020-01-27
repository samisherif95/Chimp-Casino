const express = require('express');
const router = express.Router();
const validateChatroom = require('../../validation/chatroom');
const Chatroom = require('../../models/Chatrooms');


router.post('/', (req, res) => {
    const {errors, isValid} = validateChatroom(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }

    Chatroom.findOne({name: req.body.name}).then(chatroom => {
        if(chatroom){
            errors.name = 'Chartroom name already in user'
        } else {
            const newChatroom = new Chatroom({
                name: req.body.name
            });

            newChatroom.save()
                .then(chatroom => res.json(chatroom))                
        }
    })
})

module.exports = router;
