import React from 'react';

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            messages: [
                { user: "Helpful Chimp", message: "Welcome! Press the jukebox to mute the game"}, 
                { user: "Helpful Chimp", message: "If you are alone, please approach the slots machine or the blackjack table to play games!" },
                { user: "Helpful Chimp", message: "Use the arrow keys to move around" },
                { user: "Helpful Chimp", message: "To leave this room, just go to the door!" }
            ]
        }
        this.socket = this.props.socket
        this.handleSubmit  = this.handleSubmit.bind(this)
        this.onEnterPress = this.onEnterPress.bind(this);
    }

    componentDidMount(){ 
        this.socket.on("receiveMessage", (data) => {
            this.state.messages.push(data)
                this.setState(this.state)
            }
        )

        this.socket.on("slotsWinner", (username, amount) => {
            this.state.messages.push(`${username} has won ${amount} bananas in slots!`)
            this.setState(this.state);
        })
    }

    componentDidUpdate(prevProps, prevState){
        this.updateScroll();
    }
    
    updateScroll() {
        var element = document.getElementById("chat-text");
        element.scrollTop = element.scrollHeight;
    }

    handleChange(field) {
        return e => this.setState({
              [field]: e.currentTarget.value
            }); 
    }

    
    onEnterPress(e) {
      if (e.keyCode === 13 && e.shiftKey === false) {
        this.handleSubmit(e);
      }
    }

    handleSubmit(e){
        e.preventDefault();
        this.socket.emit("chat", {
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
            <div className="chat-panel">
                <div className='chat-text' id='chat-text'>
                    <ul className='chat-content'>
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
                <div className='chat-form'>
                    <form onSubmit={this.handleSubmit}>
                        <textarea
                            value={this.state.message}
                            onKeyDown={this.onEnterPress}
                            onChange={this.handleChange('message')}
                            id="message-to-send"
                            placeholder="Type your message"
                        />
                        <input type="submit" value="Send" id='send'/>
                    </form>
                </div>
            </div>
        )
    }

}

export default Chat

