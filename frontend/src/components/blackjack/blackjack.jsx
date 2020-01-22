import React from 'react'
import Blackjack from '../blackjack/blackjack';

class Blackjack extends React.Component {
    constructor(props) {
        super(props);
        const blackjack = new Blackjack();

        this.state = {
            players: blackjack.players,
            dealer: blackjack.dealer,
            deck: blackjack.deck,
            bettingPhase: false,
            dealingPhase: false,
            naturalsPhase: false,
            optionsPhase: false,
            dealerPhase: false,
            payoutPhase: false
        }
    }



    render() {
        return (
            <div>
                
            </div>
        )
    }
}

export default Blackjack
