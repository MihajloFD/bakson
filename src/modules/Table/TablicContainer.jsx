import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getShuffledDeck, setTableCards, setPlayerCount, setPlayerCards, setPlayer, setAppCount, setAppCards, drawCards } from '../../store/actions/actions'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import CardView from './CardView'

const useStyles = makeStyles(theme => ({
  container: {
    background: '#4CAF50',
    minHeight: '100vh'
  },
  player: {
    minHeight: 220,
    borderLeft: '10px solid #4CAF50'
  },
  root: {
    maxWidth: 138,
    height: 200,
    marginBottom: 50
  },
  media: {
    height: '100%',
    cursor: 'pointer'
  },
  selected: {
    height: '100%',
    cursor: 'pointer',
    opacity: 0.5
  },
  active: {
    minHeight: 220,
    borderLeft: '10px solid red'
  }
}))

const Table = () => {
  const dispatch = useDispatch()
  const classes = useStyles()

  useEffect(() => {
    dispatch(getShuffledDeck())
  }, [dispatch])

  const { playerCards, palyerCount, appCards, appCount, tableCards, isPlayer, deck } = useSelector(state => state.tablic)
  const { remaining } = deck

  const handleSelecTableCard = card => () => {
    const updatedArray = tableCards.map(item => item.code === card.code ? item.selected ? { ...item, selected: false } : { ...item, selected: true } : item)
    dispatch(setTableCards(updatedArray))
  }

  const count = array => {
    const sum = array.reduce((a, b) => a + b.value, 0)
    return sum
  }

  const selected = tableCards.filter(card => card.selected)

  const isMoveValid = ({ value }) => {
    let moveValid = false
    const different = selected.filter(item => item.value !== value)
    const same = selected.filter(item => item.value === value)
    const selectedSum = count(selected)
    if (!different.length && same.length) {
      moveValid = true
    }
    if (different.find(item => item.value < value)) {
      if (count(different) % value === 0) {
        moveValid = true
      }
      const aces = (selected.filter(item => item.value === 11))
      if (aces.length) {
        let currentSum = selectedSum
        aces.forEach(() => {
          currentSum -= 10
          if (currentSum % value === 0 && !moveValid) {
            moveValid = true
          }
        })
      }
    }
    return moveValid
  }

  const moveCard = (card, player) => () => {
    if (player && !isPlayer) return
    if (!player && isPlayer) return
    if (isMoveValid(card)) {
      if (isPlayer) {
        dispatch(setPlayerCount([...palyerCount, ...selected, card]))
      } else {
        dispatch(setAppCount([...appCount, ...selected, card]))
      }
      dispatch(setTableCards(tableCards.filter(item => !item.selected)))
    } else {
      dispatch(setTableCards([...tableCards, card].map(item => item.selected ? { ...item, selected: false } : item)))
    }
    if (isPlayer) {
      dispatch(setPlayerCards(playerCards.filter(item => item.code !== card.code)))
      dispatch(setPlayer(false))
    } else {
      if (appCards.length === 1 && remaining) {
        dispatch(drawCards(deck.deck_id, 12))
      }
      dispatch(setAppCards(appCards.filter(item => item.code !== card.code)))
      dispatch(setPlayer(true))
    }
  }

  const renderCards = (cards, action, player) => {
    return cards.map(card => {
      const cardProps = { card, action, classes, player }
      return (
        <CardView key={card.code} {...cardProps} />
      )
    })
  }

  return (
    <Grid className={classes.container}>
      <Grid className={isPlayer ? classes.active : classes.player} justify="center" container>
        {renderCards(playerCards, moveCard, true)}
      </Grid>
      <Grid className={classes.player} justify="center" container>
        {renderCards(tableCards, handleSelecTableCard)}
      </Grid>
      <Grid className={!isPlayer ? classes.active : classes.player} justify="center" container>
        {renderCards(appCards, moveCard)}
      </Grid>
    </Grid>
  )
}

export default Table
