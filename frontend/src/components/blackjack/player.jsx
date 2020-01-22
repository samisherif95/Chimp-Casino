import React from 'react';
import Player from '../blackjack/player';

class Player extends React.Component {
    constructor(props) {
        super(props);

        // the props passed down will input the userId and the # currency
        // used in order to instantiate the player
        const player = new Player(1, 1000);
        this.state = {
          pool: player.pool, // Default: 0
          poolSplit: player.poolSplit, // Default: 0
          balance: player.balance, // Default: 1000
          doubleDown: player.doubleDown, // Default: false
          split: player.split, // Default: false
          hand: player.hand, // Default: []
          handSplit: player.handSplit, // Default: []
          stand: player.stand, // Default: false
          bet: player.bet // Default: false
        };
    }

    render() {
        return (
            <div>
                hello
            </div>
        );
    }
}

export default Player;
