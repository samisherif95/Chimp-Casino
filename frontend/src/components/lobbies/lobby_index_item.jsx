import React from "react";

const LobbyIndexItem = ({lobby}) => {
    return (
        <li className="lobby-index-item">
            <div className="lobby-name-div">
                <span className="lobby-name-span">{lobby.lobbyName}</span>
            </div>
            <div className="lobby-info-div">
                <span>{lobby.password ? <i className="fas fa-lock"></i> : <i className="fas fa-lock-open"></i>}</span>
                <span>12/16</span>
                <span>{lobby.balanceLimit ? lobby.balanceLimit : "n/a"}</span>
            </div>
        </li>
    )
}

export default LobbyIndexItem