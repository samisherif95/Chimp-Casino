import React from 'react';
import $ from 'jquery';
import './stylesheet/slots.css'


var completed = 0,
    imgHeight = 1374,
    posArr = [
        0, //orange
        80, //number 7 
        165, //bar
        237, //guava
        310, //banana
        378, //cherry
        454, //orange
        539, //number 7
        624, //bar
        696, //guava
        769, //banana
        837, //cherry
        913, //orange
        1000, //number 7
        1085, //bar
        1157, //guava
        1230, //banana
        1298 //cherry
    ];

var win = [];
win[0] = win[454] = win[913] = 1;
win[80] = win[539] = win[1000] = 2;
win[165] = win[624] = win[1085] = 3;
win[237] = win[696] = win[1157] = 4;
win[310] = win[769] = win[1230] = 5;
win[378] = win[837] = win[1298] = 6;


function Slot(el, max, step) {
    this.speed = 0; //speed of the slot at any point of time
    this.step = step; //speed will increase at this rate
    this.si = null; //holds setInterval object for the given slot
    this.el = el; //dom element of the slot
    this.maxSpeed = max; //max speed this slot can have
    this.pos = null; //final position of the slot    


    // $(this.el).pan({
    //     fps: 30,
    //     dir: 'down'
    // });
    // $(this.el).spStop();
}


Slot.prototype.start = function () {
    var _this = this;
    $(_this.el).addClass('motion');
    $(_this.el).spStart();
    _this.si = window.setInterval(function () {
        if (_this.speed < _this.maxSpeed) {
            _this.speed += _this.step;
            $(_this.el).spSpeed(_this.speed);
        }
    }, 100);
};


Slot.prototype.stop = function () {
    var _this = this,
        limit = 30;
    clearInterval(_this.si);
    _this.si = window.setInterval(function () {
        if (_this.speed > limit) {
            _this.speed -= _this.step;
            $(_this.el).spSpeed(_this.speed);
        }
        if (_this.speed <= limit) {
            _this.finalPos(_this.el);
            $(_this.el).spSpeed(0);
            $(_this.el).spStop();
            clearInterval(_this.si);
            $(_this.el).removeClass('motion');
            _this.speed = 0;
        }
    }, 100);
};


Slot.prototype.finalPos = function () {
    var el = this.el,
        el_id,
        pos,
        posMin = 2000000000,
        best,
        bgPos,
        i,
        j,
        k;

    el_id = $(el).attr('id');
    pos = document.getElementById(el_id).style.backgroundPosition;
    pos = pos.split(' ')[1];
    pos = parseInt(pos, 10);

    for (i = 0; i < posArr.length; i++) {
        for (j = 0; ; j++) {
            k = posArr[i] + (imgHeight * j);
            if (k > pos) {
                if ((k - pos) < posMin) {
                    posMin = k - pos;
                    best = k;
                    this.pos = posArr[i]; 
                }
                break;
            }
        }
    }

    best += imgHeight + 4;
    bgPos = "0 " + best + "px";
    $(el).animate({
        backgroundPosition: "(" + bgPos + ")"
    }, {
        duration: 200,
        complete: function () {
            completed++;
        }
    });
};


Slot.prototype.reset = function () {
    var el_id = $(this.el).attr('id');
    $._spritely.instances[el_id].t = 0;
    $(this.el).css('background-position', '0px 4px');
    this.speed = 0;
    completed = 0;
    $('#result').html('');
};

class SlotGame extends React.Component{
    constructor(props){
        super(props);
        this.state={
            a: new Slot('#slot1', 30, 1),
            b: new Slot('#slot2', 45, 2),
            c: new Slot('#slot3', 70, 3),
            balance: this.props.currentUser.balance,
            bet: null,
        };
        this.handleClick = this.handleClick.bind(this);
    }

    enableControl() {
        $('#control').attr("disabled", false);
    }

    disableControl() {
        $('#control').attr("disabled", true);
    }

    printResult() {
        var res;
        if (win[this.state.a.pos] === win[this.state.b.pos] && win[this.state.a.pos] === win[this.state.c.pos]) {
            res = "You Win!";
            this.setState({
                balance: this.state.bet * 5
            });
        } else {
            res = "You Lose";
        }
        $('#result').html(res);
    }

    handleClick(e){
        let newBalance = this.state.balance - this.state.bet 
        this.setState({
            balance: newBalance
        })

        var x;
        if (e.target.value === "Start") {
            this.state.a.start();
            this.state.b.start();
            this.state.c.start();
            e.target.value = "Stop";

            this.disableControl();

            x = window.setInterval(function () {
                if (this.state.a.speed >= this.state.a.maxSpeed && this.state.b.speed >= this.state.b.maxSpeed && this.state.c.speed >= this.state.c.maxSpeed) {
                    this.enableControl();
                    window.clearInterval(x);
                }
            }, 100);
        } else if (e.target.value === "Stop") {
            this.state.a.stop();
            this.state.b.stop();
            this.state.c.stop();
            e.target.value = "Reset";

            this.disableControl();

            x = window.setInterval(function () {
                if (this.state.a.speed === 0 && this.state.b.speed === 0 && this.state.c.speed === 0 && completed === 3) {
                    this.enableControl();
                    window.clearInterval(x);
                    this.printResult();
                }
            }, 100);
        } else { 
            this.state.a.reset();
            this.state.b.reset();
            this.state.c.reset();
            e.target.value = "Start";
        }
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
            <div className="bd">
                <div className='center-container'>
                    <h1>Monkey Slots</h1>
                    <div className="container">
                        <div className="slot-wrapper">
                            <div id="slot1" className="slot"></div>
                            <div id="slot2" className="slot"></div>
                            <div id="slot3" className="slot"></div>
                            <div className="clear"></div>
                        </div>
                        <div className='play-container'>
                            <div id="result"></div>
                            <div><input type='submit' id="control" onClick={this.handleClick} value="Start"/></div>
                        </div>
                    </div>
                    <div className='user-stats'>
                        <div className='user-balance'>
                            <h3>{this.state.balance}</h3>
                            
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