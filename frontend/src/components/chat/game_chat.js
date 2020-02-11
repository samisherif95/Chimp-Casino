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
    }

    componentDidMount(){ 
        this.socket.on("receivePokerMessage", (data) => {
            this.state.messages.push(data)
            this.setState(this.state)
        })

        this.socket.on("playerFolded", username => {
            this.state.messages.push(`${username} has folded`)
            this.setState(this.state)
        })

        this.socket.on("playerCalled", username => {
            this.state.messages.push(`${username} has called`)
            this.setState(this.state)
        })

        this.socket.on("playerRaised", (username, amount) => {
            this.state.messages.push(`${username} has raised by ${amount}`)
            this.setState(this.state)
        })

        this.socket.on("playerChecked", username => {
            this.state.messages.push(`${username} has checked`)
            this.setState(this.state)
        })

        this.socket.on("addPokerGamePlayer", playerObj => {
            this.state.messages.push(`${playerObj.handle} has joined`)
            this.setState(this.state)
        })

        this.socket.on("playerWon", ({ username, amount }) => {
            this.state.messages.push(`${username} has won ${amount} bananas!`);
            this.state.messages.push(`Next hand starting in 10 seconds...`);
            this.setState(this.state)
        })

        this.socket.on("aboutToStart", () => {
            console.log("hitting here");
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
        })

        this.socket.on("removePlayer", username => {
            this.state.messages.push(`${username} has left the game`);
            this.setState(this.state)
        })

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

