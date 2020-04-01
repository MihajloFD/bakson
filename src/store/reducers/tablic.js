import * as actionTypes from '../actions/actionTypes'

const initialState = { deck: {}, playerCards: [], appCards: [], tableCards: [], palyerCount: [], appCount: [], isPlayer: true }

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.GET_DECK_INFO_SUCCESS:
      return { ...state, deck: action.payload }
    case actionTypes.SET_PLAYER_CARDS_SUCCESS:
      return { ...state, playerCards: action.payload }
    case actionTypes.SET_APP_CARDS_SUCCESS:
      return { ...state, appCards: action.payload }
    case actionTypes.SET_TABLE_CARDS_SUCCESS:
      return { ...state, tableCards: action.payload }
    case actionTypes.SET_PLAYER_COUNT_SUCCESS:
      return { ...state, palyerCount: action.payload }
    case actionTypes.SET_APP_COUNT_SUCCESS:
      return { ...state, appCount: action.payload }
    case actionTypes.SET_PLAYER:
      return { ...state, isPlayer: action.payload }
    default:
      return state
  }
}
