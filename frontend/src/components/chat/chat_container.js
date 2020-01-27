import  { connect } from 'react-redux';
import { openModal } from '../../actions/modal_actions';

import Chat from './chat';

const mapStateToProps = state => ({
    currentUser: state.session.user
});

const mDTP = dispatch => ({
    openModal: modal => dispatch(openModal(modal))
})

export default connect(mapStateToProps, mDTP)(Chat)