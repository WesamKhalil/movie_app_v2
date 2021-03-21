import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../actions/authActions'
import './styles/NavBar.css'

export class NavBar extends Component {

    authButtons = () => {
        if(this.props.user.isLoggedIn) return (
            <React.Fragment>
                <div className="menu-button"><Link to="/favourites">Favourites</Link></div>
                <a onClick={() => this.props.logout()} className="menu-button">Logout</a>
            </React.Fragment>
        )

        return (
            <React.Fragment>
                <div><Link to="/login" className="menu-button">Login</Link></div>
                <div><Link to="/register" className="menu-button">Register</Link></div>
            </React.Fragment>
        )
    }

    render() {
        return (
            <nav>
                <div><Link to="/" className="menu-home-button">Landing Page</Link></div>
                <div className="nav-right-side">
                    <input type="checkbox" className="toggler" />
                    <div className="burger">
                        <div className="first-bar"></div>
                        <div className="second-bar"></div>
                        <div className="third-bar"></div>
                    </div>
                    <div className="menu">
                        { this.authButtons() }
                    </div>
                </div>
            </nav>
        )
    }
}

const mapStateToProps = state => ({
    user: state
})

export default connect(mapStateToProps, { logout })(NavBar)
