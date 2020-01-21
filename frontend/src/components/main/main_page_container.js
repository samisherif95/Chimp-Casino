import { connect } from 'react-redux';
import { openModal, closeModal } from '../../actions/modal_actions';

import MainPage from './main_page';

const mSTP = state => ({
    loggedIn: state.session.isAuthenticated
});

const mDTP = dispatch => ({
    openLogIn: () => dispatch(openModal('login')),
    closeModal: () => dispatch(closeModal())
})

export default connect(mSTP, mDTP)(MainPage)