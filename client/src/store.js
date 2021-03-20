import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import authUser from './reducers/authReducer'

const initialState = {}

const middleware = [thunk]

const store = createStore(authUser, initialState, applyMiddleware(...middleware))

export default store