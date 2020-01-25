import React from "react";

class LobbyForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lobbyName: "",
            password: "",
            balanceLimit: "",
        }
        this.handleType = this.handleType.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleType(type) {
        return (e) => {
            if (type === "balanceLimit") {
                if (Number(e.currentTarget.value) || e.currentTarget.value === "") {
                    this.setState({
                        [type]: e.currentTarget.value
                    })
                }
            } else {    
                this.setState({
                    [type]: e.currentTarget.value
                })
            }
        }
    }


    handleCancel() {
        this.props.closeModal();
    }

    handleSubmit(e) {
        e.preventDefault();
        const lobbyData = {};
        lobbyData.lobbyName = this.state.lobbyName
        if (this.state.password.length) {
            lobbyData.password = this.state.password
        }
        if (this.state.balanceLimit.length) {
            lobbyData.balanceLimit = this.state.balanceLimit
        }
        this.props.createLobby(lobbyData)
            .then(payload => {
                // console.log(payload.lobby.data)
                this.props.closeModal();
                this.props.history.push(`/lobbies/${payload.lobby.data._id}/game`);
            })
    }

    render() {
        return (
            <div>
                <div className="modal-banner">
                    <button onClick={this.handleCancel}>x</button>
                </div>
                <h2>Create Lobby</h2>
                <form onSubmit={this.handleSubmit}className="lobby-form">
                    <input type="text" value={this.state.lobbyName} onChange={this.handleType("lobbyName")} placeholder="Lobby Name" id="form-lobby-name"/>
                    <input type="password" value={this.state.password} onChange={this.handleType("password")} placeholder="Password (optional)" id="form-lobby-password"/>
                    <input type="text" value={this.state.balanceLimit} onChange={this.handleType("balanceLimit")} placeholder="Balance Limit (optional)" id="form-lobby-balance"/>
                    <button id="submit-lobby" type="submit">Make Lobby</button>
                </form>
            </div>
        )
    }
}

export default LobbyForm