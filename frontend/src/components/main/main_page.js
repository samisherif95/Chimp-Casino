import React from 'react';

class MainPage extends React.Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }


    handleClick(){
        if(this.props.loggedIn){
            this.props.history.push('/lobbies');
        }else{
            this.props.openLogIn();
        }
    }

    render() {
        return (
            <div className='main-page'>
              <div className='main-grid'>
                <div className='contact-list'>
                  <div className='contact-title'>
                    <h2>Contact Info</h2>
                  </div>
                  <div className='contact-info'>
                    <div>
                      <h4>Evans Shao</h4>
                      <div>
                        <a href="http://linkedin.com/in/evans-shao-b76201139/" target="_blank"><i class="fab fa-linkedin fa-3x"></i></a>
                        <a href="https://github.com/shaoevans" target="_blank"><i class="fab fa-github fa-3x"></i></a>
                      </div>  
                    </div>
                    <div>
                      <h4>Sebastian Mendo</h4>
                      <div>
                        <a href="https://www.linkedin.com/in/sebastian-mendo-lopez-8730b1126/" target="_blank"><i class="fab fa-linkedin fa-3x"></i></a>
                        <a href="https://github.com/sebastianmendo1995" target="_blank"><i class="fab fa-github fa-3x"></i></a>
                      </div>  
                    </div>
                    <div>
                      <h4>Duke Nguyen</h4>
                      <div>
                        <a href="https://www.linkedin.com/in/nguyenduke/" target="_blank"><i class="fab fa-linkedin fa-3x"></i></a>
                        <a href="https://github.com/hnguyen1179" target="_blank"><i class="fab fa-github fa-3x"></i></a>
                      </div>  
                    </div>
                    <div>
                      <h4>Sami Ellaboudy</h4>
                      <div>
                        <a href="https://www.linkedin.com/in/sami-ellaboudy-667883161/" target="_blank"><i class="fab fa-linkedin fa-3x"></i></a>
                        <a href="https://github.com/samisherif95" target="_blank"><i class="fab fa-github fa-3x"></i></a>
                      </div>  
                    </div>
                  </div>
                </div>
                <div className='game-info'>
                  <div className='game-info-title'> 
                    <h2>Game Info</h2>
                  </div>
                  <div className='game-info-body'>
                    <p>
                      This is a classic RPG style monkey-themed casino game that is intended for you to enjoy with your friends!
                      To play this game you must create an account and then you will be prompted to choose a lobby or you can create one for you and your friends.
                      That lobby can be password protected or not depending on your prefrence. Once in a side a lobby you have your monkey avatar,
                      which you can move via the arrow key buttons. To play a game just move your monkey towards that specific game and once you are close enough
                      it will start up.<br/>
                      Enjoy and don't lose your bananas all at once.
                    </p>
                  </div>
                  <div className='game-info-play'>
                    <button className='btn btn-play' onClick={this.handleClick}>Start Playing</button>
                  </div>
                </div>
              </div>
                
                
                {/* <div className='play-button-container'>
                </div> */}
            </div>
        );
    }
}

export default MainPage;
