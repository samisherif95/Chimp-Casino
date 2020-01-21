class Player {
    constructor(id,name){
        this.id = id;
        this.name = name;
        this.bananas = 2500;
        this.folded = false;
    }

    placeBet(bet){
        if(bet > this.bananas+bet){
            return 'Not enough bananas. Please get more Bananas and try again'
        }else{
            this.bananas-= bet;
        }
    }

    playerFold(){
        this.folded = true
    }

    playerUnfolded(){
        this.folded = false
    }
}

export default Player