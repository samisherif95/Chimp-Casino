import React from 'react';
import { closeModal } from '../../actions/modal_actions';
import { connect } from 'react-redux';
import LoginFormContainer from '../session/login_form_container';
import SignupFormContainer from '../session/signup_form_container';
import BlackjackContainer from '../../components/blackjack/blackjack_container';
import LobbyFormContainer from "../lobbies/lobby_form_container";
import LobbyIndexContainer from '../lobbies/lobby_index_container';
import LeaveLobby from "../lobbies/leave_lobby";
import LeaderBoard from "../users/leaderboard";
import PokerContainer from '../poker/poker_container';
// import LeaveLobby from "../lobbies/leave_lobby";

const Modal = ({ modal, closeModal, socket }) => {
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
        case 'blackjack':
            component = <BlackjackContainer />;
            break;
        case 'poker':
            component =<PokerContainer socket={socket} />
            break;
        case 'createLobby':
            component = <LobbyFormContainer />;
            break;
        case 'leaveLobby':
            component = <LeaveLobby socket={socket}/>;
            break;
        case 'leaderboard':
            component = <LeaderBoard />;
            break;
        case 'blackjack':
            component = <BlackjackContainer socket={socket}/>;
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