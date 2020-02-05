const Deck = require("../../cardDeck");
const Player = require("./player");
const PokerLogic = require("./pokerLogic");
// import Deck from '../../cardDeck';
// import Player from './player';
// import PokerLogic from './pokerLogic';

class Game {
    constructor(){
        this.pot = 0;
        this.turnStarted = false
        this.deck = new Deck();
        this.pokerlogic = new PokerLogic();
        this.players = []
        this.currentPlayers =[]
        this.tempPlayers = []
        this.communityCards =[]
        this.raised = false;
        this.exit = false
        this.bet =null;
        this.smallBlindAmount = 25;
        this.BigBlindAmount = 50;
        this.CalledChecked = 0;
        this.cycle = 0;
        this.raised = false
        this.fullGame = false
    }
    
    addPlayer(username){
        if(this.players.length < 6){
            this.players.unshift(new Player(username))
            this.dealFirstHand();
            if (this.players.length > 5) {
                this.turnStarted = true;
                this.currentPlayers = this.players.slice()
                this.fullGame = true
            }
            return true
        }else{
            return false;
        }
    }
    
    dealFirstHand(){
        this.players[0].hand.push(this.deck.deal())
        this.players[0].hand.push(this.deck.deal())
    }

    dealHandPhase2(){
        this.currentPlayers.forEach(player => {
            player.hand.push(this.deck.deal());
            player.hand.push(this.deck.deal());
            player.hand.shift();
            player.hand.shift();  
        })
    }
    
    filltemp(){
        this.players.forEach(player =>{
            this.tempPlayers.push(player)
        });
    }

    getBlind(){
        this.currentPlayers.forEach((player,idx) =>{
            if(idx === 0){
                player.bigBlind = true
                this.pot += 50;
                player.bananas -= 50
            }else if(idx === 1){
                player.smallBlind = true
                this.pot += 25;
                player.bananas -= 25
            }
        })
        let temp = this.currentPlayers.shift();
        this.currentPlayers.push(temp);
    }


    // play(){
    //     console.log('playing....')
    //     if(this.players[0].checked === true|| this.players[0].folded === true){
    //         console.log('Checked or Folded')
    //     }
    //     else if (this.players[0].betPlaced){ // if higher than == raise
    //         console.log('betting....')
    //         this.bet = prompt('please enter bet')
    //         if (parseInt(this.bet) > this.players[0].bananas) {
    //             console.log('Not enough bananas. Please get more Bananas and try again')
    //         } else {
    //             this.pot += parseInt(this.bet)
    //             this.players[0].bananas -= parseInt(this.bet);
    //             this.raised = true;
    //         }
    //     }
    //     else if (this.players[0].called === true && this.bet !== null){
    //         if (this.players[0].bananas > this.bet){
    //             console.log('calling....')
    //             this.pot += parseInt(this.bet)
    //             this.players[0].bananas -= parseInt(this.bet);
    //         }else{
    //             console.log('not enough bananas')
    //         }
            
    //     }
    //     else if (this.players[0].called === true && this.bet === null ){
    //         if (this.players[0].bananas > this.BigBlindAmount) {
    //             this.pot += parseInt(this.BigBlindAmount)
    //             this.players[0].bananas -= parseInt(this.BigBlindAmount);
    //         }else{
    //             console.log('not enough bananas')
    //         }
    //     }
    //     else if (this.players[0].called === true && this.bet === null && this.players[0].smallBlind === true ){
    //         if (this.players[0].bananas > this.smallBlindAmount) {
    //             this.pot += parseInt(this.smallBlindAmount)
    //             this.players[0].bananas -= parseInt(this.smallBlindAmount);
    //         } else {
    //             console.log('not enough bananas')
    //         }
    //     }
    //     else{
    //         console.log('Please choose ONE of the buttons')
    //     }
        
    //     console.log('something is fucked')
    //     if (this.raised === true){
    //         this.resetNextBetRound();

    //         this.play();
    //     }
    // }


    dealCommunityPhase1(){
        for(let i=0; i < 3 ;i++){
            this.communityCards.push(this.deck.deal());
        }
    }

    dealCommunityPhase2(){
        this.communityCards.push(this.deck.deal());
    }

    dealCommunityPhase3(){
        this.communityCards.push(this.deck.deal());
        this.players.forEach(player =>{
            this.communityCards.forEach(card =>{
                player.fullcardHand.push(card);
            })

            player.hand.forEach(card => {
              player.fullcardHand.push(card);
            });
        }) 
    }

    getWinner(){
        this.players.forEach(player =>{
            player.score = this.pokerlogic.evaluateHand(player.fullcardHand)
        })

        let max = this.players[0]
        let maxScore = this.players[0].score
        this.players.forEach(player =>{
            if(player.score > maxScore){
                maxScore = player.score;
                max = player;
            }
        })
        max.bananas+= this.pot
        this.pot = 0
        // this.turnStarted = false
        return (max.handle)
    }

    resetNextBetRound(){
        this.currentPlayers.forEach(player =>{
            player.checked = false;
            player.betPlaced = false;
            player.called = false
            player.folded = false            
        })
    }

    exitGame(){
        this.exit = true
        this.turnStarted = false
        return this.players.shift(0)
    }

    nextTurn() {
        let temp = this.currentPlayers.shift();
        this.currentPlayers.push(temp)
        if (this.CalledChecked === this.currentPlayers.length - 1 && this.cycle === 0) {
            this.dealCommunityPhase1();
            this.CalledChecked =0;
            this.cycle +=1
        } else if (this.CalledChecked === this.currentPlayers.length - 1 && this.state.cycle === 1) {
            this.dealCommunityPhase2()
            this.CalledChecked = 0;
            this.cycle += 1
        } else if (this.CalledChecked === this.currentPlayers.length - 1 && this.state.cycle === 2) {
            this.dealCommunityPhase3()
            this.CalledChecked = 0;
            this.cycle += 1
        }
    }

    handleCall() {
        this.CalledChecked +=1
        if (this.bet !== null) {
            if (this.currentPlayers[0].bananas > this.bet) {
                this.pot += parseInt(this.bet)
                this.currentPlayers[0].bananas -= parseInt(this.bet);
            } else {
                this.pot += this.currentPlayers[0].bananas
                this.currentPlayers[0].bananas -= this.currentPlayers[0].bananas
            }
        } else if (this.bet === null && this.currentPlayers[0].bigBlind === false) {
            if (this.currentPlayers[0].bananas > this.BigBlindAmount) {
                this.pot += parseInt(this.BigBlindAmount)
                this.currentPlayers[0].bananas -= parseInt(this.BigBlindAmount);
            } else {
                this.pot += this.currentPlayers[0].bananas
                this.currentPlayers[0].bananas -= this.currentPlayers[0].bananas
            }
        } else if (this.bet === null && this.currentPlayers[0].smallBlind === false) {
            if (this.currentPlayers[0].bananas > this.smallBlindAmount) {
                this.pot += parseInt(this.smallBlindAmount)
                this.currentPlayers[0].bananas -= parseInt(this.smallBlindAmount);
            } else {
                this.pot += this.currentPlayers[0].bananas
                this.currentPlayers[0].bananas -= this.currentPlayers[0].bananas
            }
        }
        this.nextTurn()
    }

    handleRaise(username, amount) {
        console.log(amount)
        this.CalledChecked =0;
        this.raised = true
        this.bet = amount;
        this.pot += amount;
        this.currentPlayers[0].bananas -= amount;
        this.nextTurn()
    }

    handleCheck(username) {
        this.CalledChecked +=1
        this.nextTurn()
    }

    handleFold(username) {
        this.currentPlayers = this.currentPlayers.slice(1);
        if (this.currentPlayers.length === 1) {
            this.handleWinner();
        }
    }

    handleNewHand() {
        this.communityCards = []
        this.deck = new Deck()
        this.currentPlayers = this.players.slice()
        this.dealHandPhase2()
        this.resetNextBetRound();
        this.CalledChecked =0;
        this.raised = false;
        this.cycle =0;
    }

}

module.exports = Game;

// export default Game