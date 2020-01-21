import React from 'react';

class MainPage extends React.Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }


    handleClick(){
        if(this.props.loggedIn){
            this.props.history.push('/game');
        }else{
            this.props.openLogIn();
        }
    }

    render() {
        return (
            <div className='main-page'>
                <div className='play-button-container'>
                    <button className='btn btn-play' onClick={this.handleClick}>Start Playing</button>
                </div>
            </div>
        );
    }
}

export default MainPage;