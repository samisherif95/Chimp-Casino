const Deck = require("../../cardDeck");
const Player = require("./player");
const PokerLogic = require("./pokerLogic");

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
    }
    
    addPlayer(username, socketId, balance){
        if(this.players.length < 6){
            this.players.unshift(new Player(username, socketId,balance))
            this.dealFirstHand();
            return true
        }else{
            return false;
        }
    }

    startGame() {
        this.turnStarted = true;
        this.currentPlayers = this.players.slice();
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
        max.bananas+= this.pot;
        const temp = this.pot;
        this.pot = 0
        return {username: max.handle, amount: temp}
    }

    resetNextBetRound(){
        this.currentPlayers.forEach(player =>{
            player.checked = false;
            player.betPlaced = false;
            player.called = false
            player.folded = false            
        })
    }

    getPlayerBySocketId(socketId) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].socketId === socketId) {
                return this.players[i]
            }
        }
        return null;
    }

    removePlayer(player) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i] === player) {
                this.players.splice(i, 1);
            }
        }
        for (let i = 0; i < this.currentPlayers.length; i++) {
            if (this.currentPlayers[i] === player) {
                this.currentPlayers.splice(i, 1);
            }
        }
    }

    exitGame(){
        this.exit = true
        this.turnStarted = false
        return this.players.shift(0)
    }



    nextTurn() {
        let temp = this.currentPlayers.shift();
        this.currentPlayers.push(temp)
        if (this.CalledChecked === this.currentPlayers.length && this.cycle === 0) {
            this.dealCommunityPhase1();
            this.CalledChecked =0;
            this.cycle +=1;
            this.raised = false
            this.bet = 0;
        } else if (this.CalledChecked === this.currentPlayers.length  && this.cycle === 1) {
            this.dealCommunityPhase2()
            this.CalledChecked = 0;
            this.cycle += 1
            this.raised = false
            this.bet = 0;
        } else if (this.CalledChecked === this.currentPlayers.length && this.cycle === 2) {
            this.dealCommunityPhase3()
            this.CalledChecked = 0;
            this.cycle += 1
            this.raised = false;
            this.bet = 0;
        } else if (this.CalledChecked === this.currentPlayers.length && this.cycle === 3) {
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

    handleRaise(amount) {
        if (amount > 0 && amount <= this.currentPlayers[0].bananas && amount > this.bet) {
            this.CalledChecked = 1;
            this.raised = true
            this.bet = amount;
            this.pot += amount;
            this.currentPlayers[0].bananas -= amount;
            this.nextTurn()
            return true;
        } else {
            return false;
        }
    }

    handleCheck() {
        this.CalledChecked +=1
        this.nextTurn()
    }

    handleFold() {
        this.currentPlayers = this.currentPlayers.slice(1);
        if (this.currentPlayers.length === 1) {
            this.cycle = 4;
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