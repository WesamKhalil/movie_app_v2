import { LOGIN_SUCCESS, LOGOUT_SUCCESS, REGISTER_SUCCESS, LOAD_USER_SUCCESS, LOAD_USER_FAILED, LOGIN_FAILED, REGISTER_FAILED } from './types'
import axios from 'axios'

//Action for logging in user and getting token from the api
export const login = (email, passowrd) => async (dispatch) => {
    try {
        const { name, token } = (await axios.post('/api/user/login', { email, password })).data
        localStorage.setItem('jwt', token)
        dispatch({
            type: LOGIN_SUCCESS,
            payload: { name }
        })
    } catch(error) {
        dispatch({
            type: LOGIN_FAILED
        })
    }
}

//Action for registering a user on the database and getting a token
export const register = (name, email, passowrd) => async (dispatch) => {
    try {
        const { token } = (await axios.post('/api/user/register', { name, email, password })).data
        localStorage.setItem('jwt', token)
        dispatch({
            type: REGISTER_SUCCESS,
            payload: { token }
        })
    } catch(error) {
        dispatch({
            type: REGISTER_FAILED
        })
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
        const { name } = (await axios.post('/api/user/load_user', {}, tokenConfig())).data
        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: { name }
        })
    } catch(error) {
        console.log('load user error')
        console.log(error)
        dispatch({
            type: LOAD_USER_FAILED
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