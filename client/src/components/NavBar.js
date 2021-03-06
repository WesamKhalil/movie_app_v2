import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../actions/authActions'
import './styles/NavBar.css'

//The right side of the navbar that is rendered when user is logged in
const MenuLoggedIn = (props) => (
    <React.Fragment>
        <Link to="/favourites" className="menu-button navbar-favourites">Favourites</Link>
        <a onClick={props.logout()} className="menu-button logout">Logout</a>
    </React.Fragment>
)

//The right side of the navbar that is rendered when user is logged out
const MenuLoggedOut = () => (
    <React.Fragment>
        <Link to="/login" className="menu-button login">Login</Link>
        <Link to="/register" className="menu-button register">Register</Link>
    </React.Fragment>
)

export class NavBar extends Component {

    render() {
        return (
            <nav>
                {/* Left side of the navbar that has the landingpage button and optionally the users name if they're logged in */}
                <div className="nav-left-side">
                    <Link to="/" className="menu-home-button">Landing Page</Link>
                    { this.props.user.isLoggedIn ? <div className="nav-name"><h3>Welcome, {this.props.user.username}</h3></div> : null }
                </div>

                {/* Right side of the navbar with a burger button which is renderd if user is on a mobile device */}
                <div className="nav-right-side">
                    <input type="checkbox" className="toggler" />
                    <div className="burger">
                        <div className="first-bar"></div>
                        <div className="second-bar"></div>
                        <div className="third-bar"></div>
                    </div>

                    {/* The menu that is rendered on the right side */}
                    <div className="menu">
                        { this.props.user.isLoggedIn ? <MenuLoggedIn logout={() => this.props.logout}/> : <MenuLoggedOut /> }
                    </div>
                </div>
            </nav>
        )
    }
}

const mapStateToProps = state => ({
    user: state.auth
})

export default connect(mapStateToProps, { logout })(NavBar)
