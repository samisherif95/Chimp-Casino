import { connect } from 'react-redux';
import { logout } from '../../actions/session_actions';
import { openModal } from '../../actions/modal_actions';
import { withRouter } from "react-router-dom";

import NavBar from './navbar';

const mapStateToProps = state => ({
    loggedIn: state.session.isAuthenticated
});

const mDTP = dispatch => ({
    logout: () => dispatch(logout()),
    openModal: modal => dispatch(openModal(modal))
})

export default withRouter(connect(mapStateToProps, mDTP)(NavBar))