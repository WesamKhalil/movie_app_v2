import React, { Component } from 'react'
import { connect } from 'react-redux'
import { login, register } from '../actions/authActions'
import './styles/Auth.css'

export class Auth extends Component {
    constructor(props) {
        super(props)

        this.state = {
            action: null
        }
    }

    componentDidMount() {
        if(this.props.isLoggedIn) this.props.history.push('/')

        const action = this.props.location.pathname === '/register' ? 'Register' : 'Login'
        this.setState({ action })
    }

    render() {

        const action = this.state.action

        return (
            <div className="auth-container">
                <h1 className="auth-title">{action}</h1>
                <div className="auth-form">
                    <form onSubmit={this.handleSubmit}>
                        { action === 'Register' ? <input type="text" name="name" className="auth-input" placeholder="Name" autoComplete="off" /> : null }
                        <input type="email" name="email" className="auth-input" placeholder="Email" />
                        <input type="password" name="password" placeholder="Password" className="auth-input" />
                        <button className="auth-btn">{action}</button>
                    </form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state
})

export default connect( mapStateToProps, { login, register } )(Auth)
