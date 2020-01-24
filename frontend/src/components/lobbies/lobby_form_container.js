import { connect } from "react-redux";
import { closeModal } from "../../actions/modal_actions";
import { createLobby } from "../../actions/lobby_actions";
import LobbyForm from "./lobby_form";

const mapStateToProps = state => ({
    a: "a"
})

const mapDispatchToProps = dispatch => ({
    closeModal: () => dispatch(closeModal()),
    createLobby: lobbyData => dispatch(createLobby(lobbyData))
})

export default connect(mapStateToProps, mapDispatchToProps)(LobbyForm);