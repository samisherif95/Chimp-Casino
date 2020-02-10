import { connect } from "react-redux";
import LobbiesIndex from "./lobby_index";
import { fetchLobbies } from "../../actions/lobby_actions"; 
import { openModal } from "../../actions/modal_actions";


const mapStateToProps = state => ({
    lobbies: Object.values(state.entities.lobbies)
})

const mapDispatchToProps = dispatch => ({
    fetchLobbies: () => dispatch(fetchLobbies()),
    openModal: modal => dispatch(openModal(modal))
})

export default connect(mapStateToProps, mapDispatchToProps)(LobbiesIndex);