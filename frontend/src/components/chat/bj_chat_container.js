import { connect } from 'react-redux';

import BlackJackChat from './bj_chat';

const mapStateToProps = state => ({
  currentUser: state.session.user
});

const mDTP = dispatch => ({
})

export default connect(mapStateToProps, mDTP)(BlackJackChat)