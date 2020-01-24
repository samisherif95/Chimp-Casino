import React from 'react';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import { Switch, Route } from 'react-router-dom';
import NavBarContainer from './nav/navbar_container';

import MainPageContainer from './main/main_page_container';
import Modal from './modal/modal';
import ChatContainer from './chat/chat_container';
import GameContainer from "./game";
import LobbyIndexContainer from "./lobbies/lobby_index_container"



import '../app/assets/stylesheets/app.css';


const App = () => (
    <div>
        <Modal />
        
        <NavBarContainer />

        <Route path='/game' component={ChatContainer} />
        <Route path='/games' component={GameContainer} />
        <Route path='/lobbies' component={LobbyIndexContainer} />
        <Switch>
            <Route exact path="/" component={MainPageContainer} />
        </Switch>
    </div>
);

export default App;