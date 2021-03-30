import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addFavouriteMovie, deleteFavouriteMovie } from '../actions/movieActions'
import axios from 'axios'
import './styles/ViewMovie.css'

const apiKey = '4769fe382f408f9f9d8c072498e10703'
const image = 'https://image.tmdb.org/t/p/'
const returnMovieUrl = (movieId) => `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
const returnActorsUrl = (movieId) => `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`

// Todo:
// Animate buttons.

export class ViewMovie extends Component {
    constructor(props) {
        super(props)

        this.state = {
            movie: {},
            actors: [],
            favourited: null,
            comments: []
        }
    }

    // Get the information on the specific movie being viewed and putting info in state
    async componentDidMount() {
        // Scroll to top of the page on page load
        window.scrollTo(0, 0)

        const movieId = this.props.match.params.id
        const res = await axios.get(returnMovieUrl(movieId))

        const apiRes = await axios.get('/api/movie/info/' + movieId)
        const { favourited, comments } = apiRes.data

        this.setState({ movie: res.data, favourited, comments })
    }

    // Function for loading actors information into state
    loadActors = async () => {
        const movieId = this.props.match.params.id
        const res = await axios.get(returnActorsUrl(movieId))

        this.setState({ actors: res.data.cast })
    }

    // Function for rendering an add to favourites button, delete button or no button is user is not signed in
    renderFavouriteButton = () => {
        if(!this.props.user.isLoggedIn) return null

        const movieId = parseInt(this.props.match.params.id)
        const existsInFavourites = this.props.movie.favourites.some(movie => movie.id === movieId)

        if(existsInFavourites) return (
            <button className ="view-delete" onClick={() => this.favouritesFunction(movieId, 'delete')}>Delete from Favourites</button>
        )

        return ( <button className ="view-add" onClick={() => this.favouritesFunction(movieId, 'add')} >Add to Favourites</button> )
    }

    // Function for handling add and delete onlcik event to update the stores and local states values
    favouritesFunction = async (movieId, action) => {
        if(action === 'add') {
            await this.props.addFavouriteMovie(movieId)
            this.setState({ favourited: this.state.favourited + 1 })
        } else {
            await this.props.deleteFavouriteMovie(movieId)
            this.setState({ favourited: this.state.favourited - 1 })
        }
    }

    addComment = async (e) => {
        e.preventDefault()

        const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt')
        const header = { headers: { "x-auth-token": token } }

        const movieId = this.props.match.params.id
        const comment = e.target.comment.value
        let _id

        try {
        _id = (await axios.post('/api/movie/comments/' + movieId, { comment }, header)).data._id
        } catch(error) {
            console.log(error)
        }

        const { username, UCId } = this.props.user

        const replyTo = null

        const newComment = { _id, username, comment, UCId, replyTo }

        this.setState(prevState => ({ comments: prevState.comments.concat(newComment) }))
    }

    render() {

        const { movie, favourited, comments } = this.state
        const { isLoggedIn } = this.props.user

        return (
            <div>
                {/* Banner of the movie being viewed */}
                <div className="view-banner" style={{backgroundImage: 'url(' + image + 'original' + movie?.backdrop_path + ')'}}>
                    <div className="landing-banner-text">
                        <h1 className="view-banner-title">{movie?.title}</h1>
                        <p className="view-banner-overview">{movie?.overview}</p>
                    </div>
                </div>
                
                {/* Add or delete to favourites button */}
                <div className="favourites-button-container">
                    { this.renderFavouriteButton() }
                    <p>Favourited: {favourited}</p>
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

                {/* Where we display comments */}
                <div className="comments-section">
                    { 
                        isLoggedIn ?  
                        <form onSubmit={this.addComment} className="comment-form">
                            <textarea name="comment" placeholder="Add Comment" className="comment-input" />
                            <button className="comment-button">Comment</button>
                        </form>
                        : null
                    }
                    <div className="comments-container">
                        { comments.map(({ comment, UCId, _id, username }) => (
                            <div className="comments">
                                <h4>{username} #{UCId}</h4>
                                <p ucid={UCId} key={_id} className="comments">{comment}</p>
                            </div>
                        )) }
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
    user: state.auth,
    movie: state.movie
})

export default connect(mapStateToProps, { addFavouriteMovie, deleteFavouriteMovie })(ViewMovie)
