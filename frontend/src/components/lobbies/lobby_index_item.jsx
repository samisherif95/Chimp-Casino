import React from "react";

const LobbyIndexItem = ({lobby, selectLobby, selectedLobby}) => {

    return (
        <li onClick={()=>selectLobby(lobby)} className={`lobby-index-item ${selectedLobby && selectedLobby._id === lobby._id ? "selected" : ""}`}>
            <div className="lobby-name-div">
                <span className="lobby-name-span">{lobby.lobbyName}</span>
            </div>
            <div className="lobby-info-div">
                <span>{lobby.password ? <i className="fas fa-lock"></i> : <i className="fas fa-lock-open"></i>}</span>
                <span>{`${lobby.currentCapacity}/${lobby.maxCapacity}`}</span>
                {/* <span>{lobby.balanceLimit ? lobby.balanceLimit : "n/a"}</span> */}
            </div>
        </li>
    )
}

export default LobbyIndexItem