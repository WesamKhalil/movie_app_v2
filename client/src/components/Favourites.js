import React, { Component } from 'react'

export class Favourites extends Component {

    componentDidMount() {
        // if(!this.props.user.isLoggedIn) this.props.history.push('/login')
    }

    render() {
        return (
            <div>
                <h1>Favourites.</h1>
            </div>
        )
    }
}

export default Favourites
