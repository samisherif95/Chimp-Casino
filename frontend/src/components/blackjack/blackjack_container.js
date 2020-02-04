import { connect } from 'react-redux';
import Blackjack from './blackjack';

const mapStateToProps = state => ({
    currentUser: state.session.user,
});

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Blackjack);