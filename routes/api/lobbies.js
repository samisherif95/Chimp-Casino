const express = require("express");
const router = express.Router();
const Lobby = require("../../models/Lobby");
const passport = require("passport");

//index, post, delete

router.get("/test", (req, res) => {
    res.json({ msg: "this is the lobbies route" });
  });

router.post("/", (req, res) => {
    const newLobby = new Lobby({
        lobbyName: req.body.lobbyName,
        password: req.body.password,
        maxCapacity: req.body.maxCapacity,
        balanceLimit: req.body.balanceLimit,
    })

    newLobby.save().then(lobby => res.json(lobby))
});

router.get("/", (req, res) => {
    Lobby
        .find()
        .then(lobbies => res.json(lobbies))
        .catch(err =>
            res.status(404).json({ noLobbiesFound: "No lobbies found"})
            )
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    password: req.user.password
  });
})

module.exports = router;




