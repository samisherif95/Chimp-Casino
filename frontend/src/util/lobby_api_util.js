import axios from 'axios';

export const createLobby = lobbyData => {
    return axios.post('/api/lobbies', lobbyData);
};

export const fetchLobbies = () => {
    return axios.get('/api/lobbies')
}