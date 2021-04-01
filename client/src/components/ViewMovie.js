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

    // Function for added comment to the database with an api call then add that comment in memory
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
            return console.log(error)
        }

        e.target.comment.value = ""

        const { username, UCId } = this.props.user

        const replyTo = null

        const newComment = { _id, username, comment, UCId, replyTo }

        const updatedComment = this.state.comments
            .map(commentObj => {
                commentObj.focus = null
                return commentObj
            })
            .concat(newComment)

        this.setState({ comments: updatedComment })
    }

    editComment = _id => async (e) => {
        e.preventDefault()

        const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt')
        const header = { headers: { "x-auth-token": token } }

        const movieId = this.props.match.params.id
        const comment = e.target.comment.value

        try {
            await axios.patch('/api/movie/comments/' + movieId, { comment, _id }, header)
        } catch(error) {
            return console.log(error)
        }

        const updatedComments = this.state.comments.map(commentObj => {
            if(commentObj._id === _id) commentObj.comment = comment
            commentObj.focus = null

            return commentObj
        })

        this.setState({ comments: updatedComments })
    }

    // Function that makes an api call to delete a comment then deletes it in memory
    deleteComment = async (id) => {
        const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt')
        const header = { data: { _id: id }, headers: { "x-auth-token": token } }
        const movieId = this.props.match.params.id

        await axios.delete('/api/movie/comments/' + movieId, header)

        const updatedComments = this.state.comments.filter(({ _id }) => _id !== id)
        this.setState({ comments: updatedComments })
    }

    // Changes the focus value which tells the app to render a edit or reply form but only one at a time
    // The id tells us which comment to focus on, type tells us which form we want to render
    changeFocus = (id, type) => {
        const updatedComments = this.state.comments.map(comment => {
            comment.focus = comment._id === id ? type : null
            return comment
        })

        this.setState({ comments: updatedComments })
    }

    resetFocus = () => {
        const updatedComments = this.state.comments.map(comment => {
            comment.focus = null
            return comment
        })

        this.setState({ comments: updatedComments })
    }

    // Function for rendering reply, delete and edit buttons, and reply and edit forms underneath each comment
    renderCommentButtons = ({ UCId, _id, isLoggedIn, focus, username }) => {
        let commentButtons

        if(!isLoggedIn) {
            commentButtons = (
                <div className="comment-functions">
                    <p>Login/Register to reply</p>
                </div>
            )
        } else if(this.props.user.UCId === UCId) {
            commentButtons = (
                <div className="comment-functions">
                    <button onClick={ () => this.deleteComment(_id) }className="comment-delete">Delete</button> 
                    <button onClick={() => this.changeFocus(_id, 'edit')} className="comment-edit">Edit</button>
                </div>
            )
        } else if(focus === "reply") {
            commentButtons = (
                <form onSubmit={this.addComment} className="reply-form">
                    <textarea name="comment" defaultValue={'@' + username + ' '} className="reply-input" />
                    <div className="reply-buttons">
                    <button type="button" onClick={this.resetFocus} className="reply-cancel">Cancel</button>
                    <button className="reply-button">Submit Reply</button>
                    </div>
                </form>
            )
        } else {
            commentButtons = (
                <div className="comment-functions">
                    <button onClick={() => this.changeFocus(_id, 'reply')} className="comment-reply">Reply</button> 
                </div>
            )
        }

        return commentButtons
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
                    <h3 className="favourited">Favourited: {favourited}</h3>
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
                    { /* The form that's rendered if user is logged in */
                        isLoggedIn ?  
                        <form onSubmit={this.addComment} className="comment-form">
                            <textarea name="comment" placeholder="Add Comment" className="comment-input" />
                            <button className="comment-button">Submit Comment</button>
                        </form>
                        : <h2>Log in to comment.</h2>
                    }
                    <div className="comments-container">
                        <h3 className="comments-header">Comments ({comments.length})</h3>
                        <hr/>
                        { comments.map(({ comment, UCId, _id, username, focus }) => {
                            if(focus === "edit") return (
                                <form onSubmit={this.editComment(_id)} className="edit-form">
                                    <textarea name="comment" defaultValue={comment} className="edit-input" />
                                    <div className="edit-buttons">
                                        <button onClick={this.resetFocus} type="button" className="edit-cancel">Cancel</button>
                                        <button className="edit-submit">Submit Edit</button>
                                    </div>
                                </form>
                            )

                            return (
                            <div className="comments">
                                <h4>{username} <span className="UCId">#{UCId}</span></h4>
                                <p ucid={UCId} key={_id} className="comment">{comment}</p>
                                    {this.renderCommentButtons({ UCId, _id, isLoggedIn, focus, username })}
                            </div>
                        )}) }
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
