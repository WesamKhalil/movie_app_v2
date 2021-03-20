import { LOGIN_SUCCESS, LOGOUT_SUCCESS, REGISTER_SUCCESS, LOAD_USER_SUCCESS, LOGIN_FAILED, REGISTER_FAILED } from './types'
import axios from 'axios'

//Action for logging in user and getting token from the api
export const login = (email, passowrd) => async (dispatch) => {
    try {
        
    } catch(error) {

    }
}

//Action for registering a user on the database and getting a token
export const register = (name, email, passowrd) => async (dispatch) => {
    try {

    } catch(error) {
        
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

    } catch(error) {
        
    }
}