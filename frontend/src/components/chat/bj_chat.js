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
    this.addPlayerToBJ = this.addPlayerToBJ.bind(this);
    this.receiveBJMessage = this.receiveBJMessage.bind(this);
    this.playerBustMessage = this.playerBustMessage.bind(this);
    this.playerHitMessage = this.playerHitMessage.bind(this);
    this.playerStandMessage = this.playerStandMessage.bind(this);
    this.playerBetMessage = this.playerBetMessage.bind(this);
    this.resetBJGameMessage = this.resetBJGameMessage.bind(this);
    this.winOrLoseMessage = this.winOrLoseMessage.bind(this);
  }

  addPlayerToBJ(username) {
      this.state.messages.push(`${username} has joined the game`)
      this.setState(this.state)
  }

  receiveBJMessage(data) {
      this.state.messages.push(data)
      this.setState(this.state)
  }

  playerBustMessage(username) {
      this.state.messages.push(`${username} has busted!!`)
      this.setState(this.state)
  }

  playerHitMessage(username) {
      this.state.messages.push(`${username} hits`)
      this.setState(this.state)
  }

  playerStandMessage(username) {
      this.state.messages.push(`${username} stands`)
      this.setState(this.state)
  }

  playerBetMessage(amount, username) {
      this.state.messages.push(`${username} bets ${amount}`);
      this.setState(this.state);
  }

  resetBJGameMessage() {
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
      setTimeout(() => {
          this.state.messages.push("Please bet")
          this.setState(this.state)
      }, 5000)
  }

  winOrLoseMessage(balance) {
    if (balance > this.props.currentUser.balance) {
        this.state.messages.push(`You won ${balance - this.props.currentUser.balance} bananas!`);
    } else {
        this.state.messages.push(`You lost. Try again!`);
    }
    this.setState(this.state);
  }

  componentDidMount() {
    this.socket.on("addPlayerToBJ", this.addPlayerToBJ);
    this.socket.on('receiveBJMessage', this.receiveBJMessage);
    this.socket.on("playerBust", this.playerBustMessage);
    this.socket.on("playerHit",this.playerHitMessage);
    this.socket.on("standOption", this.playerStandMessage);
    this.socket.on("playerBet", this.playerBetMessage);
    this.socket.on("resetBJGame", this.resetBJGameMessage);
    this.socket.on("winOrLose", this.winOrLoseMessage);
  }

  componentWillUnmount() {
    this.socket.off("addPlayerToBJ", this.addPlayerToBJ);
    this.socket.off('receiveBJMessage', this.receiveBJMessage);
    this.socket.off("playerBust", this.playerBustMessage);
    this.socket.off("playerHit", this.playerHitMessage);
    this.socket.off("standOption", this.playerStandMessage);
    this.socket.off("playerBet", this.playerBetMessage);
    this.socket.off("winOrLose", this.winOrLoseMessage);
    this.socket.off("resetBJGame", this.resetBJGameMessage);
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
