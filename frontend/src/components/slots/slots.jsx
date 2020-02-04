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
        this.state = {
            balance: this.props.currentUser.balance,
            bet: ""
        };
    }

    componentDidMount(){
        const btn = document.querySelector('#randomizeButton');
        const results = {
            machine1: document.querySelector('#machine1Result'),
            machine2: document.querySelector('#machine2Result'),
            machine3: document.querySelector('#machine3Result')
        };
        const el1 = document.querySelector('#machine1');
        const el2 = document.querySelector('#machine2');
        const el3 = document.querySelector('#machine3');
        const machine1 = new SlotMachine(el1, { active: 0 });
        const machine2 = new SlotMachine(el2, { active: 1 });
        const machine3 = new SlotMachine(el3, { active: 2 });

        function onComplete(active) {
            results[this.element.id].innerText = `Index: ${this.active}`;
        }

        btn.addEventListener('click', () => {
            machine1.shuffle(5, onComplete);
            setTimeout(() => machine2.shuffle(5, onComplete), 500);
            setTimeout(() => machine3.shuffle(5, onComplete), 1000);
        });
    }

    handleType(type) {
        return (e) => {
            if (Number(e.currentTarget.value) || e.currentTarget.value === "") {
                console.log(this.state)
                this.setState({
                    [type]: e.currentTarget.value
                })
            }
        }
    }

    render(){

        return(
            <div id="randomize">
                <div class="container">
                    <h1>Randomize your stuff!</h1>

                    <div class="row">
                        <div class="col-sm-4">
                            <div>
                                <div id="machine1" class="randomizeMachine">
                                    <div><img src={slot1} /></div>
                                    <div><img src={slot2} /></div>
                                    <div><img src={slot3} /></div>
                                    <div><img src={slot4} /></div>
                                    <div><img src={slot5} /></div>
                                    <div><img src={slot6} /></div>
                                </div>
                            </div>
                            <div id="machine1Result" class="col-xs-4 machineResult">Index: 0</div>
                        </div>

                        <div class="col-sm-4">
                            <div>
                                <div id="machine2" class="randomizeMachine">
                                    <div><img src={slot1} /></div>
                                    <div><img src={slot2} /></div>
                                    <div><img src={slot3} /></div>
                                    <div><img src={slot4} /></div>
                                    <div><img src={slot5} /></div>
                                    <div><img src={slot6} /></div>
                                </div>
                            </div>
                            <div id="machine2Result" class="col-xs-4 machineResult">Index: 1</div>
                        </div>

                        <div class="col-sm-4">
                            <div>
                                <div id="machine3" class="randomizeMachine">
                                    <div><img src={slot1} /></div>
                                    <div><img src={slot2} /></div>
                                    <div><img src={slot3} /></div>
                                    <div><img src={slot4} /></div>
                                    <div><img src={slot5} /></div>
                                    <div><img src={slot6} /></div>
                                </div>
                            </div>
                            <div id="machine3Result" class="col-xs-4 machineResult">Index: 2</div>
                        </div>

                    </div>
                    <div class="btn-group btn-group-justified" role="group">
                        <button id="randomizeButton" type="button" class="btn btn-danger btn-lg">Shuffle</button>
                    </div>
                    {/* <div class="row">
                        <div class="col-sm-10 offset-sm-1">
                            <pre><code id="codeBlock2"></code></pre>
                        </div>
                    </div> */}
                </div>
            </div>
        )
    }
}

export default SlotGame;