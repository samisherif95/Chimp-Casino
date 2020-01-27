// import React from 'react';
// import './blackjack.css';

// class Player extends React.Component {
//     constructor(props) {
//         super(props);
//         this.handleHit = this.handleHit.bind(this);
//         this.handleStand = this.handleStand.bind(this);
//         this.handleSplit = this.handleSplit.bind(this);
//         this.handleDouble = this.handleDouble.bind(this);
//     }

//     handleBet() {
//         // this.state.player.bet()
//         this.props.updateBlackjack();
//     }

//     handleHit() {
//         if (this.props.player.bust === false) {
//             this.props.player.hit()
//             if (this.props.player.bust && this.props.player.handSplit.length == 0) {
//                 this.nullAllOptions();
//             }
//             if (this.props.player.bust) {
//                 document.getElementsByClassName("blackjack-hand")[0].style.color = 'red';
//             }
//             this.props.updateBlackjack();
//         } else if (this.props.player.bustSplit === false) {
//             this.props.player.hitSplit()
//             if (this.props.player.bustSplit) {
//                 document.getElementsByClassName("blackjack-handSplit")[0].style.color = 'red';
//                 this.nullAllOptions();
//             }
//             this.props.updateBlackjack();
//         }

//         if (this.props.checkBust()) {
//             if (this.props.checkAllBust()) {
//                 this.newRound();
//             }
//         }
//         this.props.updateBlackjack();
//     }   

//     handleStand() {
//         this.props.player.stand();
//         this.nullAllOptions();

//         // Renders that logic into the front end 
//         this.props.checkStand();
//         // This updates the state and rerenders the blackjack component with the current phase still being 
//         // the options phase. It doesn't know it's last in the cycle 
//         this.props.updateBlackjack();
//     }

//     handleSplit() {
//         this.props.player.splitHand();
//         if (this.props.player.split) {
//             this.props.updateBlackjack();
//         }
//     }

//     handleDouble() {
//         this.props.player.doubleDownHand();
//         this.props.updateBlackjack();
//     }



//     render() {
//         const { player } = this.props; 

//         const hand = (player.hand ? player.hand.map(card => {
//             return <li className="blackjack-hand-cards" key={card}> {card} </li>
//         }) : null)

//         const handSplit = (player.split ? player.handSplit.map(card => {
//             return <li className="blackjack-handSplit-cards" key={card}> {card} </li>;
//         }) : null)

//         const splitPool = ( player.poolSplit > 0 ? <div> Split Balance: {player.poolSplit} </div> : null)

//         return (
//           <div>
//             <div> Player Container </div>

//             <section className="blackjack-player-info">
//                 <div className="blackjack-player-id">
//                     Player: {player.userId}

//                 </div>
//                 <div className="blackjack-player-poolSplit">
//                     {splitPool}
//                 </div>
//                 <div className="blackjack-player-balance">
//                     Balance: {player.balance}
//                 </div>
//             </section>

//             <div className="">
//                 Hand:
//                 <ul className="blackjack-hand">
//                     {hand}
//                 </ul>
                
//                 {player.split ? "Split Hand" : null}
//                 <ul className="blackjack-handSplit">
//                     {handSplit}
//                 </ul>
//             </div>

//             <div className="blackjack-hand-values">
//                 Hand value: {player.getHandValue(player.hand)}
//                 {player.split ? <div>Split Hand value: {player.getHandValue(player.handSplit)} </div> : null}
//             </div>
//           </div>
//         );
//     }
// }

// export default Player;
