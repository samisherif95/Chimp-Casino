export default class Player {
    constructor(userId, balance) {
        this.userId = userId;
        this.pool = 0;
        this.poolSplit = 0;
        this.balance = balance;
        this.doubleDown = false;
        this.split = false;
        this.hand = [];
        this.handSplit = [];
        this.stand = false;
        this.betted = false;
        this.bust = false;
    }

    getHandValue(hand) {
        let total = 0;

        hand.forEach(card => {
            if (Number.isInteger(card[0])) {
                total += card[0];
            } else if (card[0] !== "Ace") {
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
        if (this.balance - this.wager < 0) {
            return;
        }

        this.balance -= wager;
        this.pool += wager;
        this.betted = true;
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
        } else if (cardOne === "Ace" && cardTwo === "Ace") {
            return true;
        }

        return false;
    }

    hit(card) {
        this.hand.push(card);
        if (this.getHandValue(this.hand) > 21) {
            this.bust = true;
        }
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
            return;
        } else if (this.balance - this.pool < 0) {
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
            return;
        } else if (this.balance - this.pool < 0) {
            return;
        }

        this.balance -= this.pool;
        this.pool *= 2;
        this.doubleDown = true;
    }
}
