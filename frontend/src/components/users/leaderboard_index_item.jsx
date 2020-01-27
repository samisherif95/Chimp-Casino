import React from "react";

const LeaderBoardIndexItem = ({ user, idx }) => {
    const crown = () => {
        if (idx === 0) {
            return  <i className="fas fa-crown gold"></i>
        } else if (idx === 1) {
            return <i className="fas fa-crown silver"></i>
        } else if (idx === 2) {
            return <i className="fas fa-crown bronze"></i>
        } else {
            return <span>#{idx+1}</span>
        }
    }

    return (
        <li className="leaderboard-index-item">
            <div className="leaderboard-ranking-div">
                <span>{crown()}</span>
            </div>
            <div className="leaderboard-name-div">
                <span>{user.username}</span>
            </div>
            <div className="leaderboard-info-div">
                <span>{user.balance}</span>
            </div>
        </li>
    )
}

export default LeaderBoardIndexItem