class Deck {
    constructor() {
        this.deck = [];
        this.reset();
        this.shuffle();
    }

    reset() {
        this.deck = [];

        const suits = ['H', 'S', 'C', 'D'];
        const values = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];

        for(let i=0; i < suits.length; i++){
            for(let j = 0; j< values.length; j++){
                let cardName = [values[j],suits[i]].join('')
                this.deck.push([values[j],suits[i],cardName])
            }
        }
    }

    shuffle() {
        const { deck } = this;
        let m = deck.length, i;

        while (m) {
            i = Math.floor(Math.random() * m--);
            [deck[m], deck[i]] = [deck[i], deck[m]];
        }

        return this;
    }

    deal() {
        return this.deck.pop();
    }

    length(){
        return this.deck.length();
    }
}

export default Deck