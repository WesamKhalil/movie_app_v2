import { ADD_FAVOURITE_SUCCESS, ADD_FAVOURITE_FAILED, DELETE_FAVOURITE_SUCCESS, DELETE_FAVOURITE_FAILED } from './types'
import axios from 'axios'

export const addFavourite = movieId => async (dispatch, getState) => {
    try {
        await axios.post('/api/movie/favourites/' + movieId, {}, tokenConfig())

        const newFavourites = getState().movie.favourites.filter(movie => movie != movieId)

        dispatch({
            type: ADD_FAVOURITE_SUCCESS,
            payload: newFavourites
        })
    } catch(error) {
        dispatch({
            type: ADD_FAVOURITE_FAILED 
        })
    }
}

const tokenConfig = () => {
    const token = localStorage.getItem('jwt')
    return {
        headers: {
            "x-auth-token": token
        }
    }
}