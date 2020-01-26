import { combineReducers } from "redux";

import usersReducer from "./users_reducer";
import lobbiesReducer from "./lobbies_reducer";

const entitiesReducer = combineReducers({
    users: usersReducer,
    lobbies: lobbiesReducer
});

export default entitiesReducer;