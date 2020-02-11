import * as UserAPIUtil from "../util/users_api_util";

export const RECEIVE_USERS = "RECEIVE_USERS"
export const UPDATE_CURRENT_USER_BALANCE = "UPDATE_CURRENT_USER_BALANCE"

const receiveUsers = users => ({
    type: RECEIVE_USERS,
    users
})

export const updateCurrentUserBalance = balance => ({
    type: UPDATE_CURRENT_USER_BALANCE,
    balance
})

export const fetchTopTenUsers = () => dispatch => UserAPIUtil.fetchTopTen()
    .then(users => dispatch(receiveUsers(users)))

