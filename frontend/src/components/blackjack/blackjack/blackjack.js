
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
        this.dealer = new Player("dealer", 10000000, this.deck);
        this.players = [];
        this.playersQueue = [];
        this.cycle = 0;
        
        this.finishedCycle = false;
        this.roundDone = false;
        
        this.currentPhase = 'waiting'
    }

    currentTurnId() {
        return this.players[0].id 
    }

    checkAllBust() {
        let allBust = true;

        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].stood === true) {
                allBust = false; 
                break
            } else {
                if (this.players[i].split && (!this.players[i].bust || !this.players[i].bustSplit)) {
                    allBust = false;
                    break
                } else if (!this.players[i].bust) {
                    allBust = false;
                    break
                }
            }
        }

        if (allBust) { 
            this.currentPhase = 'waiting';
            this.resetGame();
            return allBust;
        }
        return allBust;
    }

    checkCurrentPlayerBust() {
        if (this.players[0].bust === true && this.players[0].handSplit.length === 0) {
            this.nextTurn();
            console.log("bust on regular hand")
            return true;
        } else if (this.players[0].bustSplit === true) {
            this.nextTurn();
            console.log("bust on split")
            return true;
        }
        return false;
    }

    checkCurrentPlayerStand() {
        if (this.players[0].stood === true) {
            console.log("stand")
            this.nextTurn();
        }
    }

    checkDealerStood() {
        if (this.dealer.stood) {
            return true;
        }
        return false;
    }

    // Implement this in the FE
    checkRoundDone() { 
        if (this.roundDone) {
            this.currentPhase = 'waiting';
            this.resetGame();
            return true;
        }
        return false;
    }

    // In the back end, after each 'round done' you would just trigger the
    // checkRoundDone function
    resetGame() {
        this.currentPhase = 'waiting'
        this.deck = new Deck();
        this.dealer = new Player('dealer', 10000000, this.deck);
        let dupePlayers = this.players.slice()
        this.players = []
        dupePlayers.forEach(player => {
            this.addPlayer(player.userId, player.balance);
        });
        this.cycle = 0;
        this.finishedCycle = false;
        this.roundDone = false;
    }

    checkDone(player) {
        let done = true;

        if (player.stood === false) {
            if (player.split) {
                if (!player.bust || !player.bustSplit) {
                    done = false;
                }
            } else if (!player.bust) {
                done = false;
            }
        }

        return done
    }

    nextTurn() {
        // Reset the game cycle
        this.finishedCycle = false;
        // This keeps track if everyone has gone
        this.players.push(this.players.shift());
        this.cycle += 1 
        if (this.cycle === this.players.length) {
            console.log("full cycle has completed");
            this.cycle = 0;
            this.finishedCycle = true;
            
            // If every player's betted, transition the phase
            if (this.players.every(player => { return this.checkDone(player) })) {
                this.currentPhase = 'dealer'
            } else if (this.players.every(player => { return player.betted === true })) {
                this.currentPhase = 'options'
            }

            // Add logic to options phase completion 
        }
    }

    getBetFromCurrentTurn(wager) {
        if (this.players[0].bet(wager)) {
            this.nextTurn();
            return true;
        }
        console.log("cannot!")
        return false;
    }

    addPlayer(playerId, balance) {
        if (this.players.length > 7) {
            console.log("Table full, too many players!")
        } else if (!['waiting', 'betting'].includes(this.currentPhase)) {
            console.log("Please wait until the next round")
            this.playersQueue.push(new Player(playerId, balance, this.deck)); 
        } else {
            this.players.push(new Player(playerId, balance, this.deck));
            if (this.players.length === 1) {
                this.currentPhase = 'betting'
            }
        }
    }

    dealCards() {
        for (let i = 0; i < 2; i++) {
            this.dealer.hand.push(this.deck.deal());
            for (let j = 0; j < this.players.length; j++) {
                this.players[j].hand.push(this.deck.deal());
            }
        }
    }

    // Called on after the hands are dealt and after the initial betting phase and
    // before the player options phase
    naturalBlackjack() {
        // In the case that dealer does not have a natural
        if (this.dealer.getHandValue(this.dealer.hand) !== 21) {
            // Dealer keeps cards face down 
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
            // Dealer must flip cards 
            this.players.forEach(player => {
                if (player.getHandValue(player.hand) < 21) {
                    // In the case that player does not have a natural, they lose their wager and are out
                    player.pool = 0;
                } else if (player.getHandValue(player.hand) === 21) {
                    // In the case that player and dealer have naturals, neither party collect
                    player.balance += player.pool;
                    player.pool = 0;
                }
            });
            console.log("Round over!")
            this.roundDone = true;
            this.currentPhase = 'waiting'
        }
    }

    // dealerHit and dealerBust are called on AFTER each player has gomne
    // through their options phase 
    dealerBust() {
        console.log("Dealer has bust! Every player standing wins!");
        this.players.forEach(player => {
            if (player.stood === true) {
                if (player.pool !== 0) {
                    player.balance += (player.pool * 2);
                    player.pool = 0;
                }

                if (player.split && player.poolSplit !== 0) {
                    player.balance += (player.poolSplit * 2);
                    player.poolSplit = 0;
                } 
            }
        });
        console.log("Round over!")
        this.roundDone = true;
    }

    dealerHit() {
        let dealerHand = this.dealer.getHandValue(this.dealer.hand);

        while (dealerHand < 17) {
            console.log('dealer hitting')
            this.dealer.hit();

            dealerHand = this.dealer.getHandValue(this.dealer.hand)
            if (dealerHand > 21) {
                this.dealer.bust = true;
                return this.dealerBust();
            }
        }

        console.log("dealer stood")
        this.dealer.stood = true;
        this.currentPhase = 'payout'
    }

    // This is called on after natural blackjacks have been paid out, and after the 
    // Player Options phase. Any players left standing are compared to the dealer's card. 

    // Iterate though each player, checking to see if each player has a .split and .double boolean 
    // before paying out the player. 
    compareHands() {
        console.log("Comparing hands!")
        const dealerValue = this.dealer.getHandValue(this.dealer.hand);

        this.players.forEach(player => {
            if (player.stood === true) {
                const playerValue = player.getHandValue(player.hand);

                if (player.pool !== 0) {
                    if (playerValue === dealerValue) {
                        player.balance += player.pool;
                        player.pool = 0;
                        console.log("player has tied with dealer")
                    } else if (playerValue > dealerValue) {
                        player.balance += (player.pool * 2);
                        player.pool = 0;
                        console.log("player wins!")
                    } else if (playerValue < dealerValue) {
                        player.pool = 0;
                        console.log("player loses")
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
            }
        });
        console.log("Round over!")
        this.roundDone = true;    
        this.currentPhase = 'waiting';
    }
}

export class Deck {
    constructor() {
        this.deck = [];
        this.reset();
        this.shuffle();
    }

    reset() {
        this.deck = [];

        const suits = ["H", "S", "C", "D"];
        const values = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];

        for (let i = 0; i < suits.length; i++) {
            for (let j = 0; j < values.length; j++) {
                this.deck.push([values[j], suits[i]]);
            }
        }
    }

    shuffle() {
        const { deck } = this;
        let m = deck.length,
        i;

        while (m) {
            i = Math.floor(Math.random() * m--);
            [deck[m], deck[i]] = [deck[i], deck[m]];
        }

        return this;
    }

    deal() {
        return this.deck.pop();
    }

    length() {
        return this.deck.length();
    }
}

export class Player {
    constructor(userId, balance, deck) {
        this.deck = deck;
        this.userId = userId;
        this.pool = 0;
        this.poolSplit = 0;
        this.balance = balance;
        this.doubleDown = false;
        this.split = false;
        this.hand = [];
        this.handSplit = [];
        this.stood = false;
        this.stoodSplit = false;
        this.betted = false;
        this.bust = false;
        this.bustSplit = false;
    }

    getHandValue(hand) {
        let total = 0;

        hand.forEach(card => {
            if (Number.isInteger(card[0])) {
                total += card[0];
            } else if (card[0] !== "A") {
                total += 10;
            } else {
                if (total + 11 > 21) {
                    total += 1;
                } else {
                    total += 11;
                }
            }
        });

        return total;
    }

    bet(wager) {
        if (this.balance - wager < 0) {
            console.log("Wager too high!");
            return false;
        } else if (wager === 0) {
            console.log("Must have a wager")
            return false;
        } else {
            this.balance -= wager;
            this.pool += wager;
            this.betted = true;
            return true;
        }
    }

    isFace(card) {
        const faceCard = ["J", "Q", "K"];
        if (faceCard.includes(card[0])) {
            return true;
        }
        return false;
    }

    isDubs(hand) {
        const cardOne = hand[0][0];
        const cardTwo = hand[1][0];

        if (cardOne === cardTwo) {
            return true;
        } else if (this.isFace(cardOne) && this.isFace(cardTwo)) {
            return true;
        } else if (cardOne === "A" && cardTwo === "A") {
            return true;
        }

        return false;
    }

    hit() {
        this.hand.push(this.deck.deal());
        if (this.getHandValue(this.hand) > 21) {
            this.bust = true;
            console.log("player has busted!");
        }
    }

    hitSplit() {
        this.handSplit.push(this.deck.deal());
        if (this.getHandValue(this.handSplit) > 21) {
            this.bustSplit = true;
            console.log("player has busted!");
        }
    }

    stand() {
        if ((this.bust && this.split) || this.stood) {
            this.stoodSplit = true;
        } else {
            this.stood = true;
        }
    }

    // Caveat: Split aces can only be hit once per hand and the payoff for a blackjack (A + 10) at this point is
    // 2x their bet; not 1.5x (the usual amount for a natural blackjack)

    // Otherwise, each split hand now have their own separate pool and will be treated individually
    splitHand() {
        if (!this.isDubs(this.hand)) {
            console.log("You cannot split this hand");
            return;
        } else if (this.balance - this.pool < 0) {
            console.log("You can't afford this!");
            return;
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
            console.log("You cannot double down on this hand");
            return;
        } else if (this.doubleDown === true) {
            console.log("You've already double down on this hand")
            return;
        } else if (this.balance - this.pool < 0) {
            console.log("You can't afford this!");
            return;
        }

        this.balance -= this.pool;
        this.pool *= 2;
        this.doubleDown = true;
    }
}
