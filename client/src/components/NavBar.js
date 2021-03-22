import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../actions/authActions'
import './styles/NavBar.css'

const MenuLoggedIn = (props) => (
    <React.Fragment>
        <Link to="/favourites" className="menu-button">Favourites</Link>
        <a onClick={props.logout()} className="menu-button">Logout</a>
    </React.Fragment>
)

const MenuLoggedOut = () => (
    <React.Fragment>
        <Link to="/login" className="menu-button">Login</Link>
        <Link to="/register" className="menu-button">Register</Link>
    </React.Fragment>
)

export class NavBar extends Component {

    render() {
        return (
            <nav>
                <div>
                    <Link to="/" className="menu-home-button">Landing Page</Link>
                    <h3>{this.props.user.username}</h3>
                </div>
                <div className="nav-right-side">
                    <input type="checkbox" className="toggler" />
                    <div className="burger">
                        <div className="first-bar"></div>
                        <div className="second-bar"></div>
                        <div className="third-bar"></div>
                    </div>
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
