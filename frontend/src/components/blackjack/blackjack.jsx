import React from 'react'
import * as GameLogic from '../../blackjack/blackjack';
import Player from './player';

// Remember to change the start playing onClick back over to the login screen //

class Blackjack extends React.Component {
    constructor(props) {
        super(props)
        const blackjack = new GameLogic.Blackjack();
        this.state = {
            blackjack: blackjack,
            bettingPhase: false,
            dealingPhase: false,
            naturalsPhase: false,
            optionsPhase: false,
            dealerPhase: false,
            payoutPhase: false,
            betAmount: 0,
        };
        this.addPlayer = this.addPlayer.bind(this);
        this.getBet = this.getBet.bind(this);
        this.dealCards = this.dealCards.bind(this);
        this.updateBlackjack = this.updateBlackjack.bind(this);

        window.state = this.state;
        window.addPlayer = this.addPlayer;
        window.blackjack = this.state.blackjack;
        window.getBet = this.getBet;
        window.dealCards = this.dealCards;
    }

    componentDidUpdate(prevProps, prevState) {
        this.gameLoop()
    }

    //Get current player id. Goes into game, gets zeroth index 
    gameLoop() {
        const { bettingPhase, dealingPhase, naturalsPhase, optionsPhase, dealerPhase, payoutPhase } = this.state;
        const { blackjack: { players }} = this.state;

        debugger 
        // Do switch logic and have certain conditions checks on each page to do a setState({phase: 'some phase'})
        if (players.length > 0) {
            if (bettingPhase === false &
                (players.some(player => player.betted === false))) {
                    console.log("betting phase");
                    this.setState({ bettingPhase: true });
            } else if (
                (dealerPhase === false &&
                optionsPhase === false && 
                dealingPhase === false && 
                naturalsPhase === false && 
                players.some(player => player.betted === false) === false)) {
                    console.log("dealing phase");
                    this.setState({ bettingPhase: false, dealingPhase: true });
            } else if (
                (optionsPhase === false && 
                naturalsPhase === false && 
                (players.some( player => player.hand.length !== 2 )) === false)) {
                    console.log("naturals phase");
                    this.setState({ dealingPhase: false, naturalsPhase: true });
            } else if (
                optionsPhase === false && 
                naturalsPhase === true && 
                ((players.some( player => player.naturalsDone === false) === false))) {
                    console.log("options phase");
                    this.setState({ naturalsPhase: false, optionsPhase: true });
            } else if (dealerPhase === false && optionsPhase === true && this.optionsDone()) {
                    console.log("dealer phase");
                    this.setState({ optionsPhase: false, dealerPhase: true });
            } else {
                console.log("No game loop hit");
            }
            
        }
    }

    addPlayer(playerId, balance) {
        this.state.blackjack.addPlayer(playerId, balance);
        this.updateBlackjack();
    }

    getBet(wager) {
        this.state.blackjack.getBetFromCurrentTurn(wager);
        this.updateBlackjack();
    }

    update(field) {
        return e => this.setState({ [field]: e.currentTarget.value });
    }

    dealCards() {
        this.state.blackjack.dealCards();
    }

    checkNaturals() {
        this.state.blackjack.naturalBlackjack();
    }

    checkCurrentPlayerBust() {
        // Checks to see if the current player's hand AND handSplit has busted,
        // Will jump to the next player if so
        this.state.blackjack.checkCurrentPlayerBust();
    }

    checkCurrentPlayerStand() {
        // Checks to see if the current player has stood
        // Will jump to the next player if so
        this.state.blackjack.checkCurrentPlayerStand();
    }

    handleBetSubmit(e) {
        e.preventDefault();
        this.state.blackjack.getBetFromCurrentTurn(e.currentTarget);
    }

    updateBlackjack() {
        // Rerenders the FE blackjack board to reflect the BE blackjack board
        this.setState({blackjack: this.state.blackjack});
    }

    optionsDone() {
        // Returns true or false based on whether or not your options phase is done 
        // let done = true; 
        // this.state.blackjack.players.forEach( player => {
        //     if (player.stood === false) {
        //         if (player.split) {
        //             if (!player.bust || !player.bustSplit) {
        //                 done = false;
        //             }
        //         } else if (!player.bust) {
        //             done = false;
        //         }
        //     }
        // })
        // return done
        return this.state.blackjack.finishedCycle;
    }

    dealerHit() {
        this.state.blackjack.dealerHit();
    }

    render() {
        const {
            bettingPhase,
            dealingPhase,
            naturalsPhase,
            optionsPhase,
            dealerPhase,
            payoutPhase,
            blackjack
        } = this.state;

        const { players, dealer } = blackjack;
        const { currentUser } = this.props; 

        // Must keep track of current player's turn. Only ever going to be rendering logic for one player.
        // If not the current turn, don't do anything. The server will keep track of whose turn it is, but it's up to your 
        // component's job to render what is shown to the current player 

        // Don't need to cycle through the players. KEep track of the current player's turn in the state. 
        // In rendering, reflect on 

        let render;

        if (bettingPhase) {
            // Edit 2.0: Maybe not necessary, sent getBet function down as a prop for the 
            // Player Component. Maybe transfer this form into the player component and 
            // on submit, trigger the getBet on the amount wagered 

            // keep track of whose turn to bet
            if (blackjack.currentTurnId === currentUser.id) {
                render = (
                <div className="blackjack-betAmount">
                    <form onSubmit={this.handleBetSubmit}>
                    <input
                        type="text"
                        value={this.state.betAmount}
                        onChange={this.update("betAmount")}
                    />
                    </form>
                </div>
                );
            } else {
                render = (
                    <div>
                        Not your turn 
                    </div>
                )
            }
        } else if (dealingPhase) {
            render = (
                <div>
                    Cards are being dealt!
                </div>
            )
            {this.dealCards()}
        } else if (naturalsPhase) {
            render = (
                <div>
                    Checking for any naturals and paying out 
                </div>
            )
            {this.checkNaturals()}
        } else if (optionsPhase) {
            {this.checkCurrentPlayerBust()}
            {this.checkCurrentPlayerStand()}
        } else if (dealerPhase) {
            {this.dealerHit()}
        } else if (payoutPhase) {
            
        } else {
            render = (
                <div>
                    Waiting on players
                </div>
            )
        }

        let playersIngame = (
            players.length !== 0 ? (

                players.map(player => {
                    return (
                        <li key={player.userId}>
                            <Player 
                                player={player} 
                                updateBlackjack={this.updateBlackjack} 
                                getBet={this.getBet}
                            />
                        </li>
                    );
                })) : ( <li> No chimps sitting </li> )
        )

        return (
            <div className="blackjack-table">
                <div className="dealer-info">                    
                    {dealer.hand}
                </div>

                <div className="players-info">
                    <ul>{playersIngame}</ul>
                </div>

                <div className="player-bet">
                    Bet Amount: { players.length === 0 ? 'None' : players[0].pool }
                </div>

                {/* 
                    Render some kind of additional board logic ? 
                    Maybe include some kind of score counter for each hand ? 
                */}

                {render}
            </div>
        );
    }
}

export default Blackjack
