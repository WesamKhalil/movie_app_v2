import { ADD_FAVOURITE_SUCCESS, ADD_FAVOURITE_FAILED, DELETE_FAVOURITE_SUCCESS, DELETE_FAVOURITE_FAILED } from './types'
import axios from 'axios'
const apiKey = '4769fe382f408f9f9d8c072498e10703'

//Adds object for movie in movie.favourites value
export const addFavouriteMovie = movieId => async (dispatch, getState) => {
    try {
        const existingFavourites = getState().movie.favourites
        const alreadExists = existingFavourites.some(old => old.id === parseInt(movieId))

        if(alreadExists) throw new Error("You've already added this movie to your favourites.")

        await axios.post('/api/movie/favourites/' + movieId, {}, tokenConfig())

        const newFavourite = (await axios(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`)).data

        const updatedFavourites = existingFavourites.concat(newFavourite)

        dispatch({
            type: ADD_FAVOURITE_SUCCESS,
            payload: updatedFavourites
        })
    } catch(error) {
        dispatch({
            type: ADD_FAVOURITE_FAILED 
        })
    }
}

//Deletes favourite movie from database then from memory
export const deleteFavouriteMovie = movieId => async (dispatch, getState) => {
    try {
        await axios.delete('/api/movie/favourites/' + movieId, tokenConfig())

        const oldFavourites = getState().movie.favourites
        const updatedFavourites = oldFavourites.filter(movie => movie.id !== movieId)
        console.log(updatedFavourites)

        dispatch({
            type: DELETE_FAVOURITE_SUCCESS,
            payload: updatedFavourites
        })
    } catch(error) {
        dispatch({
            type: DELETE_FAVOURITE_FAILED
        })
    }
}

//Configures our header with our token attached to it
const tokenConfig = () => {
    const token = localStorage.getItem('jwt')
    return {
        headers: {
            "x-auth-token": token
        }
    }
}