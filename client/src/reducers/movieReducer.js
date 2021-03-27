import { ADD_FAVOURITE_SUCCESS, ADD_FAVOURITE_FAILED, DELETE_FAVOURITE_SUCCESS, DELETE_FAVOURITE_FAILED, LOAD_FAVOURITES_SUCCESS, LOGOUT_SUCCESS } from '../actions/types'

const initialState = {
    favourites: []
}

export default (state = initialState, action) => {
    switch(action.type) {
        case ADD_FAVOURITE_SUCCESS:
        case DELETE_FAVOURITE_SUCCESS:
        case LOAD_FAVOURITES_SUCCESS:
            return {
                ...state,
                favourites: action.payload
            }
        case ADD_FAVOURITE_FAILED:
        case DELETE_FAVOURITE_FAILED:
            return {
                ...state
            }
        case LOGOUT_SUCCESS:
            return {
                ...state,
                favourites: []
            }
        default:
            return {
                ...state
            }
    }
}