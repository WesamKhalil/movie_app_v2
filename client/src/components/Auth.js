import React, { Component } from 'react'
import { connect } from 'react-redux'
import { login, register } from '../actions/authActions'
import './styles/Auth.css'

//Component for rendering a first and last name input for registering
const NameInput = () => (
    <React.Fragment>
        <input type="text" name="first_name" className="auth-input" placeholder="First Name" autoComplete="off" />
        <input type="text" name="last_name" className="auth-input" placeholder="Second Name" autoComplete="off" />
    </React.Fragment>
)

//Component for both logging in and registering
export class Auth extends Component {
    constructor(props) {
        super(props)

        this.state = {
            action: null
        }
    }

    componentDidMount() {
        //If user is already logged in redirect them to ladning page
        if(this.props.isLoggedIn) this.props.history.push('/')

        //Set action value in state to determine if user is registering or logging in
        const action = this.props.location.pathname === '/register' ? 'Register' : 'Login'
        this.setState({ action })
    }

    //Function for handling submitting a login or registering form
    handleSubmit = async (e) => {
        e.preventDefault()

        const email = e.target.email.value
        const password = e.target.password.value
        const remember = e.target.remember.checked

        try {
            if(this.props.location.pathname === '/register') {
                const first_name = e.target.first_name.value
                const last_name = e.target.last_name.value
                await this.props.register(first_name, last_name, email, password, remember)
            } else {
                await this.props.login(email, password, remember)
            }

            this.props.history.push('/')
        } catch(error) {
            return console.log(error)
        }
    }

    render() {

        const action = this.state.action

        return (
            <div className="auth-container">
                <h1 className="auth-title">{action}</h1>
                <div className="auth-form">
                    <form onSubmit={this.handleSubmit}>
                        { action === 'Register' ? <NameInput /> : null }
                        <input type="email" name="email" className="auth-input" placeholder="Email" />
                        <input type="password" name="password" placeholder="Password" className="auth-input" />
                        <div className="checkbox-container">
                            <input type="checkbox" name="remember" id="remember" className="remember-me"/>
                            <label id="remember" >remember me.</label>
                        </div>
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
