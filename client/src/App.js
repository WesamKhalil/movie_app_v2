import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import store from './store'
import NavBar from './components/NavBar'
import { loadUser } from './actions/authActions'

export class App extends Component {

    async componentDidMount() {
        if(localStorage.getItem('jwt')) {
            await store.dispatch(loadUser())
            alert(store.getState().username)
        }
    }

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div>
                        <NavBar />
                        <Route path='/path1'>
                            <h1>Path 1 working.</h1>
                        </Route>
                        <Route path='/path2'>
                            <h1>Path 2 working.</h1>
                        </Route>
                        <h1>Footer</h1>
                    </div>
                </Router>
            </Provider>
        )
    }
}

export default App
