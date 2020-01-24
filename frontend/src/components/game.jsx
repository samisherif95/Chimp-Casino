// Linted with standardJS - https://standardjs.com/
import { openModal } from "../actions/modal_actions";
import { connect } from "react-redux";
import Phaser from "phaser";
import React from "react";
import { IonPhaser } from '@ion-phaser/react'
import casinoWall from "../app/assets/images/casino-wall.png";
import monkeys from "../app/assets/images/monkeys.png";
import carpet from "../app/assets/images/carpet.jpg";
import blackjack from "../app/assets/images/blackjack.png";
import poker from "../app/assets/images/poker.png";
import slots from "../app/assets/images/slots.png";
import casinoDoor from "../app/assets/images/casino-door.png";
import woodPlank from "../app/assets/images/wood-plank.png";
import bulletinBoard from "../app/assets/images/bulletin-board.png";
import millionaire from "../app/assets/images/millionaire.png";
import statue from "../app/assets/images/statue.png";
import jukebox from "../app/assets/images/jukebox.png";
import pokerCol from "../app/assets/images/poker-col.png"
import blackjackCol from "../app/assets/images/blackjack-col.png"
import slotsCol from "../app/assets/images/slots-col.png"


// Initialize the Phaser Game object and set default game window size

class GameContainer extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props)
        const game = this;
        this.state = {
            width: 1024,
            height: 768,
            type: Phaser.CANVAS,    
            // type: Phaser.AUTO,    
            physics: {
                default: 'arcade',
            },
            scene: {
                preload: function() {
                    this.load.image('casino-wall', casinoWall)
                    this.load.spritesheet('monkey2', monkeys, {frameWidth: 80, frameHeight: 80})
                    // this.load.spritesheet('monkey2', monkeys, 80, 80)
                    this.load.image('carpet', carpet)
                    this.load.image('blackjack', blackjack)
                    this.load.image('poker', poker)
                    this.load.image('slots', slots)
                    this.load.image('casino-door', casinoDoor)
                    this.load.image('wood-plank', woodPlank)
                    this.load.image('bulletin-board', bulletinBoard)
                    this.load.image('millionaire', millionaire)
                    this.load.image('statue', statue)
                    this.load.image('jukebox', jukebox)
                    this.load.image('poker-col', pokerCol)
                    this.load.image('blackjack-col', blackjackCol)
                    this.load.image('slots-col', slotsCol)
                },
                create: function() {
            
                    this.add.sprite(0, 0, 'casino-wall').setOrigin(0, 0)
                    // this.add.sprite(500, 500, 'carpet')
                    // this.add.sprite(0, 190, 'carpet')
                    this.add.image(0, 190, 'carpet').setOrigin(0, 0)
                    // this.add.sprite(580, 440, 'blackjack').setOrigin(0, 0)
                    // this.add.sprite(50, 400, 'poker').setOrigin(0, 0)
                    this.add.sprite(615, 60, 'slots').setOrigin(0, 0)
                    this.add.sprite(315, 20, 'wood-plank').setOrigin(0, 0)
                    this.add.sprite(315, 80, 'bulletin-board').setOrigin(0, 0)
                    this.add.sprite(750, 0, 'millionaire').setOrigin(0, 0)
                    this.add.sprite(5, 83, 'statue').setOrigin(0, 0)
                    this.add.sprite(490, 60, 'jukebox').setOrigin(0, 0)
        
                    this.furnitures = this.physics.add.staticGroup()
                    this.furnitures.create(0, 0, 'casino-wall').setOrigin(0, 0)
                    this.furnitures.create(315, 20, 'wood-plank').setOrigin(0, 0)
                    this.furnitures.create(315, 80, 'bulletin-board').setOrigin(0, 0)
                    this.furnitures.create(750, 0, 'millionaire').setOrigin(0, 0)
                    this.furnitures.create(5, 83, 'statue').setOrigin(0, 0)
                    this.furnitures.create(490, 60, 'jukebox').setOrigin(0, 0)
                    
                    this.pokerTable = this.physics.add.staticGroup()
                    
                    this.pokerCollision = this.pokerTable.create(120, 460, 'poker-col').setOrigin(0, 0)
                    
                    this.blackjackTable = this.physics.add.staticGroup()
                    
                    this.blackjackCollision = this.blackjackTable.create(600, 470, 'blackjack-col').setOrigin(0, 0)
                    
                    this.slotsTable = this.physics.add.staticGroup()
                    
                    this.slotsCollision = this.slotsTable.create(615, 60, 'slots-col').setOrigin(0, 0)
                    
                    this.add.sprite(580, 470, 'blackjack').setOrigin(0, 0)
                    this.add.sprite(80, 400, 'poker').setOrigin(0, 0)
                    this.add.sprite(100, 0, 'casino-door').setOrigin(0, 0)
                    this.add.sprite(615, 60, 'slots').setOrigin(0, 0)
                    
                    this.player = this.physics.add.sprite(200, 250, 'monkey2', 56)
                    // this.player.frame = 56;
                    
                    
                    this.player.setCollideWorldBounds(true)
                       

                    this.anims.create({
                        key: 'left',
                        frames: this.anims.generateFrameNumbers('monkey2', { start: 63, end: 65 }),
                        frameRate: 10,
                        repeat: -1
                    });

                    this.anims.create({
                        key: 'right',
                        frames: this.anims.generateFrameNumbers('monkey2', { start: 75, end: 77 }),
                        frameRate: 10,
                        repeat: -1
                    });

                    this.anims.create({
                        key: 'up',
                        frames: this.anims.generateFrameNumbers('monkey2', { start: 87, end: 89 }),
                        frameRate: 10,
                        repeat: -1
                    });

                    this.anims.create({
                        key: 'down',
                        frames: this.anims.generateFrameNumbers('monkey2', { start: 51, end: 53 }),
                        frameRate: 10,
                        repeat: -1
                    });


                    this.cursors = this.input.keyboard.createCursorKeys()
                },
                update: function() {
                    this.player.body.velocity.x = 0
                    this.player.body.velocity.y = 0
                    
                    this.physics.add.collider(this.player, this.furnitures)
                    this.physics.add.collider(this.player, this.pokerTable, () => game.props.openModal("lobbyIndex"))
                    this.physics.add.collider(this.player, this.blackjackTable, () => game.props.openModal("lobbyIndex"));
                    this.physics.add.collider(this.player, this.slots, () => game.props.openModal("lobbyIndex"))
                                
                    if (this.cursors.left.isDown) {
                        this.player.body.velocity.x = -150
                        
                        this.player.anims.play('left', true)
                    } else if (this.cursors.right.isDown) {
                        this.player.body.velocity.x = 150
                    
                        this.player.anims.play('right', true)
                    } else if (this.cursors.up.isDown) {
                        this.player.body.velocity.y = -150
                    
                        this.player.anims.play('up', true)
                    } else if (this.cursors.down.isDown) {
                        this.player.body.velocity.y = 150
                    
                        this.player.anims.play('down', true)
                    } else {
                        this.player.anims.stop()
                    }
                    
                },
                parent: "phaser-game"
            }
        }
    }
    render() {
        return (
            <div className="game-container">

                <IonPhaser game={this.state} />
            </div>
        )
    }
}



const mapDispatchToProps = dispatch => ({
    openModal: modal => dispatch(openModal(modal))
})




export default connect(null, mapDispatchToProps)(GameContainer);
  
  
  