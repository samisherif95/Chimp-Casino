 import React from 'react';
const io = require('socket.io-client');



class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        }
        this.socket = process.env.NODE_ENV === 'production' ? io() : io('http://localhost:8000');
        this.handleTest = this.handleTest.bind(this)
    }

    componentDidMount(){ 
        this.socket.on("receiveMessage", (data) => {
        this.state.messages.push(data)
            this.setState(this.state)
        })
        
    }

    handleTest(){
        this.socket.emit("chat", "kfjsdahfjklsdahklfjshakfhweohdcknc")
    }

    render() {
        return (
            <div className='chat-container'>
                <div className='chat-box'>
                    
                </div>



                {/* <button onClick={this.handleTest}>Click me</button>
                <ul>
                    {
                        this.state.messages.map( (message, idx) => <li key={idx} >{message}</li> )
                    }
                </ul> */}
            </div>
        )
    }

}

export default Chat