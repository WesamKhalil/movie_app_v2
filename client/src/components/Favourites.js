import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { deleteFavouriteMovie } from '../actions/movieActions'
import './styles/Favourites.css'

// Todo:
// Display movies image when you hover over it.

export class Favourites extends Component {
    constructor(props) {
        super(props)

        this.state = {
            favourites: []
        }
    }

    //Redirect to landing page if user is logged out
    componentDidMount() {
        if(!this.props.user.isLoggedIn) this.props.history.push('/')

        // Scroll to top of the page on page load
        window.scrollTo(0, 0)

    }

    //Redirect to landing page if user is logged out
    componentDidUpdate(prevProps) {
        if(!this.props.user.isLoggedIn) this.props.history.push('/')
    }

    render() {

    const favourites = this.props.movie.favourites

        return (
            <div className="favourites-container">
                <h2 className="favourites-title">My Favourite Movies.</h2>
                <table className="favourites-list">
                    <tbody>
                        <tr className="favourite-list-header">
                            <th>Movie Name.</th>
                            <th>Runtime.</th>
                            <th></th>
                        </tr>
                        { favourites.map(({ title, runtime, id }, ind)=> (
                            <tr key={"favourite " + ind}>
                                <td className="favourite-movie-title"><Link to={'/movie/' + id}>{title}</Link></td>
                                <td className="favourite-movie-runtime">{runtime} Minutes</td>
                                <button className="favourite-movie-delete" onClick={() => this.props.deleteFavouriteMovie(id)}>Delete</button>
                            </tr>
                        )) }
                        {/* <tr>
                            <td>Dummy title.</td>
                            <td>60 Minutes.</td>
                            <button>Delete</button>
                        </tr> */}
                    </tbody>
                </table>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    movie: state.movie,
    user: state.auth
})

export default connect(mapStateToProps, { deleteFavouriteMovie })(Favourites)
