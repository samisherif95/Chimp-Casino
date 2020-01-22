import Deck from '../cardDeck.js';

export class Player {
    constructor(userId, balance) {
        // Variables to create on creation
        this.userId = userId;
        this.pool = 0;
        this.poolSplit = 0;
        this.balance = balance;
        this.doubleDown = false;
        this.split = false; 
        this.hand = [];
        this.handSplit = [];
        this.stand = false;
        this.bet = false;

        // Functions to run on creation

    }

    getHandValue(hand) {
        let total = 0;

        hand.forEach( card => {
            if (Number.isInteger(card[0])) {
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
            console.log("Wager too high!");
            return;
        }

        this.balance -= wager;
        this.pool += wager;
        this.bet = true;
    }

    isFace(card) {
        const faceCard = ["Jack", "Queen", "King"]
        if (faceCard.includes(card[0])) {
            return true;
        }
        return false;
    }

    isDubs(hand) {
        const cardOne = hand[0][0]
        const cardTwo = hand[1][0]

        if (cardOne === cardTwo) {
            return true;
        } else if (this.isFace(cardOne) && this.isFace(cardTwo)) {
            return true;
        } else if (cardOne === "Ace" && cardTwo === "Ace") {
            return true;
        }

        return false;
    }

    hit(card) {
        this.hand.push(card);
    }

    hitSplit(card) {
        this.handSplit.push(card);
    }

    stand() {
        this.stand = true;
    }

    // Caveat: Split aces can only be hit once per hand and the payoff for a blackjack (A + 10) at this point is 
    // 2x their bet; not 1.5x (the usual amount for a natural blackjack)

    // Otherwise, each split hand now have their own separate pool and will be treated individually
    splitHand() {
        if (!this.isDubs(this.hand)) {
            console.log("You cannot split this hand")
            return
        } else if (this.balance - this.pool < 0) {
            console.log("You can't afford this!")
            return
        }

        this.split = true;
        this.poolSplit = this.pool;
        this.balance -= this.poolSplit;

        this.handSplit.push(this.hand.pop());
    }

    // Caveat: Doubled down hands are only given one additional hit, which isn't to be revealed until
    // AFTER the player has placed a bet and during 
    doubleDownHand() {
        if (![9, 10, 11].includes(this.getHandValue(this.hand))) {
            console.log("You cannot double down on this hand")
            return
        } else if (this.balance - this.pool < 0) {
            console.log("You can't afford this!")
            return
        }

        this.balance -= this.pool;
        this.pool *= 2;

        this.doubleDown = true;
    }
}

export class Blackjack {
    // Integerate "Insurance later?"

    // Blackjack structure :
    // 1. Betting Phase. Each player puts down a wager
    // 2. Dealing Phase. Each player given two cards face up and dealer given one card face down and another face up
    // 3. Naturals Phase. Natural blackjacks payouts are dealt and a player either stays in the round or leaves 
            // - if dealer has a natural blackjack, the round is over
            // - if dealer !== natural && if player has a natural blackjack, they're out of the runnings and pool = 0
    // 4. Options Phase. Players go down the line and determine their options
            // Hit. Player gets dealt a card and determine new hand value. Can continually do this until bust or choose to stand 
            // Split
            // Double down
            // Stand. Player happy with current hand and end their turn
    // 5. Dealer Phase. Dealer keeps hitting until their hand value is greater than or equal to 17
            // Dealer must count aces as an 11
            // If a dealer busts, they must pay out each player still in the running the amount of their bet.
    // 6. Payout Phase. Players still in the running (pool > 0) go up against the dealer
            // If a player wins, they're paid out the total of their pool money + pool money back
            // If a player loses, their pool money is taken away

    constructor() {
        this.deck = new Deck();
        this.dealer = new Player("dealer", 10000000);
        this.players = [];
    }

    addPlayer(playerId, balance) {
        this.players.push(new Player(playerId, balance));
    }

    dealCards() {
        for (let i = 0; i < 2; i++) {
            this.dealer.hand.push(this.deck.deal());
            this.players.forEach(player => {
                player.hand.push(this.deck.deal());
            });
        }
    }

    hit(player) {
        player.hit(this.deck.deal())
        if (player.getHandValue(player.hand) > 21) {
            console.log("User has bust!");
            player.pool = 0; 
        }
    }

    hitSplit(player) {
        player.hitSplit(this.deck.deal());
        if (player.getHandValue(player.handSplit) > 21) {
          console.log("User has bust!");
          player.poolSplit = 0;
        }
    }


    // Called on after the hands are dealt and after the initial betting phase and
    // before the player options phase
    naturalBlackjack() {
        // In the case that dealer does not have a natural
        if (this.dealer.getHandValue(this.dealer.hand) !== 21) {
            this.players.forEach(player => {
            // If the player has a natural blackjack and dealer does not,
            // they're automatically paid out 1.5x their pool and
            // are out of the runnings for the current round.
                if (player.getHandValue(player.hand) === 21) {
                    player.pool *= 1.5;
                    player.balance += player.pool;
                    player.pool = 0;
                }
            });
        // In the case that dealer has a natural. They round is over
        } else if (this.dealer.getHandValue(this.dealer.hand) === 21) {
        this.players.forEach(player => {
            if (player.getHandValue(player.hand) < 21) {
                // In the case that player does not have a natural, they lose their wager
                player.pool = 0;
            } else if (player.getHandValue(player.hand) === 21) {
                // In the case that player and dealer have naturals, neither party collect
                player.balance += player.pool;
                player.pool = 0;
            }
        });
        }
    }

    // dealerHit and dealerBust are called on during the 
    dealerBust() {
        console.log("Dealer has bust! Every player standing wins!");
        this.players.forEach(player => {
            if (player.pool !== 0) {
                player.balance += (player.pool * 2);
                player.pool = 0;
            }

            if (player.split && player.poolSplit !== 0) {
                player.balance += (player.poolSplit * 2);
                player.poolSplit = 0;
            } 
        });
    }

    dealerHit() {
        let dealerHand = this.dealer.getHandValue(this.dealer.hand);

        while (dealerHand < 17) {
            this.dealer.hand.push(this.deck.deal());

            if (dealerHand > 21) {
                return this.dealerBust();
            }
        }
    }

    // This is called on after natural blackjacks have been paid out, and after the 
    // Player Options phase. Any players left standing are compared to the dealer's card. 

    // Iterate though each player, checking to see if each player has a .split and .double boolean 
    // before paying out the player. 
    compareHands() {
        const dealerValue = this.dealer.getHandValue(this.dealer.hand);

        this.players.forEach(player => {
            const playerValue = player.getHandValue(player.hand);

            if (player.pool !== 0) {
                if (playerValue === dealerValue) {
                    player.balance += player.pool;
                    player.pool = 0;
                } else if (playerValue > dealerValue) {
                    player.balance += (player.pool * 2);
                    player.pool = 0;
                } else if (playerValue < dealerValue) {
                    player.pool = 0;
                }
            }

            if (player.split && player.poolSplit !== 0) {
                const playerSplitValue = player.getHandValue(player.handSplit);

                if (playerSplitValue === dealerValue) {
                    player.balance += player.poolSplit;
                    player.poolSplit = 0;
                } else if (playerSplitValue > dealerValue) {
                    player.balance += (player.poolSplit * 2);
                    player.poolSplit = 0;
                } else if (playerSplitValue < dealerValue) {
                    player.poolSplit = 0;
                }
            }
        });
    }

    // startGame() {
    //     if (this.players.length === 0) {
    //         console.log("Waiting on players to start!")
    //         return
    //     }

    //     while (this.dealer.stand === false) { 
    //         this.players.forEach( player => {
    //             while (player.bet === false) {
                    
    //             }
            
    //         })
    //     }
    // }
}

// const bj = new Blackjack();
// bj.addPlayer(1, 500);
// bj.addPlayer(2, 500);
// bj.addPlayer(3, 500);

// bj.players[0].bet(250)
// bj.players[1].bet(250)
// bj.players[2].bet(250)

// bj.dealer.hand = [['Ace', 'Hearts'],[9, 'Hearts']]
// bj.players[0].hand = [['Queen', 'Hearts'], ['Ace', 'Spades']];
// bj.players[1].hand = [[9, 'Hearts'], ['King', 'Hearts']];
// bj.players[2].hand = [[8, 'Hearts'], ['King', 'Hearts'], [2, 'Spades']];
