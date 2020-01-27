import * as LobbyAPIUtil from "../util/lobby_api_util";

export const RECEIVE_LOBBIES = "RECEIVE_LOBBIES";
export const RECEIVE_A_LOBBY = "RECEIVE_A_LOBBY";

const receiveLobbies = lobbies => ({
    type: RECEIVE_LOBBIES,
    lobbies
})

const receiveALobby = lobby => ({
    type: RECEIVE_A_LOBBY,
    lobby
})

export const fetchLobbies = () => dispatch => LobbyAPIUtil.fetchLobbies()
    .then(lobbies => dispatch(receiveLobbies(lobbies)));


export const createLobby = lobbyData => dispatch => LobbyAPIUtil.createLobby(lobbyData)
    .then(lobby => dispatch(receiveALobby(lobby)));

// export const fetchALobby = lobby