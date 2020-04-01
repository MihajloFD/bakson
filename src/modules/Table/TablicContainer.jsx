import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getShuffledDeck, setTableCards, setPlayerCount, setPlayerCards, setPlayer, setAppCount, setAppCards, drawCards } from '../../store/actions/actions'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import CardView from './CardView'

const useStyles = makeStyles(theme => ({
  container: {
    background: '#4CAF50',
    height: '100vh'
  },
  item: {
    minHeight: 220
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

  const isMoveValid = ({ value }) => {
    const selected = tableCards.filter(card => card.selected)

    const sum = count(selected)
    const valid = sum === value

    console.log(sum, value, valid)

    return valid && selected
  }

  const playerMove = card => () => {
    if (!isPlayer) return

    if (isMoveValid(card)) {
      dispatch(setPlayerCount([...palyerCount, ...isMoveValid(card), card]))
      dispatch(setTableCards(tableCards.filter(a => !isMoveValid(card).find(b => b.code === a.code))))
    } else {
      dispatch(setTableCards([...tableCards, card]))
    }
    dispatch(setPlayerCards(playerCards.filter(item => item.code !== card.code)))
    dispatch(setPlayer(false))
  }

  const appMove = card => () => {
    if (isPlayer) return

    if (isMoveValid(card)) {
      dispatch(setAppCount([...appCount, ...isMoveValid(card), card]))
      dispatch(setTableCards(tableCards.filter(a => !isMoveValid(card).find(b => b.code === a.code))))
    } else {
      dispatch(setTableCards([...tableCards, card]))
    }

    if (appCards.length === 1 && remaining) {
      dispatch(drawCards(deck.deck_id, 12))
    }
    dispatch(setAppCards(appCards.filter(item => item.code !== card.code)))
    dispatch(setPlayer(true))
  }

  const renderCards = (cards, action) => {
    return cards.map(card => {
      const cardProps = { card, action, classes }
      return (
        <CardView key={card.code} {...cardProps} />
      )
    })
  }

  return (
    <Grid className={classes.container}>
      <Grid className={classes.item} justify="center" container>
        {renderCards(playerCards, playerMove)}
      </Grid>
      <Grid className={classes.item} justify="center" container>
        {renderCards(tableCards, handleSelecTableCard)}
      </Grid>
      <Grid className={classes.item} justify="center" container>
        {renderCards(appCards, appMove)}
      </Grid>
    </Grid>
  )
}

export default Table
