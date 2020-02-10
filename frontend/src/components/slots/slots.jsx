import React from 'react';

import slot1 from './assets/images/slot1.png';
import slot2 from './assets/images/slot2.png';
import slot3 from './assets/images/slot3.png';
import slot4 from './assets/images/slot4.png';
import slot5 from './assets/images/slot5.png';
import slot6 from './assets/images/slot6.png';

import './assets/stylesheets/slots.css';
import SlotMachine from './slotmachine';


class SlotGame extends React.Component {
    constructor(props){
        super(props);
        this.socket = this.props.socket;
        this.state = {
            balance: this.props.currentUser.balance,
            bet: "",
            results: {}
        };
        this.onComplete = this.onComplete.bind(this);
    }

    componentDidMount(){
        this.results = {
            machine1: document.querySelector('#machine1Result'),
            machine2: document.querySelector('#machine2Result'),
            machine3: document.querySelector('#machine3Result')
        };
        const el1 = document.querySelector('#machine1');
        const el2 = document.querySelector('#machine2');
        const el3 = document.querySelector('#machine3');
        this.machine1 = new SlotMachine(el1, { active: 0 });
        this.machine2 = new SlotMachine(el2, { active: 1 });
        this.machine3 = new SlotMachine(el3, { active: 2 });

    }

    componentWillUnmount() {

    }

    onComplete(active, machineNumber) {
        if(machineNumber === 1){
            this.results['machine1'].innerText = active;
        } else if(machineNumber === 2){
            this.results['machine2'].innerText = active;
        } else if(machineNumber === 3){
            this.results['machine3'].innerText = active;
            this.checkResult();
        }
    }

    handleClick(){
        if (this.state.bet === '') {
            alert('Please enter a BET')
        } else {
            let newBalance = this.state.balance - this.state.bet;
            if(newBalance < 0){
                alert('YOU DON\'T HAVE ENOUGH BALANCE')
            }else{
                this.setState({
                    balance: newBalance
                })
                this.props.currentUser.balance = this.state.balance
                this.machine1.shuffle(5, this.onComplete, 1);
                setTimeout(() => this.machine2.shuffle(5, this.onComplete, 2), 500);
                setTimeout(() => this.machine3.shuffle(5, this.onComplete, 3), 1000);
            }
        }
    }

    checkResult() {
        const slot1 = parseInt(this.results.machine1.innerText);
        const slot2 = parseInt(this.results.machine2.innerText);
        const slot3 = parseInt(this.results.machine3.innerText);
        let newBalance;
        if (slot1 <= 5 && slot2 <= 5 && slot3 <= 5) {
            newBalance = this.state.balance + this.state.bet * 2;
            this.setState({
                balance: newBalance
            })
            this.props.currentUser.balance = this.state.balance;
        } else if (slot1 <= 10 && slot2 <= 10 && slot3 <= 10 && slot1 > 5 && slot2 > 5 && slot3 > 5) {
            newBalance = this.state.balance + this.state.bet * 3;
            this.setState({
                balance: newBalance
            })
            this.props.currentUser.balance = this.state.balance;
        } else if (slot1 <= 14 && slot2 <= 14 && slot3 <= 14 && slot1 > 10 && slot2 > 10 && slot3 > 10) {
            newBalance = this.state.balance + this.state.bet * 4;
            this.setState({
                balance: newBalance
            })
            this.props.currentUser.balance = this.state.balance;
        } else if (slot1 <= 17 && slot2 <= 17 && slot3 <= 17 && slot1 > 14 && slot2 > 14 && slot3 > 14) {
            newBalance = this.state.balance + this.state.bet * 8;
            this.setState({
                balance: newBalance
            })
            this.props.currentUser.balance = this.state.balance;
        } else if (slot1 <= 19 && slot2 <= 19 && slot3 <= 19 && slot1 > 17 && slot2 > 17 && slot3 > 17) {
            newBalance = this.state.balance + this.state.bet * 10;
            this.setState({
                balance: newBalance
            })
            this.props.currentUser.balance = this.state.balance;
        } else if (slot1 === 20 && slot2 === 20 && slot3 === 20) {
            newBalance = this.state.balance + this.state.bet * 20;
            this.setState({
                balance: newBalance
            })
            this.props.currentUser.balance = this.state.balance;
        }

        this.socket.emit("slotChange", this.state.balance);
    }

    handleType(type) {
        return (e) => {
            if (Number(e.currentTarget.value) || e.currentTarget.value === "") {
                this.setState({
                    [type]: e.currentTarget.value
                })
            }
        }
    }

    render(){

        return(
            <div id="randomize">
                <div className="container">
                    <h1>Monkey Slots!</h1>

                    <div className="row">
                        <div className="col-sm-4">
                            <div>
                                <div id="machine1" className="randomizeMachine">
                                    <div><img src={slot1} /></div>
                                    <div><img src={slot1} /></div>
                                    <div><img src={slot1} /></div>
                                    <div><img src={slot1} /></div>
                                    <div><img src={slot1} /></div>
                                    <div><img src={slot1} /></div>
                                    <div><img src={slot2} /></div>
                                    <div><img src={slot2} /></div>
                                    <div><img src={slot2} /></div>
                                    <div><img src={slot2} /></div>
                                    <div><img src={slot2} /></div>
                                    <div><img src={slot3} /></div>
                                    <div><img src={slot3} /></div>
                                    <div><img src={slot3} /></div>
                                    <div><img src={slot3} /></div>
                                    <div><img src={slot4} /></div>
                                    <div><img src={slot4} /></div>
                                    <div><img src={slot4} /></div>
                                    <div><img src={slot5} /></div>
                                    <div><img src={slot5} /></div>
                                    <div><img src={slot6} /></div>
                                </div>
                            </div>
                            <div id="machine1Result" className="col-xs-4 machineResult"></div>
                        </div>

                        <div className="col-sm-4">
                            <div>
                                <div id="machine2" className="randomizeMachine">
                                    <div><img src={slot1} /></div>
                                    <div><img src={slot1} /></div>
                                    <div><img src={slot1} /></div>
                                    <div><img src={slot1} /></div>
                                    <div><img src={slot1} /></div>
                                    <div><img src={slot1} /></div>
                                    <div><img src={slot2} /></div>
                                    <div><img src={slot2} /></div>
                                    <div><img src={slot2} /></div>
                                    <div><img src={slot2} /></div>
                                    <div><img src={slot2} /></div>
                                    <div><img src={slot3} /></div>
                                    <div><img src={slot3} /></div>
                                    <div><img src={slot3} /></div>
                                    <div><img src={slot3} /></div>
                                    <div><img src={slot4} /></div>
                                    <div><img src={slot4} /></div>
                                    <div><img src={slot4} /></div>
                                    <div><img src={slot5} /></div>
                                    <div><img src={slot5} /></div>
                                    <div><img src={slot6} /></div>
                                </div>
                            </div>
                            <div id="machine2Result" className="col-xs-4 machineResult"></div>
                        </div>

                        <div className="col-sm-4">
                            <div>
                                <div id="machine3" className="randomizeMachine">
                                    <div><img src={slot1} /></div>
                                    <div><img src={slot1} /></div>
                                    <div><img src={slot1} /></div>
                                    <div><img src={slot1} /></div>
                                    <div><img src={slot1} /></div>
                                    <div><img src={slot1} /></div>
                                    <div><img src={slot2} /></div>
                                    <div><img src={slot2} /></div>
                                    <div><img src={slot2} /></div>
                                    <div><img src={slot2} /></div>
                                    <div><img src={slot2} /></div>
                                    <div><img src={slot3} /></div>
                                    <div><img src={slot3} /></div>
                                    <div><img src={slot3} /></div>
                                    <div><img src={slot3} /></div>
                                    <div><img src={slot4} /></div>
                                    <div><img src={slot4} /></div>
                                    <div><img src={slot4} /></div>
                                    <div><img src={slot5} /></div>
                                    <div><img src={slot5} /></div>
                                    <div><img src={slot6} /></div>
                                </div>
                            </div>
                            <div id="machine3Result" className="col-xs-4 machineResult"></div>
                        </div>

                    </div>
                    <div className="btn-group btn-group-justified" role="group">
                        <button id="randomizeButton" type="button" className="btn btn-danger btn-lg" onClick={() => this.handleClick()}>TAKE A SPIN</button>
                    </div>
                    <div className="row">
                        <div className="col-sm-10 offset-sm-1">
                            <pre><code id="codeBlock2"></code></pre>
                        </div>
                    </div>

                    <div className='user-stats'>
                        <div className='user-balance'>
                            <div>
                                <h5>Your Balance:</h5> 
                                <h3>{this.state.balance}</h3>
                            </div>
                        </div>
                        <div className='user-bet'>
                            <input
                                type="text"
                                value={this.state.bet}
                                onChange={this.handleType("bet")}
                                placeholder='BET'
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SlotGame;