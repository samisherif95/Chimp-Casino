import { RECEIVE_LOBBIES, RECEIVE_A_LOBBY }from "../actions/lobby_actions"


const lobbiesReducer = (state = {}, action) => {
    Object.freeze(state);
    let nextState;
    switch (action.type) {
        case RECEIVE_LOBBIES:
            nextState = {};
            action.lobbies.data.forEach(lobby => {
                nextState[lobby._id] = lobby
            })
            return nextState;
        case RECEIVE_A_LOBBY:
            nextState = Object.assign({}, state,  { [action.lobby.data._id]: action.lobby.data });
            return nextState;
        default: 
            return state;
    }
}   

export default lobbiesReducer