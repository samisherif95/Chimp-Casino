import  { connect } from 'react-redux';

import Chat from './chat';

const mapStateToProps = state => ({
    currentUser: state.session.user
});

const mDTP = dispatch => ({
})

export default connect(mapStateToProps, mDTP)(Chat)