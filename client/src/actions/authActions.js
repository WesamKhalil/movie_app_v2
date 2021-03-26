import { LOGIN_SUCCESS, LOGOUT_SUCCESS, REGISTER_SUCCESS, LOAD_USER_SUCCESS, LOAD_USER_FAILED, LOGIN_FAILED, REGISTER_FAILED, LOAD_FAVOURITES_SUCCESS } from './types'
import axios from 'axios'

//Action for logging in user and getting token from the api
export const login = (email, password) => async (dispatch) => {
    try {
        const { first_name, last_name, favourites, token } = (await axios.post('/api/user/login', { email, password })).data
        localStorage.setItem('jwt', token)
        dispatch({
            type: LOGIN_SUCCESS,
            payload: { username: first_name + ' ' + last_name }
        })
        // console.log('Dispatching for ')
        dispatch({
            type: LOAD_FAVOURITES_SUCCESS,
            payload: favourites
        })
    } catch(error) {
        dispatch({
            type: LOGIN_FAILED
        })
        throw error
    }
}

//Action for registering a user on the database and getting a token
export const register = (first_name, last_name, email, password) => async (dispatch) => {
    try {
        const { token } = (await axios.post('/api/user/register', { first_name, last_name, email, password })).data
        localStorage.setItem('jwt', token)
        dispatch({
            type: REGISTER_SUCCESS,
            payload: { username: first_name + ' ' + last_name }
        })
    } catch(error) {
        dispatch({
            type: REGISTER_FAILED
        })
        throw error
    }
}

//Action for deleting your token
export const logout = () => async (dispatch) => {
    localStorage.removeItem('jwt')
    dispatch({
        type: LOGOUT_SUCCESS,
        payload: {}
    })
}

//Action for loading user details if token already exists in localStorage
export const loadUser = () => async (dispatch) => {
    try {
        const { first_name, last_name, favourites } = (await axios.post('/api/user/load_user', {}, tokenConfig())).data
        console.log('Before start of dispatch')
        dispatch({
            type: LOAD_FAVOURITES_SUCCESS,
            payload: favourites
        })
        console.log('Dispatch load user done')
        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: { username: first_name + ' ' + last_name }
        })
        console.log('Dispatch load favourites done')

    } catch(error) {
        dispatch({
            type: LOAD_USER_FAILED
        })
        throw error
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