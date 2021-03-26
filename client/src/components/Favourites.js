import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import './styles/Favourites.css'

const apiKey = '4769fe382f408f9f9d8c072498e10703'

export class Favourites extends Component {
    constructor(props) {
        super(props)

        this.state = {
            favourites: []
        }
    }

    fetchFavourites = async (favourites) => {
        const promises = this.props.movie.favourites.map(movieId => axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`))
            
            let res = await Promise.all(promises)
    
            res = res.map(pureResponse => pureResponse.data)
    
            console.log(res)
    
            this.setState({ favourites: res })
    }

    async componentDidMount() {
        await this.fetchFavourites(this.props.movie.favourites)
    }

    //Update state if favourites props changes, can't use componentDidMount as it won't initially load
    //Not sure if I should have fetched data in actions instead
    async componentDidUpdate(prevProps) {
        const favourites = this.props.movie.favourites
        const prevFavourites = prevProps.movie.favourites
        const shouldUpdate = favourites.length !== prevFavourites.length && favourites.some(movie => !prevFavourites.some(prevMovie => movie.id === prevMovie.id))

        if(shouldUpdate) await this.fetchFavourites(favourites)
    }

        render() {

        const favourites = this.state.favourites

        return (
            <div className="favourites-container">
                <h2 className="favourites-title">My Favourite Movies.</h2>
                <table className="favourites-list">
                    <tbody>
                        <tr className="favourite-list-header">
                            <th>Movie Name.</th>
                            <th>Runtime.</th>
                        </tr>
                        { favourites.map(({ title, runtime })=> (
                            <tr>
                                <td>{title}</td>
                                <td>{runtime}</td>
                                <button>Delete</button>
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
    movie: state.movie
})

export default connect(mapStateToProps)(Favourites)
