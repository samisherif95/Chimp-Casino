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

On the front end the poker table is rendered using images and CSS to position everything in exact locations so when the game starts, it will seem as professional as possible. The game loops over each player and it is visible to all player whose turn it is by changing that players name to gold to acknowledge its that players turn.

![PokerDemo](https://github.com/samisherif95/Chimp-Casino/blob/master/frontend/public/pokerDemo.png)

### sample of hand algorithms
![PokerDemo](https://github.com/samisherif95/Chimp-Casino/blob/master/frontend/public/pokerCodeaSample.png)

## Blackjack
In this implementation of blackjack, players play against the house and have the option of either hitting during their respective turn. Players are joined within an instance of a game via WebSockets, which not only facilitates the game logic but also aids in rendering the game. 

A major problem we encountered when implementing blackjack was solving for how players would be joined up together using WebSockets. Originally, the idea was to have a JavaScript game logic class facilitate all of the game logic. In this blackjack game logic class would include the table and an array of player classes, the actual game implementation logic, a dealer player class, and a deck class. However we realized that this would be a problem as each user would end up having their own instance of this game logic class running, and so we came up with a couple creative solutions. 
* 1. Having the first player "host" the game logic class and have following players join in on the first player's game logic's player array. The following players joined would then just need to have their balance and username taken into account to add to the table roster. While this seemed like an easy solution to implement with WebSockets, problems arise when the "host" leaves and the logic of handing off hosting proved to be more of a problem than a solution.
* 2. Having the game logic class be created within the the actual blackjack game's WebSocket instance. This solution involved a lot more refactoring, but turned out to be the answer to our problem. In having the blackjack game logic within the WebSocket instance, we can easily, directly connect each player to their respective blackjack instance. In addition, this integrated nicely with our front end game rendering for blackjack, as we were able to take advantage of WebSocket's emits in order to aptly synchronize game logic between players.

