import React from 'react';

class GameChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            messages: []
        }
        this.socket = this.props.socket
        this.handleSubmit  = this.handleSubmit.bind(this)
        this.receivePokerMessage = this.receivePokerMessage.bind(this);
        this.playerFoldedMessage = this.playerFoldedMessage.bind(this);
        this.playerCalledMessage = this.playerCalledMessage.bind(this);
        this.playerRaisedMessage = this.playerRaisedMessage.bind(this);
        this.playerCheckedMessage = this.playerCheckedMessage.bind(this);
        this.playerWonMessage = this.playerWonMessage.bind(this);
        this.needMorePlayersMessage = this.needMorePlayersMessage.bind(this);
        this.aboutToStartMessage = this.aboutToStartMessage.bind(this);
        this.removePlayerMessage = this.removePlayerMessage.bind(this);
        this.pokerPlayerJoinedMessage = this.pokerPlayerJoinedMessage.bind(this);
    }

    receivePokerMessage(data) {
        this.state.messages.push(data)
        this.setState(this.state)
    }

    playerFoldedMessage(username) {
        this.state.messages.push(`${username} has folded`)
        this.setState(this.state)
    }

    playerCalledMessage(username) {
        this.state.messages.push(`${username} has called`)
        this.setState(this.state)
    }

    playerRaisedMessage(username, amount) {
        this.state.messages.push(`${username} has raised by ${amount}`)
        this.setState(this.state)
    }

    playerCheckedMessage(username) {
        this.state.messages.push(`${username} has checked`)
        this.setState(this.state)
    }

    pokerPlayerJoinedMessage(playerObj) {
        this.state.messages.push(`${playerObj.handle} has joined the game`)
        this.setState(this.state)
    }

    playerWonMessage({username, amount}) {
        this.state.messages.push(`${username} has won ${amount} bananas!`);
        this.state.messages.push(`Next hand starting in 10 seconds...`);
        this.setState(this.state)
    }

    needMorePlayersMessage() {
        this.state.messages.push("Waiting for more players");
        this.setState(this.state);
    }

    aboutToStartMessage() {
        this.state.messages.push("Game starting in 3 seconds...");
        setTimeout(() => {
            this.state.messages.push("Game starting in 2 seconds...");
            this.setState(this.state);
        }, 1000)
        setTimeout(() => {
            this.state.messages.push("Game starting in 1 seconds...");
            this.setState(this.state);
        }, 2000)
        this.setState(this.state);
    }

    removePlayerMessage(username) {
        this.state.messages.push(`${username} has left the game`);
        this.setState(this.state)
    }
    componentDidMount(){ 
        this.socket.on("receivePokerMessage", this.receivePokerMessage);
        this.socket.on("playerFolded", this.playerFoldedMessage);
        this.socket.on("playerCalled", this.playerCalledMessage);
        this.socket.on("playerRaised", this.playerRaisedMessage);
        this.socket.on("playerChecked", this.playerCheckedMessage);
        this.socket.on("addPokerGamePlayer", this.pokerPlayerJoinedMessage);
        this.socket.on("playerWon", this.playerWonMessage);
        this.socket.on("needMorePlayers", this.needMorePlayersMessage);
        this.socket.on("aboutToStart", this.aboutToStartMessage);
        this.socket.on("removePlayer", this.removePlayerMessage);
    }

    componentWillUnmount() {
        this.socket.off("receivePokerMessage", this.receivePokerMessage);
        this.socket.off("playerFolded", this.playerFoldedMessage);
        this.socket.off("playerCalled", this.playerCalledMessage);
        this.socket.off("playerRaised", this.playerRaisedMessage);
        this.socket.off("playerChecked", this.playerCheckedMessage);
        this.socket.off("addPokerGamePlayer", this.pokerPlayerJoinedMessage);
        this.socket.off("playerWon", this.playerWonMessage);
        this.socket.off("needMorePlayers", this.needMorePlayersMessage);
        this.socket.off("aboutToStart", this.aboutToStartMessage);
        this.socket.off("removePlayer", this.removePlayerMessage);
    }

    componentDidUpdate(prevProps, prevState){
        this.updateScroll();
    }
    
    
    updateScroll() {
        var element = document.getElementById("game-chat-text");
        element.scrollTop = element.scrollHeight;
    }

    handleChange(field){
        return e => this.setState({
            [field]: e.currentTarget.value
        });
    }

    handleSubmit(e){
        e.preventDefault();
        this.socket.emit("pokerChat", {
            user: this.props.currentUser.username,
            message: this.state.message
        })

        this.setState({
            message:''
        })
    }

    render() {
        let messages = this.state.messages
        return (
            <div className="game-chat-panel">
                <div className='game-chat-text' id='game-chat-text'>
                    <ul className='game-chat-content'>
                    {
                        messages.map( (message,idx) => {
                            let selectClass = (message.user === this.props.currentUser.username) ? 'me' : 'him';
                            if (!message.user) {
                                return (
                                    <div key={idx} className="game-message">
                                        <li>
                                            {message}
                                        </li>
                                    </div>
                                )
                            } else if(idx === 0 || message.user !== messages[idx-1].user){
                                return (   
                                    <div key={idx} className={`message-content`}>
                                        <span className={`message-data-name-${selectClass}`} > 
                                            {message.user.toUpperCase()}
                                        </span> 
                                        <li className={selectClass}>
                                            {message.message}
                                        </li>
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={idx} className={`message-content`}>
                                        <li className={selectClass}>
                                            {message.message}
                                        </li>
                                    </div>
                                )
                            }

                        })
                    }
                    </ul>
                </div>
                <div className='game-chat-form'>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text"
                            name="message-to-send"
                            value={this.state.message}
                            onChange={this.handleChange('message')}
                            id="message-to-send"
                            placeholder="Type your message"
                            autoComplete="off"
                        />
                    </form>
                </div>
            </div>
        )
    }

}

export default GameChat

