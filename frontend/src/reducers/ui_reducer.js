import { combineReducers } from 'redux';
import  modal from './modal_reducer';
import inspectedUser from './inspected_user_reducer'

export default combineReducers({
    modal,
    inspectedUser
});
