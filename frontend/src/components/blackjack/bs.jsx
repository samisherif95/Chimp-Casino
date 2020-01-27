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
        };
        this.addPlayer = this.addPlayer.bind(this);
        this.getBet = this.getBet.bind(this);
        this.dealCards = this.dealCards.bind(this);
        this.updateBlackjack = this.updateBlackjack.bind(this);
        this.checkCurrentPlayerBust = this.checkCurrentPlayerBust.bind(this);
        this.checkCurrentPlayerStand = this.checkCurrentPlayerStand.bind(this);
        this.checkAllBust = this.checkAllBust.bind(this);

        window.state = this.state;
        window.addPlayer = this.addPlayer;
        window.getBet = this.getBet;
        window.dealCards = this.dealCards;
    }

    //Get current player id. Goes into game, gets zeroth index 
    // gameLoop() {
    //     // Do switch logic and have certain conditions checks on each page to do a setState({phase: 'some phase'})
    //     // Edit 2.0: THROW PHASING LOGIC INTO THE BACK END AND HAVE A FUNCTION ON EACH COMPONENT DID UPDATE//RENDER 
    //     // CHECK THE BACKEND PHASE AND USER SWITCH LOGIC TO DECIDE WHAT TO RENDER 

    // }

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

    checkDealerStood() {
        return this.state.blackjack.checkDealerStood();
    }

    checkNaturals() {
        this.state.blackjack.naturalBlackjack();
    }

    checkRoundDone() {
        this.state.blackjack.checkRoundDone();
    }

    checkAllBust() {
        return this.state.blackjack.checkAllBust();
    }

    checkCurrentPlayerBust() {
        // Checks to see if the current player's hand AND handSplit has busted,
        // Will jump to the next player if so
        return this.state.blackjack.checkCurrentPlayerBust();
    }

    checkCurrentPlayerStand() {
        // Checks to see if the current player has stood
        // Will jump to the next player if so
        return this.state.blackjack.checkCurrentPlayerStand();
    }

    handleBetSubmit(e) {
        e.preventDefault();
        this.state.blackjack.getBetFromCurrentTurn(e.currentTarget);
    }

    updateBlackjack() {
        // Rerenders the FE blackjack board to reflect the BE blackjack board
        this.setState({ blackjack: this.state.blackjack });
    }

    optionsDone() {
        // Returns true or false based on whether or not your options phase is done 
        let done = true;
        this.state.blackjack.players.forEach(player => {
            if (player.stood === false) {
                if (player.split) {
                    if (!player.bust || !player.bustSplit) {
                        done = false;
                    }
                } else if (!player.bust) {
                    done = false;
                }
            }
        })
        return done

        // return this.state.blackjack.finishedCycle;

        // return this.state.blackjack.players.some(player => player.stood === true);
    }

    dealerHit() {
        this.state.blackjack.dealerHit();
    }

    compareHands() {
        this.state.blackjack.compareHands();
    }


    render() {
        const { blackjack } = this.state;
        const { players, dealer } = blackjack;
        const { currentUser } = this.props;

        // Must keep track of current player's turn. Only ever going to be rendering logic for one player.
        // If not the current turn, don't do anything. The server will keep track of whose turn it is, but it's up to your 
        // component's job to render what is shown to the current player 

        // Don't need to cycle through the players. KEep track of the current player's turn in the state. 
        // In rendering, reflect on 

        let render;

        switch (blackjack.currentPhase) {
            case 'betting':
                console.log("currently in: betting phase")
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
                break;
            case 'options':
                if (players.every( player => { return player.hand.length < 2 })) {
                    this.dealCards()
                    this.checkNaturals();
                    this.checkRoundDone();
                }
                console.log("currently in: options phase")
                this.checkRoundDone();
                break;
            case 'dealer':
                console.log("currently in: dealer phase")
                this.dealerHit()
                this.checkRoundDone();
                if (blackjack.currentPhase = 'payout') {
                    console.log("currently in: payout phase")
                    this.compareHands();
                    this.checkRoundDone();
                }
                break;
            case 'payout':
                break;
            default: 
                render = (
                    <div>
                        Waiting on players!
                    </div>
                )
                break;
        }

        let playersIngame = (
            players.length !== 0 ? (
                players.map(player => {
                    return (
                        <li key={player.userId}>
                            <Player
                                player={player}
                                updateBlackjack={this.updateBlackjack}
                                checkBust={this.checkCurrentPlayerBust}
                                checkStand={this.checkCurrentPlayerStand}
                                getBet={this.getBet}
                                checkAllBust={this.checkAllBust}
                            />
                        </li>
                    );
                })) : (<li> No chimps sitting </li>)
        )

        return (
            <div className="blackjack-table">
                <h1>{blackjack.currentPhase}</h1>
                <div className="dealer-info">
                    {dealer.hand}
                </div>

                <div className="players-info">
                    <ul>{playersIngame}</ul>
                </div>

                <div className="player-bet">
                    Bet Amount: {players.length === 0 ? 'None' : players[0].pool}
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
