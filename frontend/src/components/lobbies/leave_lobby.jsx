import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { closeModal } from "../../actions/modal_actions";

const LeaveLobby = ({history, closeModal, socket}) => {
    const handleYes = () => {
        closeModal();
        history.push("/lobbies");
    }

    const handleNo = () => {
        closeModal();
    }

    return (
        <div className="leave-lobby">
            <h2>Leave Lobby?</h2>
            <div className="leave-lobby-buttons">
                <button id="leave-lobby-yes" onClick={handleYes}>Yes</button>
                <button id="leave-lobby-no" onClick={handleNo}>No</button>
            </div>
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    closeModal: () => dispatch(closeModal())
})

export default withRouter(connect(null, mapDispatchToProps)(LeaveLobby))