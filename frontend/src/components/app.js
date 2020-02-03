import React from 'react';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import { Route,Switch } from 'react-router-dom';
import NavBarContainer from './nav/navbar_container';

import MainPageContainer from './main/main_page_container';
import Modal from './modal/modal';
import GameContainer from "./game";
import LobbyIndexContainer from "./lobbies/lobby_index_container";
import ChatContainer from "./chat/chat_container"
import '../app/assets/stylesheets/app.css';


const io = require('socket.io-client');

const socket = process.env.NODE_ENV === 'production' ? io() : io('http://localhost:5000');

const App = () => (
    <div>
        <Modal socket={socket} />
        
        <NavBarContainer />

        <Switch>
            <ProtectedRoute path='/lobbies/:lobbyId/game' component={GameContainer} socket={socket} />
            <ProtectedRoute exact path="/lobbies" component={LobbyIndexContainer} />
            <Route exact path="/" component={MainPageContainer} />
        </Switch>
    </div>
);

export default App;