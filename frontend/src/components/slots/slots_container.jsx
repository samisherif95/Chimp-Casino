import { connect } from "react-redux";

import SlotGame from "./slots";

const mapStateToProps = state => ({
    currentUser: state.session.user
});

export default connect(mapStateToProps, null)(SlotGame);