import React from 'react'
// import * as GameLogic from './blackjack/blackjack';
import './blackjack.css';
import blackjackTable from '../../app/assets/images/blackjackTable.png';
import imageHash from "./blackjackImages";

// Remember to change the start playing onClick back over to the login screen //

class Blackjack extends React.Component {
    constructor(props) {
        super(props)
        this.socket = this.props.socket;
        // const blackjack = new GameLogic.Blackjack();
        this.state = {
            dealer: {hand: []},
            betAmount: 0,
            players: [],
            phase: "",
            currentTurn: "",
        };
        this.t = null;

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
        e.preventDefault();
        this.socket.emit("bet", this.state.betAmount)
        this.setState({betAmount: 0});
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

    handleHit() {
        this.socket.emit("playerHit")
        // if (this.state.blackjack.players[0].bust === false) {
        //     this.state.blackjack.players[0].hit()
        //     // if (this.state.blackjack.players[0].bust && this.state.blackjack.players[0].handSplit.length == 0) {
        //     //     this.nullAllOptions();
        //     // }
        //     // if (this.state.blackjack.players[0].bust) {
        //     //     document.getElementsByClassName("blackjack-hand")[0].style.color = 'red';
        //     // }
        //     this.updateBlackjack();
        // } else if (this.state.blackjack.players[0].bustSplit === false) {
        //     this.state.blackjack.players[0].hitSplit()
        //     // if (this.state.blackjack.players[0].bustSplit) {
        //     //     document.getElementsByClassName("blackjack-handSplit")[0].style.color = 'red';
        //     //     this.nullAllOptions();
        //     // }
        //     this.state.updateBlackjack();
        // }

        // if (this.state.blackjack.checkCurrentPlayerBust()) {
        //     if (this.state.blackjack.checkAllBust()) {
        //         this.newRound();
        //     }
        // }
        // this.updateBlackjack();
    }

    handleStand() {
        this.socket.emit("playerStand")
        // this.state.blackjack.players[0].stand();
        // // this.nullAllOptions();

        // // Renders that logic into the front end 
        // this.state.blackjack.checkCurrentPlayerStand();
        // // This updates the state and rerenders the blackjack component with the current phase still being 
        // // the options phase. It doesn't know it's last in the cycle 
        // this.updateBlackjack();
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
        /** 
        
        Everytime this modal is open, you must send the dealer information from the 
        backend over to this component's state. Everything affecting the dealer must 
        also be trasmitted over from the back end to the front end.

        this.socket.emit("requestDealer");
        this.socket.on("sendDealer", dealer => {
            this.setState({ dealer })
        })
        console.log(this.state.dealer);
         */

        this.socket.emit("requestDealer", null);
        this.socket.on("sendDealer", dealer => {
            this.setState({ dealer: dealer });
        })

        // this.socket.emit('joinBlackjackGame', this.props.currentUser.username, this.props.currentUser.balance)
        // this.addPlayer(this.props.currentUser.username, 1000)
        this.socket.emit("joinBJGame", this.props.currentUser.username, 1000) // change to other 1 once balance is working

        this.socket.on("newBJPlayer", (player, phase, currentTurnName) => {
            this.state.players.push(player);
            this.setState({phase, currentTurn: currentTurnName});
        })

        this.socket.on("currentBJPlayers", (playersData) => {
            this.setState({players: playersData})
        })

        this.socket.on("removePlayer", userId => {
            for (let i = 0; i < this.state.players.length; i++) {
                if (this.state.players[i].userId === userId) {
                    this.state.players.splice(i, 1);
                }
            }
            this.setState(this.state);
        })

        this.socket.on("changeTurn", (currentTurnName) => {
            console.log("A player's turn has been switched")
            console.log('Current player\'s turn: ', currentTurnName);
            this.setState({ currentTurn: currentTurnName });
        })

        this.socket.on("changePhase", (phase, currentTurnName) => {
            this.setState({ phase, currentTurn: currentTurnName })
        });

        this.socket.on("dealPlayerCards", cards => {
            this.state.players.forEach(player => {
                player.hand = cards[player.userId]
            })
            this.setState(this.state)
        })

        this.socket.on("dealDealerCards", cards => {
            this.state.dealer.hand = cards;
            this.setState({ dealer: this.state.dealer })
        })

        this.socket.on("lastBetter", (lastBetterId, lastBetterBalance) => {
            this.state.players.forEach(player => {
                if (player.userId === lastBetterId) {
                    player.balance = lastBetterBalance;
                }
            })
            this.setState(this.state);
        })

        this.socket.on("updatePlayersBalance", playersObj => {
            this.state.players.forEach(player => {
                player.balance = playersObj[player.userId]
            })

            this.setState(this.state);
        })

        this.socket.on("resetPlayers", () => {
            this.state.players.forEach(player => {
                player.hand = [];
                player.handSplit = [];
                player.pool = 0;
                player.poolSplit = 0;
            })
            this.setState(this.state);
        })
    }

    render() {
        // const { blackjack } = this.state;
        // const { players, dealer } = blackjack;

        // Must keep track of current player's turn. Only ever going to be rendering logic for one player.
        // If not the current turn, don't do anything. The server will keep track of whose turn it is, but it's up to your 
        // component's job to render what is shown to the current player 

        // Don't need to cycle through the players. KEep track of the current player's turn in the state. 
        // In rendering, reflect on 

        let render;
        switch (this.state.phase) {
            case 'betting':
                console.log("Currently In: Betting Phase")

                // Edit 2.0: Maybe not necessary, sent getBet function down as a prop for the 
                // Player Component. Maybe transfer this form into the player component and 
                // on submit, trigger the getBet on the amount wagered 

                // keep track of whose turn to bet
                render = (this.props.currentUser.username === this.state.currentTurn ?
                (
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
                ) : (
                    <div>
                        Not you turn! 
                    </div>
                ))
        
  
                break;
            case 'options':
                console.log("Currently In: Options Phase");

                console.log('Current Turn for Options: ',this.state.currentTurn);
                render = (this.props.currentUser.username === this.state.currentTurn ?
                    (
                        <section className="blackjack-options">
                            <button className="blackjack-hit" onClick={this.handleHit}>
                                    Hit!
                            </button>

                                <button className="blackjack-stand" onClick={this.handleStand}>
                                    Stand!
                            </button>

                                {/* 
                            <button className="blackjack-split" onClick={this.handleSplit}>
                                    Split hand!
                            </button>
                            
                            <button className="blackjack-double" onClick={this.handleDouble}>
                                    Double down!
                            </button> */}
                        </section>
                    ) : (
                        <div>
                            Not you turn!
                    </div>
                    ))
                break
            case 'dealer':
                console.log("Currently In: Dealer Phase")
                this.socket.emit("dealerHit")
                this.socket.emit("payoutPlayers")
                break;
            case 'new round':
                console.log("Currently In: New Round")
                
                render = (
                    <div>
                        Round done: NEW ROUND PHASE
                        New Round Starting in 5 seconds! 
                    </div>
                )

                this.socket.emit("newRound");
                break;
        }
        //     default:
        //         render = (
        //             <div>
        //                 Waiting on players!
        //             </div>
        //         )
        //         break;
        // }

        let ingamePlayers = (
            this.state.players.length > 0 ?
                (
                    this.state.players.map((player, idx) => {
                        const hand = player.hand.map(card => {
                            return (
                              <li key={card[2]}>
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
                                    {/* Hand value: {player.getHandValue(player.hand)} */}
                                    {/* {player.split ? <div>Split Hand value: {player.getHandValue(player.handSplit)} </div> : null} */}
                                </div>
                            </div>
                        )})) : (<div> No chimps sitting </div>)
                    )
        
        return (
          <div className="blackjack-table">
            <img id="blackjack-table-png" src={blackjackTable} alt="blackjack table" />
            <ul className="dealer-info">
                {this.state.dealer.hand.map(card => {
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

                {render}
            <div className="player-bet">
              {/* Bet Amount: {this.state.players.length === 0 ? "None" : this.state.players[0].pool} */}
            </div>

          </div>
        );
    }
}

export default Blackjack
