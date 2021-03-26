import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addFavourite } from '../actions/movieActions'
import axios from 'axios'
import './styles/ViewMovie.css'

const apiKey = '4769fe382f408f9f9d8c072498e10703'
const image = 'https://image.tmdb.org/t/p/'
// const specificMovie = `https://api.themoviedb.org/3/${movieid}?api_key=${apiKey}`
// const actors = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`


export class ViewMovie extends Component {
    constructor(props) {
        super(props)

        this.state = {
            movie: {},
            actors: []
        }
    }

    // Get the information on the specific movie being viewed and putting info in state
    async componentDidMount() {
        const movieId = this.props.match.params.id
        const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
        const res = await axios.get(movieUrl)
        console.log(res)
        this.setState({ movie: res.data })
    }

    // Function for loading actors information into state
    loadActors = async () => {
        const movieId = this.props.match.params.id
        const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`)
        console.log(res.data.cast)
        this.setState({ actors: res.data.cast })
    }

    render() {

        const movie = this.state.movie
        const movieId = this.props.match.params.id

        return (
            <div>
                {/* Banner of the movie being viewed */}
                <div className="view-banner" style={{backgroundImage: 'url(' + image + 'original' + movie?.backdrop_path + ')'}}>
                    <div className="landing-banner-text">
                        <h1 className="view-banner-title">{movie?.title}</h1>
                        <p className="view-banner-overview">{movie?.overview}</p>
                    </div>
                </div>
                
                {/* Add to favourites button */}
                <div className="favourites-button-container">
                    { this.props.user.isLoggedIn ? <button onClick={this.props.addFavourite(movieId)} >Add to Favourites</button> : null }
                </div>

                <h2 className="view-info-title">Movie Info</h2>

                {/* Information for the selected movie */}
                <div className="view-info">
                    <div className="info-group">
                        <div className="info-pair">
                            <div className="info-key">Title:</div>
                            <div className="info-value">{movie.title}</div>
                        </div>
                        <div className="info-pair">
                            <div className="info-key">Runtime:</div>
                            <div className="info-value">{movie.runtime} Minutes.</div>
                        </div>
                        <div className="info-pair">
                            <div className="info-key">Score:</div>
                            <div className="info-value">{movie.vote_average}</div>
                        </div>
                    </div>
                    <div className="info-group">
                        <div className="info-pair">
                            <div className="info-key">Status:</div>
                            <div className="info-value">{movie.status}</div>
                        </div>
                        <div className="info-pair">
                            <div className="info-key">Release Date:</div>
                            <div className="info-value">{movie.release_date}</div>
                        </div>
                        <div className="info-pair">
                            <div className="info-key">Revenue:</div>
                            <div className="info-value">${movie.revenue}</div>
                        </div>
                    </div>
                    <div className="info-group">
                        <div className="info-pair">
                            <div className="info-key">Popularity Score:</div>
                            <div className="info-value">{movie.popularity}</div>
                        </div>
                        <div className="info-pair">
                            <div className="info-key">Vote Count:</div>
                            <div className="info-value">{movie.vote_count}</div>
                        </div>
                        <div className="info-pair">
                            <div className="info-key">Budget:</div>
                            <div className="info-value">${movie.budget}</div>
                        </div>
                    </div>
                </div>

                {/* Button for loading actors */}
                <div className="load-actors">
                    { this.state.actors.length < 1 ? <button onClick={this.loadActors}>View Actors</button> : null }
                </div>

                {/* Where we render actors images and names */}
                <div className="actors-container">
                    { this.state.actors.map(({ name, profile_path, character }) => (
                        <div className="view-actor">
                            <img src={image + 'w300' + profile_path} />
                            <div className="actor-info">
                                <div className="actor-chara"><span className="chara-name">Character:</span> {character}</div>
                                <div className="actor-name"><span className="chara-name">Actors Name:</span> {name}</div>
                            </div>
                        </div>
                    )) }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.auth
})

export default connect(mapStateToProps, { addFavourite })(ViewMovie)
