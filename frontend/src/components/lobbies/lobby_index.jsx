import React from "react";
import LobbyIndexItem from "./lobby_index_item";

class LobbiesIndex extends React.Component {
    constructor(props) {
        super(props)
        this.socket = this.props.socket;
        this.state = { lobby: null, password: "", errors: null }
        this.selectLobby = this.selectLobby.bind(this);
        this.handleType = this.handleType.bind(this);
        this.handleJoin = this.handleJoin.bind(this);
    }

    componentDidMount() {
        this.socket.emit("getLobbies");
        this.socket.on("receiveLobbies", lobbyData => this.setState({ lobbies: lobbyData}));
        this.props.fetchLobbies()
    }

    selectLobby(lobby) {
        this.setState({ lobby, errors: null, password: "" })
    }

    handleType(e) {
        this.setState({ password: e.currentTarget.value })
    }

    handleJoin(e) {
        e.preventDefault();
        const { lobby } = this.state
        if (lobby.currentCapacity >=lobby.maxCapacity) {
            this.setState({ errors: "Lobby is full"})
        } else if (lobby.password) {
            if (this.state.password === lobby.password) {
                this.props.history.push(`/lobbies/${lobby._id}/game`)
            } else {
                this.setState({ errors: "Invalid Password" })
            }
        } else {
            this.props.history.push(`/lobbies/${lobby._id}/game`)
        }
    }

    render() {
        return (
            <div className="lobby-index-container">
                <h2>Lobbies</h2>
                <div className="lobby-index-header">
                    <div className="lobby-name-div">
                        <span>Lobby Name</span>
                    </div>
                    <div className="lobby-info-div">
                        <span>Password</span>
                        <span>No. Players</span>
                    </div>
                </div>
                <ul className="lobby-index">
                    {
                        this.props.lobbies.map(lobby => {
                            return <LobbyIndexItem lobby={lobby} key={lobby._id} selectLobby={this.selectLobby}/>
                        })
                    }
                </ul>
                <div className="lobby-index-footer">
                    {this.state.lobby && <span>{this.state.lobby.lobbyName}</span>}
                    <form onSubmit={this.handleJoin}>
                        {this.state.lobby && this.state.errors && <span className="lobby-index-errors">{this.state.errors}</span>}
                        {this.state.lobby && this.state.lobby.password && <input autoFocus className={this.state.errors ? "errors" : null} value={this.state.password} onChange={this.handleType} type="password" placeholder="password"></input>}
                        {this.state.lobby && <button type="submit" id="join-lobby">Join Lobby</button>}
                    </form>
                </div>
            </div>
        )
    }
}


export default LobbiesIndex;


// lobbiesCollection = {
//     1: {
//         players = [];
        
//     }
// }