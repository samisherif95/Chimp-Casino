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
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentUser === true) {
            this.props.history.push('/tweets');
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

        this.props.login(user);
    }

    renderErrors() {
        return (
            <ul>
                {Object.keys(this.state.errors).map((error, i) => (
                    <li key={`error-${i}`}>
                        {this.state.errors[error]}
                    </li>
                ))}
            </ul>
        );
    }

    handleCancel() {
        this.setState({
            username: '',
            password: '',
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
                    <h3>Welcome back</h3>
                    <p>Please Log In</p>
                </div>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <input type="text"
                            id='username'
                            value={this.state.username}
                            onChange={this.update('username')}
                            placeholder="Username"
                        />
                        <br />
                        <input type="password"
                            id='password'
                            value={this.state.password}
                            onChange={this.update('password')}
                            placeholder="Password"
                        />
                        <br />
                        <input id='submit-login' type="submit" value="Log In" />
                        {this.renderErrors()}
                    </div>
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