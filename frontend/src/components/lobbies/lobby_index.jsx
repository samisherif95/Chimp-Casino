import React from "react";
import LobbyIndexItem from "./lobby_index_item";
import { connect } from "react-redux";

class LobbiesIndex extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.fetchLobbies()
    }

    render() {
        return (
            <div className="lobby-index-container">
                <h2>Lobbies</h2>
                <div className="lobby-index-header">
                    <div className="lobby-name-div">
                        <span>Lobby Name</span>
                    </div>
                    <div className="lobby-info-div">
                        <span>Password</span>
                        <span>No. Players</span>
                        <span>Balance Limit</span>
                    </div>
                </div>
                <ul className="lobby-index">
                    {
                        this.props.lobbies.map(lobby => {
                            return <LobbyIndexItem lobby={lobby} key={lobby._id}/>
                        })
                    }
                </ul>
            </div>
        )
    }
}


export default LobbiesIndex;


// lobbiesCollection = {
//     1: {
//         players = [];
        
//     }
// }