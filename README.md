# Chimp-Casino
A casino game where chimps can deal with monkey business

![Chimp Casino Demo](chimps-casino.gif)


## Lobbies

The lobby is our basic CRUD feature of this application; it can be made with an optional password if users do not wish strangers joining it. Upon creating a lobby, other users can readily see it within the lobbies index and joining it brings you to an instanced casino lobby where you can now interact with other users. 


The casino room model itself was done by bringing together many unrelated images and positioning them in various locations to resemble a casino. The library that was responsible for rendering everything/taking care of sprite animations and object collisions (that we used to create games opening upon collision) was phaser. The live updating of other players' sprites was done by using socket.io logic. The instances of all our lobbies and players in our backend is stored in a javascript object known as lobbiesCollection. Upon entering the lobby, in order for live player interaction, three things needed to happen: 

* 1. The new player has to be added to the players object within lobbiesCollection so future socket.emits will be sent to them
* 2. Existing players within the lobby had to be notified of the new players existance
* 3. The new player had to be sent an object containing all existing players' information to render them

Once these two conditions were fulfilled, getting the players' locations to update live as they moved them was simple, any time a player moves, send over their new positional information to the server, and have the server broadcast the new position to all the other players.

