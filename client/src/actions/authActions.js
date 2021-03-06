import { LOGIN_SUCCESS, LOGOUT_SUCCESS, REGISTER_SUCCESS, LOAD_USER_SUCCESS, LOAD_USER_FAILED, LOGIN_FAILED, REGISTER_FAILED, LOAD_FAVOURITES_SUCCESS } from './types'
import axios from 'axios'

//Action for logging in user and getting token from the api
export const login = (email, password, remember) => async (dispatch) => {
    try {
        const { first_name, last_name, UCId, favourites, token } = (await axios.post('/api/user/login', { email, password })).data

        remember ? localStorage.setItem('jwt', token) : sessionStorage.setItem('jwt', token)

        console.log(localStorage.getItem("jwt") || sessionStorage.getItem("jwt"))

        dispatch({
            type: LOGIN_SUCCESS,
            payload: { username: first_name + ' ' + last_name, UCId }
        })

        const updatedFavourites = await fetchFavourites(favourites)
        dispatch({
            type: LOAD_FAVOURITES_SUCCESS,
            payload: updatedFavourites
        })
    } catch(error) {
        dispatch({
            type: LOGIN_FAILED
        })
        throw error.response.data
    }
}

//Action for registering a user on the database and getting a token
export const register = (first_name, last_name, email, password, remember) => async (dispatch) => {
    try {
        const { UCId, token } = (await axios.post('/api/user/register', { first_name, last_name, email, password })).data

        remember ? localStorage.setItem('jwt', token) : sessionStorage.setItem('jwt', token)

        dispatch({
            type: REGISTER_SUCCESS,
            payload: { username: first_name + ' ' + last_name, UCId }
        })
    } catch(error) {
        dispatch({
            type: REGISTER_FAILED
        })
        throw error.response.data
    }
}

//Action for deleting your token
export const logout = () => async (dispatch) => {

    localStorage.removeItem('jwt')
    sessionStorage.removeItem('jwt')

    dispatch({
        type: LOGOUT_SUCCESS,
        payload: {}
    })
}

//Action for loading user details if token already exists in localStorage
export const loadUser = () => async (dispatch) => {
    try {
        const { first_name, last_name, UCId, favourites } = (await axios.post('/api/user/load_user', {}, tokenConfig())).data

        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: { username: first_name + ' ' + last_name, UCId }
        })

        const favouritesData = await fetchFavourites(favourites)
        dispatch({
            type: LOAD_FAVOURITES_SUCCESS,
            payload: favouritesData
        })

    } catch(error) {
        dispatch({
            type: LOAD_USER_FAILED
        })
        throw error
    }
}

//Configures our header with our token attached to it
const tokenConfig = () => {
    const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt')
    return {
        headers: {
            "x-auth-token": token
        }
    }
}

//Function for fetching data of the movie id's we have in the favourites
//Maybe I should store the whole movie object into my database instead of the movie id
//But then some values for movies change so fetching it on the client from TMDB gives me up to date information
const fetchFavourites = async (favourites) => {
    const apiKey = '4769fe382f408f9f9d8c072498e10703'

    const promises = favourites.map(movieId => axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`))
        
    let res = await Promise.all(promises)

    res = res.map(pureResponse => pureResponse.data)

    return res
}