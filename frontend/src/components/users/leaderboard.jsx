import React from "react";
import { connect } from "react-redux";
import { fetchTopTenUsers } from "../../actions/user_actions";
import LeaderBoardIndexItem from "./leaderboard_index_item";

class LeaderBoard extends React.Component {

  componentDidMount() {
    this.props.fetchTopTenUsers();
  }

  render() {
    return (
      <div>
        <h2>Top Chimps</h2>
        <div className="leaderboard-header">
          <div className="leaderboard-ranking-div">
            <span>Rank</span>
          </div>
          <div className="leaderboard-name-div">
            <span>Username</span>
          </div>
          <div className="leaderboard-info-div">
            <span>Bananas</span>
          </div>
        </div>
        <ul className="leaderboard-index">
          {this.props.users.map((user, idx) => {
            return (
              <LeaderBoardIndexItem user={user} key={user._id} idx={idx} />
            );
          })}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: Object.values(state.entities.users)
});

const mapDispatchToProps = dispatch => ({
  fetchTopTenUsers: () => dispatch(fetchTopTenUsers())
});

export default connect(mapStateToProps, mapDispatchToProps)(LeaderBoard);
