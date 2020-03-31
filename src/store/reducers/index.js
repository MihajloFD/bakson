import { combineReducers } from 'redux'

import tablicReducer from './tablic'

const rootReducer = combineReducers({
  tablic: tablicReducer
})

export default rootReducer
