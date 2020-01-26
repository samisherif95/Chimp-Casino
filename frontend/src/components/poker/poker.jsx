import React from 'react';
import pokerTable from '../../app/assets/images/pokerTable.png'
import Game from '../../components/poker/game';
import '../../app/assets/stylesheets/poker.css'
// import img2C from './PokerImages/2C.png'
import imageHash from './pokerImages';
import Deck from '../../cardDeck';

class Poker extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            game: new Game(),
            idx: 0,
            fullGame: false,
            trackedPlayer: [],
            CalledChecked: 0,
            won: true
        }

        this.imageHash = imageHash;
        window.state = this.state;
        this.addPlayerToGame = this.addPlayerToGame.bind(this);
        this.handleCall = this.handleCall.bind(this);
        this.handleRaise = this.handleRaise.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleFold = this.handleFold.bind(this);
        // this.handleWinner = this.handleWinner.bind(this)
    }
    
    addPlayerToGame(){
        if(this.state.game.turnStarted === false && this.state.idx !== 6){
            this.state.game.addPlayer(`${this.state.idx}`)
            console.log(`Player ${this.state.idx} has been added to the game`)
            this.state.game.dealFirstHand();
            this.setState({idx: this.state.idx+1})
            if (this.state.game.players.length > 1){
                console.log('Game is about to start')
                this.state.game.currentPlayers = this.state.game.players.slice()
                this.state.game.dealCommunity()
                this.setState({fullGame: true})
            }
        }
    }


    nextTurn(){
        let temp = this.state.game.currentPlayers.shift();
        this.state.game.currentPlayers.push(temp)
        this.forceUpdate()
    }

    handleCall(){
        this.state.game.currentPlayers[0].playerCalled();
        this.setState({CalledChecked: this.state.CalledChecked+1})
        console.log(this.state.CalledChecked)
        console.log(`Player ${this.state.game.currentPlayers[0].handle} has Called`)
        if(this.state.game.currentPlayers[0].called === true && 
            this.state.game.bet !== null){
            if (this.state.game.currentPlayers[0].bananas > this.state.game.bet){
                this.state.game.pot += parseInt(this.state.game.bet)
                this.state.game.currentPlayers[0].bananas -= parseInt(this.state.game.bet);
            }else{
                console.log('not enough bananas, Going all in for being a cheat')
                this.state.game.pot += this.state.game.currentPlayers[0].bananas
                this.state.game.currentPlayers[0].bananas -= this.state.game.currentPlayers[0].bananas
            }
        } else if (this.state.game.currentPlayers[0].called === true && this.state.game.bet === null && this.state.game.currentPlayers[0].bigBlind === false) {
            if (this.state.game.currentPlayers[0].bananas > this.state.game.BigBlindAmount) {
                this.state.game.pot += parseInt(this.state.game.BigBlindAmount)
                this.state.game.currentPlayers[0].bananas -= parseInt(this.state.game.BigBlindAmount);
            } else {
                console.log('not enough bananas, Going all in for being a cheat')
                this.state.game.pot += this.state.game.currentPlayers[0].bananas
                this.state.game.currentPlayers[0].bananas -= this.state.game.currentPlayers[0].bananas
            }
        }else if (this.state.game.currentPlayers[0].called === true && this.state.game.bet === null && this.state.game.currentPlayers[0].smallBlind === false) {
            if (this.state.game.currentPlayers[0].bananas > this.state.game.smallBlindAmount) {
                this.state.game.pot += parseInt(this.state.game.smallBlindAmount)
                this.state.game.currentPlayers[0].bananas -= parseInt(this.state.game.smallBlindAmount);
            } else {
                console.log('not enough bananas, Going all in for being a cheat')
                this.state.game.pot += this.state.game.currentPlayers[0].bananas
                this.state.game.currentPlayers[0].bananas -= this.state.game.currentPlayers[0].bananas
            }
        }
        this.nextTurn()
    }

    handleRaise(){
        this.state.game.currentPlayers[0].placeBet();
        this.setState({
            trackedPlayer: [this.state.game.currentPlayers[0]],
            CalledChecked: 0
        })
        console.log(this.state.CalledChecked)
        console.log(`Player  ${this.state.game.currentPlayers[0].handle}  has Raised the bet`)
        this.state.game.bet = prompt('please enter bet')
        if (parseInt(this.state.game.bet) > this.state.game.currentPlayers[0].bananas) {
            console.log('Not enough bananas. Please get more Bananas and try again')
        } else {
            this.state.game.pot += parseInt(this.state.game.bet)
            this.state.game.currentPlayers[0].bananas -= parseInt(this.state.game.bet);
            this.state.game.raised = true;
        }
        this.nextTurn()
    }

    handleCheck(){
        // this.state.game.currentPlayers[0].checked();
        this.setState({CalledChecked: this.state.CalledChecked+1})
        console.log(this.state.CalledChecked)
        console.log(`Player ${this.state.game.currentPlayers[0].handle} has Checked`)
        this.nextTurn()
    }
    
    handleFold(){
        this.state.game.currentPlayers[0].playerFold();
        console.log(`Player ${this.state.game.currentPlayers[0].handle} has Folded`)
        this.state.game.currentPlayers = this.state.game.currentPlayers.slice(1);
        this.forceUpdate()
    }

    handleWinner(){ 
        // this.setState({won: true}, () => {
        //     console.log(this.state.game.getWinner())
           
        // }).then(()=>this.handleNewHand())
        // console.log(this.state.game.getWinner())
        // debugger
        this.setState({ won: true }, this.handleNewHand )
        console.log(`this winner of the game is ${this.state.game.getWinner()}`)
        
    }

    handleNewHand(){
        // debugger
        if(this.state.won === true){
            this.state.game.communityCards = []
            this.state.game.deck = new Deck()
            this.state.game.dealCommunity()
            this.state.game.currentPlayers = this.state.game.players.slice()
            this.state.game.dealHandPhase2()
            this.state.game.resetNextBetRound()
            // debugger
            this.setState({ CalledChecked: 0, won: false})
        }
    }
   
    render(){ 
        let gameStarted = this.state.fullGame ? null : <button className='addPlayer' onClick={this.addPlayerToGame}>Add Player</button>
        let winner = (this.state.CalledChecked === this.state.game.currentPlayers.length-1) ? this.handleWinner() : (null)
        if (this.state.game.currentPlayers.length !== 0){
            return (
                <div className='pokerbackground'>
                    <div className='CommunityCards'>
                        <ul className='CCpoker'>
                                {
                                    this.state.game.communityCards.map(card =>(
                                        <li><img className='deck' src={this.imageHash[card[2]]} alt={card[2]}/></li>
                                    ))
                                        
                                }
                            </ul>
                        <strong>Pot: {this.state.game.pot} </strong>
                    </div>
                    <div className='pokerTable'>
                        <img src={pokerTable} alt="poker table" />
                        <div className='CardsButtons'>
                            {gameStarted}
                            <img src={this.imageHash[this.state.game.currentPlayers[0].hand[0][2]]} alt= '' />
                            <img src={this.imageHash[this.state.game.currentPlayers[0].hand[1][2]]} alt= '' />
                            <div className='buttons'>
                            <strong>{this.state.game.currentPlayers[0].handle} Your Balance: {this.state.game.currentPlayers[0].bananas}</strong>
                            {winner}
                                <div className='test'>
                                    <button onClick ={this.handleCall}>Call</button>
                                    <button onClick ={this.handleFold}> Fold</button>
                                    <button onClick ={this.handleRaise}>Raise</button>
                                    <button onClick ={this.handleCheck}>Check</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }else{
            return (
                <div className='pokerbackground'>
                    <div className='pokerTable'>
                        <img src={pokerTable} alt="poker table" />
                        <div className='CardsButtons'>
                            <button className='addPlayer' onClick={this.addPlayerToGame}>Add Player</button>
                            <div className='buttons'>
                                <strong>Your Balance:{}</strong>
                                <div className='test'>
                                    <button disabled>Call</button>
                                    <button disabled>Fold</button>
                                    <button disabled>Raise</button>
                                    <button disabled>Check</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
       
    }
}
export default Poker