import { connect } from "react-redux";
import { closeModal } from "../../actions/modal_actions";
import { createLobby } from "../../actions/lobby_actions";
import { withRouter } from "react-router-dom";
import LobbyForm from "./lobby_form";

const mapStateToProps = state => ({
    a: "a"
})

const mapDispatchToProps = dispatch => ({
    closeModal: () => dispatch(closeModal()),
    createLobby: lobbyData => dispatch(createLobby(lobbyData))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LobbyForm));