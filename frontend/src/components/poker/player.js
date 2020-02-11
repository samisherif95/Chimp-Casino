class Player {
    constructor(handle, socketId, balance){
        this.socketId = socketId;
        this.handle = handle;
        this.bananas = balance;
        this.hand = [];
        this.fullcardHand = [];
        this.bigBlind = false;
        this.smallBlind = false;
        this.called = false;
        this.score = 0;
    }
    playerCalled(){
        this.called = true
    }

    playerFold(){
        this.folded = true
        this.hand = []
    }
    
    checked(){
        this.check = true
    }

    placeBet(){
        this.betPlaced = true;
    }
}

module.exports = Player;