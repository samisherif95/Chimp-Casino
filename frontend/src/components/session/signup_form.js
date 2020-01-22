
import React from 'react';
import { withRouter } from 'react-router-dom';

class SignupForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            password2: '',
            errors: {}
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this)
        this.clearedErrors = false;
    }
    
    componentWillReceiveProps(nextProps) {
        this.setState({ errors: nextProps.errors })
    }

    update(field) {
        return e => this.setState({
            [field]: e.currentTarget.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        let user = {
            username: this.state.username,
            password: this.state.password,
            password2: this.state.password2
        };

        this.props.signup(user)
            .then( () => {
                console.log("errors", this.state.errors)
                if(!Object.keys(this.state.errors).length){
                    this.props.history.push('/game');
                    this.props.closeModal(); 
                }
            })
    }

    renderErrors() {
        let inputs = document.querySelectorAll('.input')
        inputs.forEach(input => {
            if (input.value.trim() === '') {
                input.style.borderColor = "red";
            } else {
                input.style.borderColor = ""
            }
        })

        let errorUsername = null;
        let errorPassword = null;
        let errorPassword2 = null;

        Object.values(this.state.errors).forEach(error => {
            if (error.includes('Username') || error.includes('user')) {
                errorUsername = error;
            } else if (error.includes('Password')) {
                errorPassword = error
            } else if (error.includes('Confirm') || error.includes('match')) {
                errorPassword2 = error
            }
        });

        const errorArr = [<p>{errorUsername}</p>, <p>{errorPassword}</p>, <p>{errorPassword2}</p>]

        return errorArr;
    }

    handleCancel() {
        this.setState({
            username: '',
            password: '',
            password2: ''
        })
        this.props.closeModal();
    }

    render() {
        return (
            <div>
                <div className="modal-banner">
                    <button onClick={this.handleCancel}>x</button>
                </div>
                <div className="top-content">
                    <h3>Join Chimp Casino</h3>
                    <p>Please Sign Up</p>
                </div>

                <form className='form-signup' onSubmit={this.handleSubmit}>
                    <div className="signup-form">
                        <input type="text"
                            id='username'
                            value={this.state.username}
                            onChange={this.update('username')}
                            placeholder="Username"
                            className='input'
                        />
                        {Object.keys(this.state.errors).length > 0 ? this.renderErrors()[0] : null}
                        <input type="password"
                            id='password'
                            value={this.state.password}
                            onChange={this.update('password')}
                            placeholder="Password"
                            className='input'
                        />
                        {Object.keys(this.state.errors).length > 0 ? this.renderErrors()[1] : null}
                        <input type="password"
                            id='password2'
                            value={this.state.password2}
                            onChange={this.update('password2')}
                            placeholder="Confirm Password"
                            className='input'
                        />
                        {Object.keys(this.state.errors).length > 0 ? this.renderErrors()[2] : null}
                        <input id='submit-signup' type="submit" value="Sign Up" />
                    </div>
                </form>

                <div className="text-center ">
                    <p className="">Already have an account
                        <a onClick={this.props.openLogIn}>Log In</a>
                    </p>
                </div>
            </div>
        );
    }
}

export default withRouter(SignupForm);
