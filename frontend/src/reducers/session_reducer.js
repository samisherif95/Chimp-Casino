import {
    RECEIVE_CURRENT_USER,
    RECEIVE_USER_LOGOUT,
} from '../actions/session_actions';
import { UPDATE_CURRENT_USER_BALANCE } from "../actions/user_actions";

const initialState = {
    isAuthenticated: false,
    user: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case RECEIVE_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !!action.currentUser,
                user: action.currentUser
            };
        case RECEIVE_USER_LOGOUT:
            return {
                isAuthenticated: false,
                user: undefined
            };
        case UPDATE_CURRENT_USER_BALANCE:
            const nextState = Object.assign({}, state);
            nextState.user.balance = action.balance
            return nextState;
        default:
            return state;
    }
}