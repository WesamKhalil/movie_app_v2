import React, { Component } from 'react'
import axios from 'axios'
import './styles/ViewMovie.css'

const apiKey = '4769fe382f408f9f9d8c072498e10703'
const image = 'https://image.tmdb.org/t/p/'
// const specificMovie = `https://api.themoviedb.org/3/${movieid}?api_key=${apiKey}`


export class ViewMovie extends Component {
    constructor(props) {
        super(props)

        this.state = {
            movie: {}
        }
    }

    async componentDidMount() {
        const movieId = this.props.match.params.id
        const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
        const res = await axios.get(movieUrl)
        console.log(res)
        this.setState({ movie: res.data })
    }

    render() {

        const movie = this.state.movie

        return (
            <div>
                <div className="view-banner" style={{backgroundImage: 'url(' + image + 'original' + movie?.backdrop_path + ')'}}>
                    <div className="landing-banner-text">
                        <h1 className="view-banner-title">{movie?.title}</h1>
                        <p className="view-banner-overview">{movie?.overview}</p>
                    </div>
                </div>
                <h2>Movie Info</h2>
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
            </div>
        )
    }
}

export default ViewMovie
