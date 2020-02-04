import React from 'react'
import * as GameLogic from './blackjack/blackjack';
import './blackjack.css';
import blackjackTable from '../../app/assets/images/blackjackTable.png';
import imageHash from "./blackjackImages";

// Remember to change the start playing onClick back over to the login screen //

class Blackjack extends React.Component {
    constructor(props) {
        super(props)
        const blackjack = new GameLogic.Blackjack();
        this.state = {
            blackjack: blackjack,
            betAmount: 0
        };
        this.handleBetSubmit = this.handleBetSubmit.bind(this);
        this.addPlayer = this.addPlayer.bind(this);
        this.dealCards = this.dealCards.bind(this);
        this.updateBlackjack = this.updateBlackjack.bind(this);
        this.checkCurrentPlayerBust = this.checkCurrentPlayerBust.bind(this);
        this.checkCurrentPlayerStand = this.checkCurrentPlayerStand.bind(this);
        this.checkAllBust = this.checkAllBust.bind(this);
        this.handleHit = this.handleHit.bind(this);
        this.handleStand = this.handleStand.bind(this);
        this.handleSplit = this.handleSplit.bind(this);
        this.handleDouble = this.handleDouble.bind(this);

        window.blackjack = blackjack;
        window.state = this.state;
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
        return this.state.blackjack.checkRoundDone();
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
        // debugger /
        e.preventDefault();
        if (this.state.blackjack.getBetFromCurrentTurn(parseInt(this.state.betAmount))) {
            this.setState({ betAmount: 0 })
        }
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
    }

    dealerHit() {
        this.state.blackjack.dealerHit();
    }

    compareHands() {
        this.state.blackjack.compareHands();
    }

    handleHit() {
        if (this.state.blackjack.players[0].bust === false) {
            this.state.blackjack.players[0].hit()
            // if (this.state.blackjack.players[0].bust && this.state.blackjack.players[0].handSplit.length == 0) {
            //     this.nullAllOptions();
            // }
            // if (this.state.blackjack.players[0].bust) {
            //     document.getElementsByClassName("blackjack-hand")[0].style.color = 'red';
            // }
            this.updateBlackjack();
        } else if (this.state.blackjack.players[0].bustSplit === false) {
            this.state.blackjack.players[0].hitSplit()
            // if (this.state.blackjack.players[0].bustSplit) {
            //     document.getElementsByClassName("blackjack-handSplit")[0].style.color = 'red';
            //     this.nullAllOptions();
            // }
            this.state.updateBlackjack();
        }

        if (this.state.blackjack.checkCurrentPlayerBust()) {
            if (this.state.blackjack.checkAllBust()) {
                this.newRound();
            }
        }
        this.updateBlackjack();
    }

    handleStand() {
        this.state.blackjack.players[0].stand();
        // this.nullAllOptions();

        // Renders that logic into the front end 
        this.state.blackjack.checkCurrentPlayerStand();
        // This updates the state and rerenders the blackjack component with the current phase still being 
        // the options phase. It doesn't know it's last in the cycle 
        this.updateBlackjack();
    }

    handleSplit() {
        this.state.blackjack.players[0].splitHand();
        if (this.state.blackjack.players[0].split) {
            this.updateBlackjack();
        }
    }

    handleDouble() {
        this.state.blackjack.players[0].doubleDownHand();
        this.updateBlackjack();
    }

    nullAllOptions() {
        document.getElementsByClassName('blackjack-hit')[0].setAttribute('disabled', true)
        document.getElementsByClassName('blackjack-stand')[0].setAttribute('disabled', true)
        document.getElementsByClassName('blackjack-split')[0].setAttribute('disabled', true)
        document.getElementsByClassName('blackjack-double')[0].setAttribute('disabled', true)
    }

    newRound() {
        document.querySelectorAll('.blackjack-hit').forEach(ele => ele.removeAttribute('disabled'))
        document.querySelectorAll('.blackjack-stand').forEach(ele => ele.removeAttribute('disabled'))
        document.querySelectorAll('.blackjack-split').forEach(ele => ele.removeAttribute('disabled'))
        document.querySelectorAll('.blackjack-double').forEach(ele => ele.removeAttribute('disabled'))
        document.querySelectorAll(".blackjack-hand").forEach(ele => ele.style.color = 'black')
        document.querySelectorAll("blackjack-handSplit").forEach(ele => ele.style.color = 'black')
    }

    checkDealerStood() {
        return this.state.blackjack.checkDealerStood();
    }

    componentDidMount() {
        // this.socket.emit('joinBlackjackGame', this.props.currentUser.username, this.props.currentUser.balance)
        this.addPlayer(this.props.currentUser.username, 1000)
    }

    render() {
        const { blackjack } = this.state;
        const { players, dealer } = blackjack;

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
                render = (
                    <div className="blackjack-betAmount">
                        <form onSubmit={this.handleBetSubmit}>
                            <input
                                id='input'
                                type="text"
                                value={this.state.betAmount}
                                onChange={this.update("betAmount")}
                            />
                            <input type='submit' value='bet'/>
                        </form>
                    </div>
                );
  
                break;
            case 'options':
                render = (
                    <section className="blackjack-options">
                         <button className="blackjack-hit" onClick={this.handleHit}>
                                Hit!
                        </button>
                            <button className="blackjack-stand" onClick={this.handleStand}>
                                Stand!
                        </button>
                            <button className="blackjack-split" onClick={this.handleSplit}>
                                Split hand!
                        </button>
                            <button className="blackjack-double" onClick={this.handleDouble}>
                                Double down!
                        </button>
                    </section>
                )
                
                if (players.every(player => { return player.hand.length < 2 })) {
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
                if (this.checkRoundDone()) {
                    // If the dealer busts on a hit, BE will rerun the game and forceUpdate 
                    // will make sure the change takes place on the FE 
                    this.forceUpdate();
                } else if (this.checkDealerStood()) {
                    blackjack.currentPhase = 'payout';
                    this.forceUpdate();
                }
                break;
            case 'payout':
                console.log("currently in: payout phase")
                this.compareHands();
                if (this.checkRoundDone()) {
                    this.forceUpdate();
                }
                break;
            default:
                render = (
                    <div>
                        Waiting on players!
                    </div>
                )
                break;
        }

        let ingamePlayers = (
            players ?
                (
                    players.map((player, idx) => {
                        const hand = player.hand.map(card => {
                            return (
                              <li>
                                    <img
                                        className="blackjack-card"
                                        src={imageHash[card[2]]}
                                        alt=""
                                    />
                                </li>
                            );
                        })

                        const handSplit = player.handSplit.map(card => {
                            return <li className="blackjack-card" key={card}> {card} </li>
                        })

                        const splitPool = (player.split ? <div> Split Balance: {player.poolSplit} </div> : null)

                        let className = `blackjack-player-${idx}`;

                        return (
                            <div key={player.userId} className={className}>
                                <section className="blackjack-player-info">
                                    <div className="blackjack-player-id">
                                        Player: {player.userId}

                                    </div>
                                    <div className="blackjack-player-poolSplit">
                                        {splitPool}
                                    </div>
                                    <div className="blackjack-player-balance">
                                        Balance: {player.balance}
                                    </div>
                                </section>

                                <div className="blackjack-player-hand">
                                    Hand:
                                    <ul className="blackjack-hand">
                                        {hand}
                                    </ul>

                                    {player.split ? "Split Hand" : null}
                                    <ul className="blackjack-handSplit">
                                        {handSplit}
                                    </ul>
                                </div>


                                <div className="blackjack-hand-values">
                                    Hand value: {player.getHandValue(player.hand)}
                                    {player.split ? <div>Split Hand value: {player.getHandValue(player.handSplit)} </div> : null}
                                </div>
                            </div>
                        )})) : (<div> No chimps sitting </div>)
                    )
        
        return (
          <div className="blackjack-table">
            <img id="blackjack-table-png" src={blackjackTable} alt="blackjack table" />
            <h1>{blackjack.currentPhase}</h1>
            <ul className="dealer-info">
                {dealer.hand.map(card => {
                    return (
                        <li key={card}>
                            <img className="blackjack-card" src={imageHash[card[2]]} alt="" />
                        </li>
                    );              
                })}
            </ul>

            <div className="blackjack-players-info">
              <ul>{ingamePlayers ? ingamePlayers : null}</ul>
            </div>

            <div className="player-bet">
              Bet Amount: {players.length === 0 ? "None" : players[0].pool}
            </div>

            {render}
          </div>
        );
    }
}

export default Blackjack
