import React from 'react';
const io = require('socket.io-client');

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            messages: []
        }
        this.socket = process.env.NODE_ENV === 'production' ? io() : io('http://localhost:8000');
        this.handleSubmit  = this.handleSubmit.bind(this)
    }

    componentDidMount(){ 
        this.socket.on("receiveMessage", (data) => {
            this.state.messages.push(data)
                this.setState(this.state)
            }
        )
    }

    componentDidUpdate(prevProps, prevState){
        this.updateScroll();
    }
    
    updateScroll() {
        var element = document.getElementById("chat-text");
        element.scrollTop = element.scrollHeight;
    }

    handleChange(field){
        return e => this.setState({
            [field]: e.currentTarget.value
        });
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
                            if(idx === 0 || message.user !== messages[idx-1].user){
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