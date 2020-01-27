import Deck from '../../cardDeck';
import Player from './player';
import PokerLogic from './pokerLogic';

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
    }
    
    addPlayer(handle){
        if(this.turnStarted === false || this.players.length < 6){
            this.players.unshift(new Player(handle))
        }else{
            console.log('Turn is Full or has Started. Try again later.')
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


    play(){
        console.log('playing....')
        if(this.players[0].checked === true|| this.players[0].folded === true){
            console.log('Checked or Folded')
        }
        else if (this.players[0].betPlaced){ // if higher than == raise
            console.log('betting....')
            this.bet = prompt('please enter bet')
            if (parseInt(this.bet) > this.players[0].bananas) {
                console.log('Not enough bananas. Please get more Bananas and try again')
            } else {
                this.pot += parseInt(this.bet)
                this.players[0].bananas -= parseInt(this.bet);
                this.raised = true;
            }
        }
        else if (this.players[0].called === true && this.bet !== null){
            if (this.players[0].bananas > this.bet){
                console.log('calling....')
                this.pot += parseInt(this.bet)
                this.players[0].bananas -= parseInt(this.bet);
            }else{
                console.log('not enough bananas')
            }
            
        }
        else if (this.players[0].called === true && this.bet === null ){
            if (this.players[0].bananas > this.BigBlindAmount) {
                this.pot += parseInt(this.BigBlindAmount)
                this.players[0].bananas -= parseInt(this.BigBlindAmount);
            }else{
                console.log('not enough bananas')
            }
        }
        else if (this.players[0].called === true && this.bet === null && this.players[0].smallBlind === true ){
            if (this.players[0].bananas > this.smallBlindAmount) {
                this.pot += parseInt(this.smallBlindAmount)
                this.players[0].bananas -= parseInt(this.smallBlindAmount);
            } else {
                console.log('not enough bananas')
            }
        }
        else{
            console.log('Please choose ONE of the buttons')
        }
        
        console.log('something is fucked')
        if (this.raised === true){
            this.resetNextBetRound();

            this.play();
        }
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
}

export default Game