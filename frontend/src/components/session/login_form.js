import React from 'react';
import { withRouter } from 'react-router-dom';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            errors: {}
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderErrors = this.renderErrors.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleDemoUser = this.handleDemoUser.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentUser === true) {
            this.props.history.push('/game');
        }

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
            password: this.state.password
        };

        this.props.login(user)
            .then(() => {
                if (!Object.keys(this.state.errors).length) {
                    this.props.history.push('/lobbies');
                    this.props.closeModal();
                }
            })
    }

    renderErrors() {

        let inputs = document.querySelectorAll('.input')
        inputs.forEach( input => {
            if(input.value.trim() === ''){
                input.style.borderColor = "red";
            }else{
                input.style.borderColor = ""
            }
        })

        let errorUsername = null;
        let errorPassword = null;

        Object.values(this.state.errors).forEach(error => {
            if (error.includes('Username') || error.includes('user')) {
                errorUsername = error;
            } else if (error.includes('Password')) {
                errorPassword = error
            } else if (error.includes('Incorrect')) {
                errorPassword = error;
            }
        });

        const errorArr = [<p>{errorUsername}</p>, <p>{errorPassword}</p>]

        return errorArr;
    }

    handleCancel() {
        this.setState({
            username: '',
            password: '',
        })
        this.props.closeModal();
    }

    handleDemoUser(e){
        e.preventDefault();
        
        let demoUsername = ['d','e', 'm', 'o']
        let demoPassword = ['p', 'a', 's', 's', 'w', 'o', 'r', 'd']
        const usernameInterval = setInterval(() => {
            const first = demoUsername.splice(0, 1);
            this.setState(
                { username: this.state.username + first[0] },
                () => {
                    if (!demoUsername.length) {
                        clearInterval(usernameInterval);
                        const passwordInterval = setInterval(() => {
                            const first = demoPassword.splice(0, 1);
                            this.setState(
                                { password: this.state.password + first[0] },
                                () => {
                                    if (!demoPassword.length) {
                                        clearInterval(passwordInterval)
                                        this.props.login(this.state)
                                            .then(() => {
                                                if (!Object.keys(this.state.errors).length) {
                                                    this.props.history.push('/lobbies');
                                                    this.props.closeModal();
                                                }
                                            })
                                    }

                                }
                            )
                        }, 50)
                    }
                }
            );
        }, 50);
    }

    render() {
        return (
            <div>
                <div className="modal-banner">
                    <button onClick={this.handleCancel}>x</button>
                </div>
                <div className="top-content">
                    <h3>Welcome back</h3>
                    <p>Please Log In</p>
                </div>
                <button id='demo-user' onClick={this.handleDemoUser}>Demo User</button>

                <form className='form-login' onSubmit={this.handleSubmit}>
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
                    <input id='submit-login' type="submit" value="Log In" />
                </form>

                <div className="text-center">
                    <p className="">Don't have an account?
                        <a onClick={this.props.openSignUp}>Sign Up</a>
                    </p>
                </div>
            </div>
        );
    }
}

export default withRouter(LoginForm);