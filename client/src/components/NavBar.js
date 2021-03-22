import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../actions/authActions'
import './styles/NavBar.css'

//Things to do
//Add colours
//Potentially make navbar background colour transparent
//Change responsve sizes
//Add shadows
//Add animations
//Remove flex from right menu buttons

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
                <div className="nav-left-side">
                    <Link to="/" className="menu-home-button">Landing Page</Link>
                    { this.props.user.isLoggedIn ? <div className="nav-name"><h3>Welcome, {this.props.user.username}</h3></div> : null }
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
