import Deck from '../cardDeck.js';

class Player {
    constructor(id) {
        // Variables
        this.id = id;
        this.pool = 0;
        this.balance = 1000;
        this.double = false;
        this.split = false; 
        this.hand = [];
        this.splitHand = [];
        this.win = false;

        // Functions
        this.getHandValue();
        this.bet();
        this.split();
        this.doubleDown();
    }

    getHandValue(hand) {
        let total = 0;

        hand.forEach( card => {
            if (card[0].isInteger()) {
                total += card[0];
            } else if (card[0] !== "Ace") {
                total += 10;
            } else {
                if (total + 11 > 21) {
                    total += 1 
                } else {
                    total += 11
                }
            }
        })

        return total;
    }

    bet(wager) {
        if (this.balance - this.wager < 0) {
            console.log('Wager too high!')
            return 
        }

        this.balance -= wager;
        this.pool += wager;
    }

    isFace(card) {
        const faceCard = ["Jack", "Queen", "King"]
        if (faceCard.includes(card)) {
            return true;
        }
        return false;
    }

    isDubs(hand) {
        const cardOne = hand[0][0]
        const cardTwo = hand[1][0]

        if (cardOne === cardTwo) {
            return true;
        } else if (isFace(cardOne) && isFace(cardTwo)) {
            return true;
        } else if (cardOne === "Ace" && cardTwo === "Ace") {
            return true;
        }

        return false;
    }

    split(hand) {
        if (!this.isDubs(hand)) {
            console.log("You cannot split this hand")
            return
        }

        this.split = true;

        const cardOne = hand[0][0]
        const cardTwo = hand[1][0]

        this.hand.push(cardOne);
        this.splitHand.push(cardTwo);
    }

    doubleDown() {
        if (this.balance - this.wager < 0) {
            console.log("You don't have enough funds to double down!")
            return
        }

        this.double = true;

        this.balance -= this.wager;
        this.wager += this.wager;
    }
}

class Blackjack {
    constructor() {
        this.deck = new Deck();
        this.dealer = new Player(0);
        this.players = [this.dealer];
    }

    addPlayer(playerId) {
        let player = new Player(playerId);
        this.players.push(player);
    }

    compareHands(player) {
        const dealerValue = this.dealer.getHandValue(this.dealer.hand);
        const playerValue = player.getHandValue(player.hand);

        if (dealerValue > 21 && playerValue <= 21) {
            player.win = true;
            // return console.log("Player wins");
        } else if (playerValue > 21 && dealerValue <= 21) {
            this.dealer.win = true;
            // return console.log("Dealer wins")
        } else if (playerValue === dealerValue) {
            player.win = true;
            this.dealer.win = true; 
            // return console.log("Split the pot")
        } else if (playerValue > dealerValue)
            
        if () > ) {
            console.log('Dealer wins')
        } 
    }

    

    //Compare hands with anyone that beat the dealer. Unless dealer has heighest card and everyone has a lose condition.
    //Split pot or give pot to winner
}