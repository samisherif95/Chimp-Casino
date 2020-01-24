import React from 'react';
import { closeModal } from '../../actions/modal_actions';
import { connect } from 'react-redux';
import LoginFormContainer from '../session/login_form_container';
import SignupFormContainer from '../session/signup_form_container';
import LobbyFormContainer from "../lobbies/lobby_form_container";
import LobbyIndexContainer from '../lobbies/lobby_index_container';

const Modal = ({ modal, closeModal }) => {
    if (!modal) {
        return null;
    }
    let component;
    switch (modal) {
        case 'login':
            component = <LoginFormContainer />;
            break;
        case 'signup':
            component = <SignupFormContainer />;
            break;
        case 'createLobby':
            component = <LobbyFormContainer />;
            break;
        case 'lobbyIndex':
            component = <LobbyIndexContainer />
            break;
        default:
            return null;
    }
    return (
        <div className="modal-screen" onClick={closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {component}
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        modal: state.ui.modal
    };
};

const mapDispatchToProps = dispatch => {
    return {
        closeModal: () => dispatch(closeModal())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Modal);