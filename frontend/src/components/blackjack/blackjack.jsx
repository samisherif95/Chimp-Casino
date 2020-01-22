import React from 'react'
import Blackjack from '../blackjack/blackjack';
import Player from './player';

class Blackjack extends React.Component {
    constructor(props) {
        super(props);
        this.blackjack = new Blackjack();
        this.state = {
            players: this.blackjack.players,
            dealer: this.blackjack.dealer,
            deck: this.blackjack.deck,
            bettingPhase: false,
            dealingPhase: false,
            naturalsPhase: false,
            optionsPhase: false,
            dealerPhase: false,
            payoutPhase: false
        }
    }

    componentDidMount() {
        this.startGame();

        if (this.state.bettingPhase) {
            this.setState({bettingPhase: false, dealingPhase: true})
        } else if (this.state.dealingPhase) {
            this.setState({dealingPhase: false, naturalsPhase: true})
        } else if (this.state.naturalsPhase) {
            this.setState({naturalsPhase: false, optionsPhase: true})
        } else if (this.state.optionsPhase) {
            this.setState({optionsPhase: false, dealerPhase: true}) 
        } else if (this.state.dealerPhase) {
            this.setState({dealerPhase: false, payoutPhase: true})
        } else if (this.state.payoutPhase) {
            this.setState({payoutPhase: false})
        }
    }

    startGame() {
        this.setState({bettingPhase: true});
    }

    addPlayer(playerId, balance) {
        this.blackjack.addPlayer(playerId, balance);
    }

    render() {
        const { bettingPhase, dealingPhase, naturalsPhase, optionsPhase, dealerPhase, payoutPhase } = this.state;
        const { dealer } = this.state;

        const { currentUser } = this.props;

        let render;

        if (bettingPhase) {
            render = (
                <div>
                    <form onSubmit={}>
                        <input type="text"/>
                    </form>
                </div>
            )
        } else if (dealingPhase) {

        } else if (naturalsPhase) {

        } else if (optionsPhase) {
             
        } else if (dealerPhase) {
            
        } else if (payoutPhase) {

        }

        let players = (this.players.length !== 0 ? 
            this.players.map( player => {
                return (
                    <li>
                        <Player player={player} />
                    </li>
                )
            }) : <li> No chimps sitting </li>)
            
        
        return (
            <div className="blackjack">
                <div className="dealer-info">
                    { dealer.hand }
                </div>
                <div className="players-info">
                    <ul>
                        {players}
                    </ul>
                </div>

                {/* 
                    Render some kind of additional board logic ? 
                    Maybe include some kind of score counter for each hand ? 
                */}

                {render}
            </div>
        )
    }
}

export default Blackjack
