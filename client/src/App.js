import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import store from './store'
import NavBar from './components/NavBar'
import Auth from './components/Auth'
import LandingPage from './components/LandingPage'
import ViewMovie from './components/ViewMovie'
import Favourites from './components/Favourites'
import { loadUser } from './actions/authActions'
import './App.css'

export class App extends Component {

    async componentDidMount() {
        if(localStorage.getItem('jwt')) {
            await store.dispatch(loadUser())
        }
    }

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div className="app-container">
                        <NavBar />
                        <div>
                            <Route path="/login" component={Auth} />
                            <Route path="/register" component={Auth} />
                            <Route exact path="/" component={LandingPage} />
                            <Route path="/movie/:id" component={ViewMovie} />
                            <Route path="/favourites" component={Favourites} />
                        </div>
                    </div>
                </Router>
            </Provider>
        )
    }
}

export default App
