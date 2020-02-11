import { connect } from 'react-redux';
import { openModal } from '../../actions/modal_actions';

import BlackJackChat from './bj_chat';

const mapStateToProps = state => ({
  currentUser: state.session.user
});

const mDTP = dispatch => ({
})

export default connect(mapStateToProps, mDTP)(BlackJackChat)