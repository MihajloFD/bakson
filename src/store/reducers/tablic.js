import * as actionTypes from '../actions/actionTypes'

const initialState = { deck: {} }

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.GET_SHUFFLED_DECK_SUCCESS:
      return { ...state, deckInfo: action.payload }
    case actionTypes.GET_CARDS_SUCCESS:
      return { ...state, deck: action.payload }
    default:
      return state
  }
}
