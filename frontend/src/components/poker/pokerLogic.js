class PokerLogic {
    evaluateHand(cards){
        if(this.RoyalFlush(cards)) return 120;
        else if (this.StraightFlush(cards)) return 110;
        else if (this.FourOfAKind(cards)) return 100;
        else if (this.FullHouse(cards)) return 90;
        else if (this.Flush(cards)) return 80;
        else if (this.Straight(cards)) return 70;
        else if (this.ThreeOfAKind(cards)) return 60;
        else if (this.TwoPair(cards)) return 50;
        else if (this.Pair(cards)) return 40;
        else{ return this.HighCard(cards) }
    }

    // each win version will be passed the cards on the table plus the 2 cards in each
    //hand as an array and will this evaluate all 7 cards to find win match.
    // cards = [[ace,hearts] , [2,spades] ]
    RoyalFlush(cards){
        //this part checks if the suits of at least 5 cards are the same
        const suitCount = {}
        cards.forEach(card => {
            if(!suitCount[card[1]]) suitCount[card[1]] = 0;
            suitCount[card[1]] +=1;
        })
        let sameSuit = Object.values(suitCount).some(suites => suites >= 5);

        //checks if the cards aree ace 10 jack queen king
        let result = [];
        let count = 0
        cards.forEach(card =>{
            if(card[0] === 'A' && !result.includes(card[0])){
                result.push(card[0]);
                count+=1;
            } else if (card[0] === 10 && !result.includes(card[0])){
                result.push(card[0]);
                count += 1;
            } else if (card[0] === 'J' && !result.includes(card[0])) {
                result.push(card[0]);
                count += 1;
            } else if (card[0] === 'Q' && !result.includes(card[0])) {
                result.push(card[0]);
                count += 1;
            } else if (card[0] === 'K' && !result.includes(card[0])) {
                result.push(card[0]);
                count += 1;
            }
        })  
        let isRoyalty = false;
        if(count === 5) isRoyalty = true;

        return(sameSuit && isRoyalty)
    }

    //not correct code
    StraightFlush(cards){
        const suitCount = {}
        cards.forEach(card => {
            if (!suitCount[card[1]]) suitCount[card[1]] = 0;
            suitCount[card[1]] += 1;
        })
        let sameSuit = Object.values(suitCount).some(suites => suites >= 5);
        let cardValues = []
        cards.forEach(card =>{
            if(card[0] === 'Ace'){
                cardValues.push(14)
                cardValues.push(1)
            }
            else if (card[0] === 'J') {cardValues.push(11)}
            else if (card[0] === 'Q') {cardValues.push(12)}
            else if (card[0] === 'K') {cardValues.push(13)}
            else {cardValues.push(card[0])}
        })
        cardValues = cardValues.sort(function (a, b) { return a - b });
        let inOrder = false;
        for (let i = 0; i < cardValues.length - 5; i++) {
            let arr = []
            for (let j = 0; j < cardValues.length - 1; j++) {
                if (cardValues[j] + 1 !== cardValues[j + 1]) {
                    break;
                } else {
                    arr.push(cardValues[j])
                }
                if (arr.length === 5) inOrder = true
            }
        }
        return(sameSuit && inOrder)
    }

    FourOfAKind(cards){
        const valueCount = {}
        cards.forEach(card => {
            if (!valueCount[card[0]]) valueCount[card[0]] = 0;
            valueCount[card[0]] += 1;
        })
        return Object.values(valueCount).some(values => values === 4);
    }

    FullHouse(cards){
        const valueCount = {}
        cards.forEach(card => {
            if (!valueCount[card[0]]) valueCount[card[0]] = 0;
            valueCount[card[0]] += 1;
        })
        let threeKind = false;
        let twoKind = false;
        Object.values(valueCount).forEach(value => {
            if (value === 2) { twoKind = true}
            if (value === 3) { threeKind = true}

        })
        return (threeKind && twoKind)
    }

    Flush(cards){
        const suitCount = {}
        cards.forEach(card => {
            if (!suitCount[card[1]]) suitCount[card[1]] = 0;
            suitCount[card[1]] += 1;
        })
        return Object.values(suitCount).some(suites => suites >= 5);
    }

    
    Straight(cards){
        let cardValues = []
        cards.forEach(card => {
            if (card[0] === 'A') { 
                cardValues.push(14) 
                cardValues.push(1)
            }
            else if (card[0] === 'J') { cardValues.push(11) }
            else if (card[0] === 'Q') { cardValues.push(12) }
            else if (card[0] === 'K') { cardValues.push(13) }
            else { cardValues.push(card[0]) }
        })
        cardValues = cardValues.sort(function (a, b) { return a - b });
        for (let i = 0; i < cardValues.length - 5; i++){
            let arr = []
            for (let j = 0; j < cardValues.length-1; j++) {
                if(cardValues[j]+1 !== cardValues[j+1]){
                    break;
                }else{
                    arr.push(cardValues[j])
                }   
                if(arr.length === 5) return true
            }
        }
    }


    ThreeOfAKind(cards){
        const valueCount = {}
        cards.forEach(card => {
            if (!valueCount[card[0]]) valueCount[card[0]] = 0;
            valueCount[card[0]] += 1;
        })
        return Object.values(valueCount).some(values => values === 3);
    }

    TwoPair(cards){
        const valueCount = {}
        cards.forEach(card => {
            if (!valueCount[card[0]]) valueCount[card[0]] = 0;
            valueCount[card[0]] += 1;
        })
        let count = 0
        Object.values(valueCount).forEach(value =>{
            if (value === 2){count+=1}
        })

        if(count > 1){
            return true
        }else{
            return false
        }
    }

    Pair(cards){
        const valueCount = {}
        cards.forEach(card => {
            if (!valueCount[card[0]]) valueCount[card[0]] = 0;
            valueCount[card[0]] += 1;
        })
        let count = 0
        Object.values(valueCount).forEach(value => {
            if (value === 2) { count += 1 }
        })

        if (count === 1) {
            return true
        } else {
            return false
        }
    }

    HighCard(cards){
        let cardValues = []
        cards.forEach(card => {
            if (card[0] === 'A') { cardValues.push(14)}
            else if (card[0] === 'J') { cardValues.push(11) }
            else if (card[0] === 'Q') { cardValues.push(12) }
            else if (card[0] === 'K') { cardValues.push(13) }
            else { cardValues.push(card[0]) }
        })
        cardValues = cardValues.sort(function (a, b) { return a - b });
        return (cardValues[cardValues.length - 1] + cardValues[cardValues.length - 2])
    }
}

// export default PokerLogic;
module.exports = PokerLogic;