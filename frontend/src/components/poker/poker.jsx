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
            players: [],
            myCards: [],
            bet: 0,
            currentPlayer: null,
            communityCards: [],
            gameStarted: false,
            raised: false,
            addedPlayer: false,
            pot: 0,
            timer: null,
            gameOver: false,
            showCards: false
        }
        
        window.state = this.state
        this.imageHash = imageHash;
        this.sendPlayerToSocket = this.sendPlayerToSocket.bind(this);
        this.sendCallToSocket = this.sendCallToSocket.bind(this);
        this.sendRaiseToSocket = this.sendRaiseToSocket.bind(this);
        this.sendCheckToSocket = this.sendCheckToSocket.bind(this);
        this.sendFoldToSocket = this.sendFoldToSocket.bind(this);
        this.getPlayerByName = this.getPlayerByName.bind(this);
    }


    sendPlayerToSocket() {
        this.setState({addedPlayer: true})
        this.socket.emit("addPokerGamePlayer", this.props.currentUser.username, this.props.currentUser.balance)
        this.forceUpdate();
    }



    sendCallToSocket() {
        this.socket.emit("playerCalled", this.props.currentUser.username)
    }


    sendRaiseToSocket() {
        let currentBet;
        currentBet = parseInt(prompt('please enter an amount to raise'))
        this.socket.emit("playerRaised", this.props.currentUser.username, currentBet)
    }


    sendCheckToSocket() {
        this.socket.emit("playerChecked", this.props.currentUser.username)
    }

 

    sendFoldToSocket() {
        this.socket.emit("playerFolded", this.props.currentUser.username)
    }
    
    getPlayerByName(handle) {
        for (let i = 0; i < this.state.players.length; i++) {
            if (handle === this.state.players[i].handle) {
                return this.state.players[i];
            }
        }
        return null;
    }

    isMyTurn() {
        return this.props.currentUser.username === this.state.currentPlayer;
    }

    // handleNewHand(){
    //     this.state.game.communityCards = []
    //     this.state.game.deck = new Deck()
    //     this.state.game.currentPlayers = this.state.game.players.slice()
    //     this.state.game.dealHandPhase2()
    //     this.state.game.resetNextBetRound()
    //     this.setState({ CalledChecked: 0, won: false,raised:false, cycle: 0})
    // }

    componentDidMount() {
        this.socket.emit("joinPokerGame")

        this.socket.on("addPokerGamePlayer", playerObj => {
            this.state.players.push(playerObj);
            if (playerObj.handle === this.props.currentUser.username) {
                this.setState({ myCards: playerObj.hand })
            }
            this.setState(this.state);
        })

        this.socket.on("currentPokerPlayers", (players, communityCards, gameStarted) => {
            let alreadyHasPlayers = false;
            if (players.length) {
                alreadyHasPlayers = true;
            }
            this.setState({ players, communityCards, gameStarted, showCards: alreadyHasPlayers })
        })

        this.socket.on("playerCalled", (username, pot, nextUsername, communityCards, raised, bet) => {
            //changed amount to pot
            const player = this.getPlayerByName(username);
            player.bananas -= this.state.bet;
            this.setState({ pot, currentPlayer: nextUsername, communityCards, raised, bet });
        })

        this.socket.on("playerRaised", (username, amount, nextUsername, communityCards, raised, bet) => {
            const player = this.getPlayerByName(username);
            player.bananas -= amount; 
            const pot = this.state.pot + amount;
            this.setState({ pot, currentPlayer: nextUsername, communityCards, raised, bet })
        })

        this.socket.on("playerFolded", (username, nextUsername, communityCards, raised, bet) => {
            this.setState({ currentPlayer: nextUsername, communityCards, raised, bet })
        }) 

        this.socket.on("playerChecked", (username, nextUsername, communityCards, raised, bet) => {
            this.setState({ currentPlayer: nextUsername, communityCards, raised, bet })
        }) 

        this.socket.on('removePlayer', username => {
            for (let i = 0; i < this.state.players.length; i++) {
                if (this.state.players[i].handle === username) {
                    this.state.players.splice(i, 1);
                }
            }
            this.setState(this.state);
        })

        this.socket.on("alert", message => alert(message))

        this.socket.on("gameStarted", nextUsername => {
            this.setState({ gameStarted: true, currentPlayer: nextUsername, showCards: true })
        })

        this.socket.on("playerWon", () => {
            // this.setState({ gameOver: true}, () => {
            //     setTimeout(() => this.setState({ gameStarted: false}), 2000)
            // })

            this.setState({ gameOver: true, gameStarted: false })
        })

        this.socket.on("newGame", (players, nextUsername) => {
            let myCards;
            for (let i = 0; i < players.length; i++) {
                if (players[i].handle === this.props.currentUser.username) {
                    myCards = players[i].hand;
                }
            }
            this.setState({ 
                players,
                currentPlayer: nextUsername,
                myCards,
                communityCards: [],
                gameStarted: true,
                pot: 0,
                raised: false,
                gameOver: false
            })
        })
    }

    currentUserIndex(){
        for(let i=0; i< this.state.players.length; i++){
            if (this.state.players[i].handle === this.props.currentUser.username){
                return i;
            }
        }
    }

    componentWillUnmount() {
        this.socket.emit("leavePokerGame");
    }
   
    render(){ 
        let gameStarted = this.state.addedPlayer || this.state.gameStarted ? null : <button className='addPlayer' onClick={this.sendPlayerToSocket}>Add Player</button>
        let check = this.state.raised ? (<button onClick={this.sendCallToSocket}>Call</button>) : (<button onClick={this.sendCheckToSocket}>Check</button>);
        return (
            <div className='pokerbackground'>
                {
                    this.state.gameStarted && <div className="pot">
                        Pot: {this.state.pot}
                    </div>
                }

                {
                    (this.state.gameStarted || this.state.showCards) && <div className='CommunityCards'>
                        <ul className='CCpoker'>
                            {
                                this.state.communityCards.map(card =>(
                                    <li><img className='deck' src={this.imageHash[card[2]]} alt={card[2]}/></li>
                                    ))
                                    
                                }
                        </ul>
                    </div>
                }
                <div className='pokerTable'>
                    {
                        this.state.players.map((player,idx) =>{
                            if(idx < this.currentUserIndex()){
                                return <div className={`player player-${idx+1} ${player.handle === this.state.currentPlayer ? "current-player" : null}`}>{this.state.players[idx].handle}</div>
                            }else if(idx > this.currentUserIndex()){
                                return <div className={`player player-${idx+1} ${player.handle === this.state.currentPlayer ? "current-player" : null}`}>{this.state.players[idx].handle}</div>
                            }
                        })
                    }
                    {
                        this.state.players.map((player, idx) => {
                            if (idx < this.currentUserIndex()) {
                                return <div className={`balance balance-${idx + 1} ${player.handle === this.state.currentPlayer ? "current-balance" : null}`}>{this.state.players[idx].bananas}</div>
                            } else if (idx > this.currentUserIndex()) {
                                return <div className={`balance balance-${idx + 1} ${player.handle === this.state.currentPlayer ? "current-balance" : null}`}>{this.state.players[idx].bananas}</div>
                            }
                        })
                    }

                    {this.state.showCards && this.state.players[0] !== undefined && 0 !== this.currentUserIndex() &&<img className='otherPlayerCard card-11' src={this.state.showCards &&this.state.gameOver ? this.imageHash[this.state.players[0].hand[0][2]] : this.imageHash['BackCard']}></img>}
                    {this.state.showCards && this.state.players[0] !== undefined && 0 !== this.currentUserIndex() &&<img className='otherPlayerCard card-12' src={this.state.showCards &&this.state.gameOver ? this.imageHash[this.state.players[0].hand[1][2]] : this.imageHash['BackCard']}></img>}
                    {this.state.showCards && this.state.players[1] !== undefined && 1 !== this.currentUserIndex() &&<img className='otherPlayerCard card-21' src={this.state.showCards &&this.state.gameOver ? this.imageHash[this.state.players[1].hand[0][2]] : this.imageHash['BackCard']}></img>}
                    {this.state.showCards && this.state.players[1] !== undefined && 1 !== this.currentUserIndex() &&<img className='otherPlayerCard card-22' src={this.state.showCards &&this.state.gameOver ? this.imageHash[this.state.players[1].hand[1][2]] : this.imageHash['BackCard']}></img>}
                    {this.state.showCards && this.state.players[2] !== undefined && 2 !== this.currentUserIndex() &&<img className='otherPlayerCard card-31' src={this.state.showCards &&this.state.gameOver ? this.imageHash[this.state.players[2].hand[0][2]] : this.imageHash['BackCard']}></img>}
                    {this.state.showCards && this.state.players[2] !== undefined && 2 !== this.currentUserIndex() &&<img className='otherPlayerCard card-32' src={this.state.showCards &&this.state.gameOver ? this.imageHash[this.state.players[2].hand[1][2]] : this.imageHash['BackCard']}></img>}
                    {this.state.showCards && this.state.players[3] !== undefined && 3 !== this.currentUserIndex() &&<img className='otherPlayerCard card-41' src={this.state.showCards &&this.state.gameOver ? this.imageHash[this.state.players[3].hand[0][2]] : this.imageHash['BackCard']}></img>}
                    {this.state.showCards && this.state.players[3] !== undefined && 3 !== this.currentUserIndex() &&<img className='otherPlayerCard card-42' src={this.state.showCards &&this.state.gameOver ? this.imageHash[this.state.players[3].hand[1][2]] : this.imageHash['BackCard']}></img>}
                    {this.state.showCards && this.state.players[4] !== undefined && 4 !== this.currentUserIndex() &&<img className='otherPlayerCard card-51' src={this.state.showCards &&this.state.gameOver ? this.imageHash[this.state.players[4].hand[0][2]] : this.imageHash['BackCard']}></img>}
                    {this.state.showCards && this.state.players[4] !== undefined && 4 !== this.currentUserIndex() &&<img className='otherPlayerCard card-52' src={this.state.gameOver ? this.imageHash[this.state.players[4].hand[1][2]] : this.imageHash['BackCard']}></img>}

                    <img className='pokerTableImage' src={pokerTable} alt="poker table" />
                    <div className='CardsButtons'>
                        {gameStarted}
                        {this.state.gameStarted && this.state.myCards.length && <img className='playerCard' src={this.imageHash[this.state.myCards[0][2]]}/>}
                        {this.state.gameStarted && this.state.myCards.length && <img className='playerCard' src={this.imageHash[this.state.myCards[1][2]]}/>}
                        <div className='buttons'>
                        {this.state.gameStarted && this.state.myCards.length && <strong>Your Balance: {this.getPlayerByName(this.props.currentUser.username).bananas}</strong>}
                            <div className='test'>
                                {this.state.gameStarted && this.isMyTurn() ? check : <button disabled>Check</button>}
                                {/* {this.state.gameStarted ? <button onClick ={this.sendCallToSocket}>Call</button> : <button disabled>Call</button>} */}
                                {this.state.gameStarted && this.isMyTurn() ? <button onClick ={this.sendRaiseToSocket}>Raise</button> : <button disabled>Raise</button>}
                                {this.state.gameStarted && this.isMyTurn() ? <button onClick ={this.sendFoldToSocket}> Fold</button> : <button disabled>Fold</button>}
                            </div>
                            {this.state.currentPlayer && <strong>{this.state.currentPlayer}'s turn</strong>}
                            {this.state.bet > 0 && <strong>{this.state.bet} to call</strong>}
                        </div>
                    </div>
                    <GameChat socket={this.socket} /> 
                </div>
            </div>
        )
    }
}
export default Poker