# Chimp-Casino
A casino game where chimps can deal with monkey business

![Chimp Casino Demo](demos/chimps-casino.gif)


## Lobbies

The lobby is our basic CRUD feature of this application; it can be made with an optional password if users do not wish strangers joining it. Upon creating a lobby, other users can readily see it within the lobbies index and joining it brings you to an instanced casino lobby where you can now interact with other users. 


The casino room model itself was done by bringing together many unrelated images and positioning them in various locations to resemble a casino. The library that was responsible for rendering everything/taking care of sprite animations and object collisions (that we used to create games opening upon collision) was phaser. The live updating of other players' sprites was done by using socket.io logic. The instances of all our lobbies and players in our backend is stored in a javascript object known as lobbiesCollection. Upon entering the lobby, in order for live player interaction, three things needed to happen: 

* 1. The new player has to be added to the players object within lobbiesCollection so future socket.emits will be sent to them
* 2. Existing players within the lobby had to be notified of the new players existance
* 3. The new player had to be sent an object containing all existing players' information to render them

Once these two conditions were fulfilled, getting the players' locations to update live as they moved them was simple, any time a player moves, send over their new positional information to the server, and have the server broadcast the new position to all the other players.

## Slots

## Poker
Poker is one of the most loved and famous game of any casino, so it seemed only right to implement it into our game.
This version of poker is Texas Hold'em where each player is dealt two cards and then the betting round begins. In order to do this
a card class was created that contains a deck of 52 distinct cards that deals the cards to each player and through sockets we connected  this deck to all the players in the game so that all players have cards of the same deck and so that they can all see they same community cards. After all the players have checked on the final betting phase each player cards are added to an array with the 5 community cards and that have been played and are passed through a scoring algorithm to determine the hand score.
Once each player is assigned score all the players that havent folded will have their scores compared and the player with the highest score wins.
![PokerDemo](https://github.com/samisherif95/Chimp-Casino/blob/master/frontend/public/pokerDemo.png)

### sample of hand algorithms


## Blackjack

