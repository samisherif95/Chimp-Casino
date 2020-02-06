class Player {
    constructor(handle, socketId){
        // this.id = id;
        this.socketId = socketId;
        this.handle = handle;
        this.bananas = 2500;
        this.hand = [];
        this.fullcardHand = [];
        // this.folded = false;
        // this.betPlaced = false;
        // this.isturn = false;
        // this.check =  false;
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

// export default Player

module.exports = Player;