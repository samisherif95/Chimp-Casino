import { connect } from "react-redux";
import LobbiesIndex from "./lobby_index";
import { fetchLobbies } from "../../actions/lobby_actions"; 

const mapStateToProps = state => ({
    lobbies: Object.values(state.entities.lobbies)
})

const mapDispatchToProps = dispatch => ({
    fetchLobbies: () => dispatch(fetchLobbies())

})

export default connect(mapStateToProps, mapDispatchToProps)(LobbiesIndex);