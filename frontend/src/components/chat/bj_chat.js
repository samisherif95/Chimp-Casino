import React from 'react';

class BlackJackChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messages: []
    }
    this.socket = this.props.socket
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    this.socket.on('receiveBJMessage', (data) => {
      this.state.messages.push(data)
      this.setState(this.state)
    })

    this.socket.on("playerBust", username => {
      this.state.messages.push(`${username} busted!!`)
      this.setState(this.state)
    })

    this.socket.on("playerHit", username => {
      this.state.messages.push(`${username} has hit a card`)
      this.setState(this.state)
    })

    this.socket.on("standOption", username => {
      this.state.messages.push(`${username} stand`)
      this.setState(this.state)
    })

    this.socket.on("resetBJGame", () => {
      // console.log("ABCDEFG")
      this.state.messages.push("Game starting in 5 seconds");
      this.setState(this.state);
      setTimeout(() => {
        this.state.messages.push("Game starting in 4 seconds")
        this.setState(this.state)
      }, 1000)
      setTimeout(() => {
        this.state.messages.push("Game starting in 3 seconds")
        this.setState(this.state)
      }, 2000)
      setTimeout(() => {
        this.state.messages.push("Game starting in 2 seconds")
        this.setState(this.state)
      }, 3000)
      setTimeout(() => {
        this.state.messages.push("Game starting in 1 seconds")
        this.setState(this.state)
      }, 4000)
    })

  }

  componentDidUpdate(prevProps, prevState) {
    this.updateScroll();
  }


  updateScroll() {
    var element = document.getElementById("game-chat-text");
    element.scrollTop = element.scrollHeight;
  }

  handleChange(field) {
    return e => this.setState({
      [field]: e.currentTarget.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.socket.emit("bjChat", {
      user: this.props.currentUser.username,
      message: this.state.message
    })

    this.setState({
      message: ''
    })
  }

  render() {
    let messages = this.state.messages
    return (
      <div className="game-chat-panel">
        <div className='game-chat-text' id='game-chat-text'>
          <ul className='game-chat-content'>
            {
              messages.map((message, idx) => {
                let selectClass = (message.user === this.props.currentUser.username) ? 'me' : 'him';
                if (!message.user) {
                  return (
                    <div key={idx} className="game-message">
                      <li>
                        {message}
                      </li>
                    </div>
                  )
                } else if (idx === 0 || message.user !== messages[idx - 1].user) {
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

export default BlackJackChat;
