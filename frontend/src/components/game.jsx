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
import logoSvg from "../app/assets/images/logo-svg.png";
import islandDreams from "../app/assets/audio/island-dreams.mp3"
import ChatContainer from './chat/chat_container';
const io = require('socket.io-client');



// Initialize the Phaser Game object and set default game window size

class GameContainer extends React.Component {
    constructor(props) {
        super(props);
        this.socket = process.env.NODE_ENV === 'production' ? io() : io('http://localhost:7000');
        this.lobbyId = this.props.match.params.lobbyId;
        const game = this;
        // const phaserGameDiv = document.getElementById("phaser-game")


        // this.createPlayer = (playerInfo) => {
        //     this.container = this.add.container(200, 250)
        //     this.physics.world.enable(this.container);
    
        //     this.player = this.physics.add.sprite(20, 35, 'monkey2', 56)
        //         .setInteractive()
        //         .on('pointerdown', () => this.props.openModal('createLobby'))
           
        //     this.player.setCollideWorldbounds(true);
        //     this.text = this.add.text(0, 0, 'evans');
        //     this.text.font = "Arial"
        //     this.container.add(this.player)
        //     this.container.add(this.text)
    
        //     this.container.body.setCollideWorldBounds(true);
        // }


        this.config = {
            width: 1024,
            height: 768,
            type: Phaser.AUTO,    
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
                    this.load.image('logo-svg', logoSvg)
                    this.load.audio('island-dreams', islandDreams)

                },
                create: function() {
            
                    this.add.sprite(0, 0, 'casino-wall').setOrigin(0, 0)
                    this.add.image(0, 190, 'carpet').setOrigin(0, 0)
                    this.add.sprite(615, 60, 'slots').setOrigin(0, 0)
                    this.add.sprite(315, 20, 'wood-plank').setOrigin(0, 0)
                    this.add.sprite(750, 0, 'millionaire').setOrigin(0, 0)
                    // this.add.sprite(5, 83, 'statue').setOrigin(0, 0)
                    this.add.sprite(490, 60, 'jukebox').setOrigin(0, 0)
        
                    this.furnitures = this.physics.add.staticGroup()
                    this.furnitures.create(0, 0, 'casino-wall').setOrigin(0, 0)
                    this.furnitures.create(315, 30, 'wood-plank').setOrigin(0, 0)
                    // this.furnitures.create(315, 80, 'bulletin-board').setOrigin(0, 0)
                    this.furnitures.create(750, 0, 'millionaire').setOrigin(0, 0)
                    this.furnitures.create(60, 140, 'statue')
                    this.furnitures.create(490, 60, 'jukebox').setOrigin(0, 0)
                    
                    this.pokerTable = this.physics.add.staticGroup()
                    this.pokerCollision = this.pokerTable.create(270, 550, 'poker-col')
                    
                    this.blackjackTable = this.physics.add.staticGroup()
                    this.blackjackCollision = this.blackjackTable.create(740, 550, 'blackjack-col')
                    
                    this.slotsTable = this.physics.add.staticGroup()
                    this.slotsCollision = this.slotsTable.create(802, 132, 'slots-col')

                    this.casinoDoor = this.physics.add.staticGroup()
                    this.casinoDoor.create(100, 0, 'casino-door').setOrigin(0, 0)
                    
                    this.add.sprite(580, 470, 'blackjack').setOrigin(0, 0)
                    this.add.sprite(80, 400, 'poker').setOrigin(0, 0)
                    // this.add.sprite(100, 0, 'casino-door').setOrigin(0, 0)
                    this.add.sprite(615, 60, 'slots').setOrigin(0, 0)

                    this.bulletinBoard = this.physics.add.staticGroup();
                    this.bulletinBoard.create(315, 90, 'bulletin-board').setOrigin(0, 0)
                    // this.add.sprite(315, 80, 'bulletin-board').setOrigin(0, 0)

                    // player creation
                    this.createPlayer = playerName => {
                        this.container = this.add.container(200, 250)
                        this.physics.world.enable(this.container);
                
                        this.player = this.physics.add.sprite(20, 35, 'monkey2', 56)
                            .setInteractive({ useHandCursor: true })
                            // .on('pointerdown', () => game.props.openModal('createLobby'))
                            .on('pointerdown', () => {
                                if (this.music.isPlaying) {
                                    this.music.pause();
                                } else {
                                    this.music.resume();
                                }
                                    
                            })
                        
                        this.text = this.add.text(0, 0, playerName);
                        this.text.font = "Arial"
                        this.container.add(this.player)
                        this.container.add(this.text)
                
                        this.container.body.setCollideWorldBounds(true);
                    }

                    // create other players 
                    this.otherPlayers = this.physics.add.group();

                    this.createOtherPlayer = playerInfo => {
                        const otherPlayerContainer = this.add.container(playerInfo.x, playerInfo.y)
                        const otherPlayer = this.add.sprite(20, 35, 'monkey2', 56)
                            .setInteractive({ useHandCursor: true })
                            .on('pointerdown', () => game.props.openModal('createLobby'))
                        otherPlayer.setTint(Math.random() * 0xffffff);
                        const text = this.add.text(0, 0, playerInfo.username)
                        otherPlayerContainer.add(otherPlayer)
                        otherPlayerContainer.add(text)
                        otherPlayerContainer.playerId = playerInfo.playerId;
                        this.otherPlayers.add(otherPlayerContainer);
                    }

                    // move other players
                    this.moveOtherPlayer = playerInfo => {
                        this.otherPlayers.getChildren().forEach(player => {
                            if (playerInfo.playerId === player.playerId) {
                                player.setPosition(playerInfo.x, playerInfo.y);
                            }
                        })
                    }

                    // destroy player on disconnect
                    this.destroyPlayer = playerId => {
                        this.otherPlayers.getChildren().forEach(player => {
                            if (playerId === player.playerId) {
                              player.destroy();
                            }
                        })
                    }
                    

                    // bind functions
                    game.moveOtherPlayer = this.moveOtherPlayer.bind(this);
                    game.createOtherPlayer = this.createOtherPlayer.bind(this);
                    game.createPlayer = this.createPlayer.bind(this);
                    game.destroyPlayer = this.destroyPlayer.bind(this);


                    // audio
                    this.music = this.sound.add('island-dreams')
                    const musicConfig = {
                        mute: false,
                        volume: 1,
                        rate: 1,
                        detune: 0,
                        seek: 0,
                        loop: true,
                        delay: 0
                    }
                    this.music.play()


                    //sound button
                    // this.soundOn = this.add.sprite(50, 50, 'sound-on')

                    //balance
                    this.balance =this.add.sprite(50, 720, 'logo-svg')
                    this.balance.setScale(0.25)
                    this.add.text(100, 700, 1000, { font: "42px 'Sans Serif'", fill: "#fcd600", align: "center" })


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
                    if (this.container) {
                        this.container.body.setVelocityX(0)
                        this.container.body.setVelocityY(0)

                        this.physics.add.collider(this.container, this.furnitures)
                        this.physics.add.collider(this.container, this.pokerTable, () => game.props.openModal("poker"))
                        this.physics.add.collider(this.container, this.blackjackTable, () => game.props.openModal("poker"));
                        this.physics.add.collider(this.container, this.slotsTable, () => game.props.openModal("poker"))
                        this.physics.add.collider(this.container, this.casinoDoor, () => game.props.openModal("leaveLobby"))
                        this.physics.add.collider(this.container, this.bulletinBoard, () => game.props.openModal("leaderboard"))
                                    
                        if (this.cursors.left.isDown && !game.props.modal) {
                            // this.player.body.velocity.x = -150
                            this.container.body.setVelocityX(-150)
    
                            this.player.anims.play('left', true)
                        } else if (this.cursors.right.isDown && !game.props.modal) {
                            // this.player.body.velocity.x = 150
                            this.container.body.setVelocityX(150)
                        
                            this.player.anims.play('right', true)
                        } else if (this.cursors.up.isDown && !game.props.modal) {
                            // this.player.body.velocity.y = -150
                            this.container.body.setVelocityY(-150)
                        
                            this.player.anims.play('up', true)
                        } else if (this.cursors.down.isDown && !game.props.modal) {
                            // this.player.body.velocity.y = 150
                            this.container.body.setVelocityY(150)
                        
                            this.player.anims.play('down', true)
                        } else {
                            this.player.anims.stop()
                        }
    
                        // emit player movement
                        const x = this.container.x;
                        const y = this.container.y;
                        if (this.container.oldPosition && (x !== this.container.oldPosition.x || y !== this.container.oldPosition.y)) {
                            game.socket.emit('playerMovement', { x, y }, game.lobbyId );
                        }
                        // save old position data
                        this.container.oldPosition = {
                            x: this.container.x,
                            y: this.container.y,
                        };
                    }   
                },
                parent: "phaser-game"
            }
        }
    }





    componentDidMount() {
        this.socket.on("requestLobby", () => {
            this.socket.emit("joinLobby", this.lobbyId, this.props.currentUser.username);
        })

        this.socket.on("lobbyPlayers", (players) => {
            Object.values(players).forEach(player => {
                if (player.playerId === this.socket.id) {
                    setTimeout(() => this.createPlayer(player.username), 2000)
                } else {
                    setTimeout(() => this.createOtherPlayer(player), 2000)
                }
            })
        })

        this.socket.on("newPlayer", player => {
            setTimeout(() => this.createOtherPlayer(player), 2000)
        })

        this.socket.on("playerMoved", (player) => {
            this.moveOtherPlayer(player);
        })

        this.socket.on("removePlayer", player => {
            this.destroyPlayer(player)
        })
        // console.log(this.config.scene)

        // this.socket.on("playerMoved", movedPlayer => {
        //     console.log(movedPlayer)
        // })

    }

    // componentDidUpdate(prevProps) {
    //     if (this.props.match.params.lobbyId !== prevProps.props.match.params.lobbyId) {

    //     }
    // }


    render() {
        return (
            // <div id="phaser-game">

            // </div>
            <div className="game-container">
                <IonPhaser game={this.config} />
                <ChatContainer />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    currentUser: state.session.user,
    modal: state.ui.modal
})

const mapDispatchToProps = dispatch => ({
    openModal: (modal, currentModal) => {
        if (!currentModal) {
            dispatch(openModal(modal))
        }
    }
})




export default connect(mapStateToProps, mapDispatchToProps)(GameContainer);
  
  
  