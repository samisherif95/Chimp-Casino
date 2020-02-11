import React from 'react'
// import * as GameLogic from './blackjack/blackjack';
import './blackjack.css';
import blackjackTable from '../../app/assets/images/blackjackTable.png';
import imageHash from "./blackjackImages";
import GameChat from "../chat/bj_chat_container";

// Remember to change the start playing onClick back over to the login screen //

class Blackjack extends React.Component {
    constructor(props) {
        super(props)
        this.socket = this.props.socket;
        // const blackjack = new GameLogic.Blackjack();
        this.state = {
            dealer: {hand: []},
            betAmount: "",
            players: [],
            phase: "",
            currentTurn: "",
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
        this.resetBJPlayers = this.resetBJPlayers.bind(this);
        this.updatePlayerBalances = this.updatePlayerBalances.bind(this);
        this.receiveLastBetter = this.receiveLastBetter.bind(this);
        this.dealDealerCards = this.dealDealerCards.bind(this);
        this.dealPlayerCards = this.dealPlayerCards.bind(this);
        this.changeBJPhase = this.changeBJPhase.bind(this);
        this.changeBJTurn = this.changeBJTurn.bind(this);
        this.removeBJPlayer = this.removeBJPlayer.bind(this);
        this.addCurrentBJPlayers = this.addCurrentBJPlayers.bind(this);
        this.addNewBJPlayer = this.addNewBJPlayer.bind(this);
        this.receiveDealer = this.receiveDealer.bind(this);
    }

    //Get current player id. Goes into game, gets zeroth index 
    // gameLoop() {
    //     // Do switch logic and have certain conditions checks on each page to do a setState({phase: 'some phase'})
    //     // Edit 2.0: THROW PHASING LOGIC INTO THE BACK END AND HAVE A FUNCTION ON EACH COMPONENT DID UPDATE//RENDER 
    //     // CHECK THE BACKEND PHASE AND USER SWITCH LOGIC TO DECIDE WHAT TO RENDER 

    // }


    update(field) {
      return (e) => {
        if (Number(e.currentTarget.value) || e.currentTarget.value === "") {
          this.setState({
            [field]: e.currentTarget.value
          })
        }
      }
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
        if(this.state.betAmount > 0){
            this.socket.emit("bet", this.state.betAmount)
            this.setState({ betAmount: "" });
        }else{
            alert('Please enter a bet')
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

    handleHit() {
        this.socket.emit("playerHit")
    }

    handleStand() {
        this.socket.emit("playerStand")
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

    receiveDealer(dealer) {
        this.setState({ dealer: dealer });
    }

    addNewBJPlayer(player, phase, currentTurnName) {
        this.state.players.push(player);
        this.setState({ phase, currentTurn: currentTurnName });
    }

    addCurrentBJPlayers(playersData) {
        this.setState({players: playersData})
    }

    removeBJPlayer(userId) {
        for (let i = 0; i < this.state.players.length; i++) {
            if (this.state.players[i].userId === userId) {
                this.state.players.splice(i, 1);
            }
        }
        this.setState(this.state);
    }

    changeBJTurn(currentTurnName) {
        this.setState({ currentTurn: currentTurnName });
    }

    changeBJPhase(phase) {
        this.setState({ phase })

    }

    dealPlayerCards(cards) {
        this.state.players.forEach(player => {
            player.hand = cards[player.userId]
        })
        this.setState(this.state)
    }

    dealDealerCards(cards) {
        this.state.dealer.hand = cards;
        this.setState({ dealer: this.state.dealer })
    }

    receiveLastBetter(lastBetterId, lastBetterBalance) {
        this.state.players.forEach(player => {
            if (player.userId === lastBetterId) {
                player.balance = lastBetterBalance;
            }
        })
        this.setState(this.state);
    }

    updatePlayerBalances(playersObj) {
        this.state.players.forEach(player => {
            player.balance = playersObj[player.userId]
        })
        this.setState(this.state)
    }

    resetBJPlayers() {
        this.state.players.forEach(player => {
            player.hand = [];
            player.handSplit = [];
            player.pool = 0;
            player.poolSplit = 0;
        })
        this.setState(this.state);
    }

    componentDidMount() {
        /** 
        
        Everytime this modal is open, you must send the dealer information from the 
        backend over to this component's state. Everything affecting the dealer must 
        also be trasmitted over from the back end to the front end.

         */

        this.socket.emit("requestDealer", null);
        this.socket.emit("joinBJGame", this.props.currentUser.username, this.props.currentUser.balance);
        this.socket.on("sendDealer", this.receiveDealer);
        this.socket.on("newBJPlayer", this.addNewBJPlayer);
        this.socket.on("currentBJPlayers", this.addCurrentBJPlayers);
        this.socket.on("removePlayer", this.removeBJPlayer);
        this.socket.on("changeTurn", this.changeBJTurn);
        this.socket.on("changePhase", this.changeBJPhase);
        this.socket.on("dealPlayerCards", this.dealPlayerCards);
        this.socket.on("dealDealerCards", this.dealDealerCards);
        this.socket.on("lastBetter", this.receiveLastBetter);
        this.socket.on("updatePlayersBalance", this.updatePlayerBalances)
        this.socket.on("resetPlayers", this.resetBJPlayers);
    }

    componentWillUnmount() {
        this.socket.off("sendDealer", this.receiveDealer);
        this.socket.off("newBJPlayer", this.addNewBJPlayer);
        this.socket.off("currentBJPlayers", this.addCurrentBJPlayers);
        this.socket.off("removePlayer", this.removeBJPlayer);
        this.socket.off("changeTurn", this.changeBJTurn);
        this.socket.off("changePhase", this.changeBJPhase);
        this.socket.off("dealPlayerCards", this.dealPlayerCards);
        this.socket.off("dealDealerCards", this.dealDealerCards);
        this.socket.off("lastBetter", this.receiveLastBetter);
        this.socket.off("updatePlayersBalance", this.updatePlayerBalances)
        this.socket.off("resetPlayers", this.resetBJPlayers);
    }

    render() {
        // Must keep track of current player's turn. Only ever going to be rendering logic for one player.
        // If not the current turn, don't do anything. The server will keep track of whose turn it is, but it's up to your 
        // component's job to render what is shown to the current player 

        // Don't need to cycle through the players. KEep track of the current player's turn in the state. 
        // In rendering, reflect on 

        let render;
        switch (this.state.phase) {
            case 'betting':

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
                                placeholder="BET"
                            />
                            <br/>
                            <input type='submit' value='Place Bet'/>
                        </form>
                    </div>
                ) : (
                    <div>
                        Waiting for other players...
                    </div>
                ))
        
  
                break;
            case 'options':

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
                          Waiting for other players...
                      </div>
                    ))
                break
            case 'dealer':
                this.socket.emit("payoutPlayers")
                break;
            case 'new round':
                
                render = (
                    <div className='new-bj-game'>
                      <p>Round done: NEW ROUND PHASE</p>
                    </div>
                )

                break;
        }

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
                                <section className={this.state.currentTurn === player.userId ? "blackjack-player-info current-turn": "blackjack-player-info" }>
                                    <div className="blackjack-player-id">
                                        <p>Player: {player.userId}</p>
                                    </div>
                                    <div className="blackjack-player-poolSplit">
                                        {splitPool}
                                    </div>
                                    <div className="blackjack-player-balance">
                                      <p>Balance: {player.balance}</p>
                                    </div>
                                </section>

                                <div className="blackjack-player-hand">
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
            <GameChat socket={this.socket} />
          </div>
        );
    }
}

export default Blackjack
