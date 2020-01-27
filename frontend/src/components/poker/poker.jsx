import React from 'react';
import pokerTable from '../../app/assets/images/pokerTable.png'
import Game from '../../components/poker/game';
import '../../app/assets/stylesheets/poker.css'
import imageHash from './pokerImages';
import Deck from '../../cardDeck';
import GameChat from "../chat/game_chat_container";

class Poker extends React.Component{
    constructor(props){
        super(props)
        this.socket = this.props.socket;
        this.state ={
            game: new Game(),
            idx: 0,
            cycle: 0,
            CalledChecked: 0,
            fullGame: false,
            won: false,
            raised: false
        }

        this.imageHash = imageHash;
        this.addPlayerToGame = this.addPlayerToGame.bind(this);
        this.handleCall = this.handleCall.bind(this);
        this.handleRaise = this.handleRaise.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.sendPlayerToSocket = this.sendPlayerToSocket.bind(this);
        this.sendCallToSocket = this.sendCallToSocket.bind(this);
        this.sendRaiseToSocket = this.sendRaiseToSocket.bind(this);
        this.sendCheckToSocket = this.sendCheckToSocket.bind(this);
        this.sendFoldToSocket = this.sendFoldToSocket.bind(this);
        this.handleFold = this.handleFold.bind(this);
    }
    
    addPlayerToGame(username){
        if(this.state.game.turnStarted === false && this.state.idx !== 6){
            this.state.game.addPlayer(username)
            this.state.game.dealFirstHand();
            this.setState({idx: this.state.idx+1})
            if (this.state.game.players.length > 5){
                this.state.game.turnStarted = true;
                this.state.game.currentPlayers = this.state.game.players.slice()
                // this.state.game.dealCommunity()
                this.setState({fullGame: true})
            }
        }
    }

    sendPlayerToSocket() {
        this.socket.emit("addPokerGamePlayer", this.props.currentUser.username)
    }


    nextTurn(){
        let temp = this.state.game.currentPlayers.shift();
        this.state.game.currentPlayers.push(temp)
        if(this.state.CalledChecked === this.state.game.currentPlayers.length-1 && this.state.cycle === 0){
            this.state.game.dealCommunityPhase1()
            this.setState({
                CalledChecked: 0,
                cycle: this.state.cycle+1
            })
        } else if (this.state.CalledChecked === this.state.game.currentPlayers.length-1 && this.state.cycle === 1){
            this.state.game.dealCommunityPhase2()
            this.setState({
                CalledChecked: 0,
                cycle: this.state.cycle + 1
            })
        } else if (this.state.CalledChecked === this.state.game.currentPlayers.length-1 && this.state.cycle === 2){
            this.state.game.dealCommunityPhase3()
            this.setState({
                CalledChecked: 0,
                cycle: this.state.cycle + 1
            })
        }
        this.forceUpdate()
    }

    sendCallToSocket() {
        this.socket.emit("playerCalled", this.props.currentUser.username)
    }

    handleCall(){
        this.setState({CalledChecked: this.state.CalledChecked+1})
        if(this.state.game.bet !== null){
            if (this.state.game.currentPlayers[0].bananas > this.state.game.bet){
                this.state.game.pot += parseInt(this.state.game.bet)
                this.state.game.currentPlayers[0].bananas -= parseInt(this.state.game.bet);
            }else{
                this.state.game.pot += this.state.game.currentPlayers[0].bananas
                this.state.game.currentPlayers[0].bananas -= this.state.game.currentPlayers[0].bananas
            }
        } else if (this.state.game.bet === null && this.state.game.currentPlayers[0].bigBlind === false) {
            if (this.state.game.currentPlayers[0].bananas > this.state.game.BigBlindAmount) {
                this.state.game.pot += parseInt(this.state.game.BigBlindAmount)
                this.state.game.currentPlayers[0].bananas -= parseInt(this.state.game.BigBlindAmount);
            } else {
                this.state.game.pot += this.state.game.currentPlayers[0].bananas
                this.state.game.currentPlayers[0].bananas -= this.state.game.currentPlayers[0].bananas
            }
        }else if (this.state.game.bet === null && this.state.game.currentPlayers[0].smallBlind === false) {
            if (this.state.game.currentPlayers[0].bananas > this.state.game.smallBlindAmount) {
                this.state.game.pot += parseInt(this.state.game.smallBlindAmount)
                this.state.game.currentPlayers[0].bananas -= parseInt(this.state.game.smallBlindAmount);
            } else {
                this.state.game.pot += this.state.game.currentPlayers[0].bananas
                this.state.game.currentPlayers[0].bananas -= this.state.game.currentPlayers[0].bananas
            }
        }
        this.nextTurn()
    }

    sendRaiseToSocket() {
        let currentBet;
        currentBet = parseInt(prompt('please enter an amount to raise'))
        if (currentBet > 0 && currentBet <= this.state.game.currentPlayers[0].bananas) {
            this.socket.emit("playerRaised", this.props.currentUser.username, currentBet)
        } else {
        }
    }

    handleRaise(amount){
        this.setState({
            CalledChecked: 0,
            raised: true,
        })
        this.state.game.bet = amount;
        this.state.game.pot += amount;
        this.state.game.currentPlayers[0].bananas -= amount;
        this.nextTurn()
    }
    
    sendCheckToSocket() {
        this.socket.emit("playerChecked", this.props.currentUser.username)
    }

    handleCheck(username){
        this.setState({
            CalledChecked: this.state.CalledChecked+1,
        })
        this.nextTurn()
    }

    sendFoldToSocket() {
        this.socket.emit("playerFolded", this.props.currentUser.username)
    }
    
    handleFold(username) {
        this.state.game.currentPlayers = this.state.game.currentPlayers.slice(1);
        if (this.state.game.currentPlayers.length === 1) {
            this.handleWinner();
        }
        this.forceUpdate();
    }


    handleWinner(){ 
        this.socket.emit("playerWon", this.state.game.pot, this.state.game.getWinner())
        this.handleNewHand()
    }

    handleNewHand(){
        this.state.game.communityCards = []
        this.state.game.deck = new Deck()
        this.state.game.currentPlayers = this.state.game.players.slice()
        this.state.game.dealHandPhase2()
        this.state.game.resetNextBetRound()
        this.setState({ CalledChecked: 0, won: false,raised:false, cycle: 0})
    }

    componentDidMount() {
        this.socket.emit("joinPokerGame")

        this.socket.on("addPokerGamePlayer", username => {
            this.addPlayerToGame(username);
        })

        this.socket.on("playerCalled", username => {
            this.handleCall(username);
        })

        this.socket.on("playerRaised", (username, amount) => {
            this.handleRaise(username, amount);
        })

        this.socket.on("playerFolded", username => {
            this.handleFold(username)
        }) 

        this.socket.on("playerChecked", username => {
            this.handleCheck(username)
        }) 

    }

   
    render(){ 
        let gameStarted = this.state.fullGame ? null : <button className='addPlayer' onClick={this.sendPlayerToSocket}>Add Player</button>
        let winner = (this.state.CalledChecked === this.state.game.currentPlayers.length && this.state.game.players.length !==0 && this.state.game.turnStarted && this.state.cycle === 3) ? this.handleWinner() : (null)                           
        let check = this.state.raised ? (<button onClick={this.sendCallToSocket}>Call</button>) : (<button onClick={this.sendCheckToSocket}>Check</button>);
        return (
            <div className='pokerbackground'>
                {
                    this.state.fullGame && <div className="pot">
                        Pot: {this.state.game.pot}
                    </div>
                }

                {
                    this.state.fullGame && <div className='CommunityCards'>
                        <ul className='CCpoker'>
                            {
                                this.state.game.communityCards.map(card =>(
                                    <li><img className='deck' src={this.imageHash[card[2]]} alt={card[2]}/></li>
                                ))
                                    
                            }
                        </ul>
                    </div>
                }
                <div className='pokerTable'>
                    <img src={pokerTable} alt="poker table" />
                    <div className='CardsButtons'>
                        {gameStarted}
                        {this.state.fullGame && <img src={this.imageHash[this.state.game.currentPlayers[0].hand[0][2]]} alt= '' />}
                        {this.state.fullGame && <img src={this.imageHash[this.state.game.currentPlayers[0].hand[1][2]]} alt= '' />}
                        <div className='buttons'>
                        {this.state.fullGame && <div>{this.state.game.currentPlayers[0].handle} Your Balance: {this.state.game.currentPlayers[0].bananas}</div>}
                        {winner}
                            <div className='test'>
                                {this.state.fullGame ? check : <button disabled>Check</button>}
                                {/* {this.state.fullGame ? <button onClick ={this.sendCallToSocket}>Call</button> : <button disabled>Call</button>} */}
                                {this.state.fullGame ? <button onClick ={this.sendRaiseToSocket}>Raise</button> : <button disabled>Raise</button>}
                                {this.state.fullGame ? <button onClick ={this.sendFoldToSocket}> Fold</button> : <button disabled>Fold</button>}
                            </div>
                        </div>
                    </div>
                    <GameChat socket={this.socket} /> 
                </div>
            </div>
        )
    }
}
export default Poker