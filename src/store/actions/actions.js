import axios from 'axios'
import * as actionTypes from './actionTypes'
import * as services from './services'
import * as consts from '../../helper/const'

export const getShuffledDeck = () => {
  return dispatch => {
    axios.get(`${services.ROOT_URL}${services.SHUFFLE_DECK_SERVICE}`)
      .then(response => {
        dispatch(drawCards(response.data.deck_id, consts.INITIAL_NO_CARDS))
      })
      .catch(error => {
        dispatch({ type: actionTypes.ERROR_MESSAGE, payload: error.message })
      })
  }
}

const normalizeCards = cards => cards.map(card => {
  let output
  if (Number(card.value) <= 10) {
    output = { ...card, value: Number(card.value) }
  }
  if (card.value === 'ACE') {
    output = { ...card, value: 11 }
  }
  if (card.value === 'JACK') {
    output = { ...card, value: 12 }
  }
  if (card.value === 'QUEEN') {
    output = { ...card, value: 13 }
  }
  if (card.value === 'KING') {
    output = { ...card, value: 14 }
  }
  return output
}
)

export const drawCards = (deckId, cardsNo) => {
  return dispatch => {
    axios.get(`${services.ROOT_URL}/${deckId}/${services.DRAW_CARDS}/?count=${cardsNo}`)
      .then(response => {
        const cards = normalizeCards(response.data.cards)
        console.log(cards)
        dispatch({ type: actionTypes.GET_DECK_INFO_SUCCESS, payload: response.data })
        dispatch({ type: actionTypes.SET_PLAYER_CARDS_SUCCESS, payload: cards.slice(0, consts.PLAYER_NO_CARDS) })
        dispatch({ type: actionTypes.SET_APP_CARDS_SUCCESS, payload: cards.slice(consts.PLAYER_NO_CARDS, consts.PLAYER_NO_CARDS + consts.PLAYER_NO_CARDS) })
        if (cardsNo === consts.INITIAL_NO_CARDS) dispatch({ type: actionTypes.SET_TABLE_CARDS_SUCCESS, payload: cards.slice(consts.PLAYER_NO_CARDS + consts.PLAYER_NO_CARDS, cards.length) })
      })
      .catch(error => {
        dispatch({ type: actionTypes.ERROR_MESSAGE, payload: error.message })
      })
  }
}

export const setPlayerCards = payload => ({ type: actionTypes.SET_PLAYER_CARDS_SUCCESS, payload })
export const setAppCards = payload => ({ type: actionTypes.SET_APP_CARDS_SUCCESS, payload })
export const setTableCards = payload => ({ type: actionTypes.SET_TABLE_CARDS_SUCCESS, payload })
export const setPlayerCount = payload => ({ type: actionTypes.SET_PLAYER_COUNT_SUCCESS, payload })
export const setAppCount = payload => ({ type: actionTypes.SET_APP_COUNT_SUCCESS, payload })
export const setPlayer = payload => ({ type: actionTypes.SET_PLAYER, payload })
