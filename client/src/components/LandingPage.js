import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './styles/LandingPage.css'

const apiKey = '4769fe382f408f9f9d8c072498e10703'
const featured = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}`
// const specificMovie = `https://api.themoviedb.org/3/${movieid}?api_key=${apiKey}`
const search = `https://api.themoviedb.org/3/search/movie?&api_key=${apiKey}&query=`
const image = 'https://image.tmdb.org/t/p/'

//Things to do:
//Add colours
//Add colours to ratings depending on score
//Figure out how to decrease banner image size for faster loading
//Add word wrap and text overflow to title
//Add serch functionality
//Provide option to see newest movies

export class LandingPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            movies: [],
            page: 1
        }
    }


    async componentDidMount() {
        const res = await axios.get(featured)
        console.log(res.data)
        this.setState({ movies: res.data.results })
    }

    loadMore = async() => {
        const res = await axios.get(featured + '&page=' + (this.state.page + 1))
        this.setState(prevState => ({
            movies: prevState.movies.concat(res.data.results),
            page: prevState.page + 1
        }))
    }

    render() {

        const bannerMovie = this.state.movies[0]

        return (
            <div className="landing-container">
                <div className="landing-banner" style={{backgroundImage: 'url(' + image + 'original' + bannerMovie?.backdrop_path + ')'}}>
                    <div className="landing-banner-text">
                        <h1 className="landing-banner-title">{bannerMovie?.title}</h1>
                        <p className="landing-banner-overview">{bannerMovie?.overview}</p>
                    </div>
                </div>
                <div className="landing-search">
                    <input type="text" placeholder="Search for movies"/>
                </div>
                <div className="movies-container">
                    { this.state.movies.map(({ title, overview, poster_path, vote_average, id }, ind) => (
                        <Link to={'/movie/' + id} className="movie-link" key={'movies' + ind}>
                            <div className="preview-movie">
                                <img src={image + 'w300' + poster_path}/>
                                <div className="preview-info">
                                    <h3>{title}</h3>
                                    <div className="preview-rating">{vote_average}</div>
                                </div>
                                <div className="preview-overview">
                                    <h2>Overview</h2>
                                    <p>{overview}</p>
                                </div>
                            </div>
                        </Link>
                    )) }
                </div>
                <div className="landing-load-more">
                    <button onClick={this.loadMore}>Load More</button>
                </div>
            </div>
        )
    }
}

export default LandingPage
