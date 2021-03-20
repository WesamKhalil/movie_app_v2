import { LOGIN_SUCCESS, LOGIN_FAILED, REGISTER_SUCCESS, REGISTER_FAILED, LOAD_USER_SUCCESS, LOGOUT_SUCCESS } from '../actions/types'

//State we use to decide whether to render user elements and what values we want to show and use
const initialState = {
    isLoggedIn: null,
    username: null
}


export default (state = initialState, action) => {
    switch(action.type) {
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
        case LOAD_USER_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                username: action.payload.name
            }
        // case LOGIN_FAILED:
        // case REGISTER_FAILED:
        //     return {
        //         ...state
        //     }
        case LOGOUT_SUCCESS:
            return {
                ...state,
                isLoggedIn: false,
                username: null
            }
        default:
            return {
                ...state
            }
    }
}