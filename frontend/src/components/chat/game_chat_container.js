import  { connect } from 'react-redux';

import GameChat from './game_chat';

const mapStateToProps = state => ({
    currentUser: state.session.user
});



export default connect(mapStateToProps)(GameChat)