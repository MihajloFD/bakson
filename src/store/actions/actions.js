import axios from 'axios'
import * as actionTypes from './actionTypes'
import * as services from './services'
import * as consts from '../../helper/const'

export const getShuffledDeck = () => {
  return dispatch => {
    axios.get(`${services.ROOT_URL}${services.SHUFFLE_DECK_SERVICE}`)
      .then(response => {
        dispatch({ type: actionTypes.GET_SHUFFLED_DECK_SUCCESS, payload: response.data })
        dispatch(drawCards(response.data.deck_id, consts.INITIAL_NO_CARDS))
      })
      .catch(error => {
        dispatch({ type: actionTypes.ERROR_MESSAGE, payload: error.message })
      })
  }
}

const normalizeCards = deck => {
  return {
    ...deck,
    cards: deck.cards.map(card => {
      if (Number(card.value) <= 10) {
        return { ...card, value: Number(card.value) }
      }
      if (card.value === 'ACE') {
        return { ...card, value: 11 }
      }
      if (card.value === 'JACK') {
        return { ...card, value: 12 }
      }
      if (card.value === 'QUEEN') {
        return { ...card, value: 13 }
      }
      if (card.value === 'KING') {
        return { ...card, value: 14 }
      }
    })
  }
}

export const drawCards = (deckId, cardsNo) => {
  return dispatch => {
    axios.get(`${services.ROOT_URL}/${deckId}/${services.DRAW_CARDS}/?count=${cardsNo}`)
      .then(response => {
        dispatch({ type: actionTypes.GET_CARDS_SUCCESS, payload: normalizeCards(response.data) })
      })
      .catch(error => {
        dispatch({ type: actionTypes.ERROR_MESSAGE, payload: error.message })
      })
  }
}
