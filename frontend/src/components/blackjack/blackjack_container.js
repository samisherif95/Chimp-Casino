import { connect } from 'react-redux';
import Blackjack from './blackjack';

const mapStateToProps = state => ({
    currentUser: state.session.user
});

export default connect(mapStateToProps)(Blackjack);