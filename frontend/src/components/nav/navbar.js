import React from 'react';
import { Link } from 'react-router-dom'
import logo from '../../app/assets/images/logo.jpeg'

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.logoutUser = this.logoutUser.bind(this);
        this.getLinks = this.getLinks.bind(this);
    }

    logoutUser(e) {
        e.preventDefault();
        this.props.logout();
    }

    getLinks() {
        if (this.props.loggedIn) {
            return (
                <ul className='nav'>
                    <li><button className='btn btn-logout' onClick={() => this.props.openModal('createLobby')}>New Lobby</button></li>
                    <li><button className='btn btn-logout' onClick={this.logoutUser}>Logout</button></li>
                </ul>
            );
        } else {
            return (
                <ul className='nav'>
                    <li><a onClick={() => this.props.openModal('signup')}>Sign Up</a></li>
                    <li><a onClick={() => this.props.openModal('login')}>Log In</a> </li>
                </ul>
            );
        }
    }

    render() {
        return (
            <div className='navbar'>
                <Link to='/'>
                    <div className='logo-container'>
                        <img src={logo} />
                        <h2>Chimp Casino</h2>
                    </div>
                </Link>
                {this.getLinks()}
            </div>
        );
    }
}

export default NavBar;