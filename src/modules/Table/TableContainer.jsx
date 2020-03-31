import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getShuffledDeck, drawCards } from '../../store/actions/actions'
import { makeStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'

import * as consts from '../../helper/const'

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

  const tablic = useSelector(state => state.tablic)
  const { deck, remaining } = tablic
  const { cards = [] } = deck

  const [playerCards, setPlayerCards] = useState([])
  const [palyerCount, setPlayerCount] = useState([])
  const [appCards, setAppCards] = useState([])
  const [appCount, setAppCount] = useState([])
  const [tableCards, setTableCards] = useState([])
  const [isPlayer, setPlayer] = useState(true)
  console.log('palyerCount', palyerCount, 'appCount', appCount)
  const [flag, setFleg] = useState(false)
  const [flagTwo, setFlegTwo] = useState(false)

  const handleSelecTableCard = card => () => {
    const updatedArray = tableCards.map(item => item.code === card.code ? item.selected ? { ...item, selected: false } : { ...item, selected: true } : item)
    setTableCards(updatedArray)
  }

  const count = array => {
    const sum = array.reduce((a, b) => a + b.value, 0)
    return sum
  }

  const isMoveValid = ({ value }) => {
    // let valid = false

    const selected = tableCards.filter(card => card.selected)

    // if (selectedCards.length === 1) {
    //   valid = selectedCards[0].value === value
    // }
    // if (selectedCards.length === 2) {
    //   sum = count(selectedCards)
    //   valid = selectedCards[0].value === value && selectedCards[1].value === value
    //   valid = sum === value
    //   valid = (selectedCards[0].value === 11 || selectedCards[1].value === 11) && sum + 1 === value
    // }

    const sum = count(selected)

    // setTableCards([])
    // setSelectedCards([])
    const valid = sum === value

    console.log(sum, value, valid)

    return valid && selected
  }

  const playerMove = card => () => {
    if (!isPlayer) return
    if (isMoveValid(card)) {
      setPlayerCount([...palyerCount, ...isMoveValid(card), card])
      setTableCards(tableCards.filter(a => !isMoveValid(card).find(b => b.code === a.code)))
    } else {
      setTableCards([...tableCards, card])
    }
    setPlayerCards(playerCards.filter(item => item.code !== card.code))
    setPlayer(false)
  }

  const appMove = card => () => {
    if (isPlayer) return
    if (isMoveValid(card)) {
      setAppCount([...appCount, ...isMoveValid(card), card])
      setTableCards(tableCards.filter(a => !isMoveValid(card).find(b => b.code === a.code)))
    } else {
      setTableCards([...tableCards, card])
    }
    if (appCards.length === 1 && remaining) {
      handleDrawCards()
    }
    setAppCards(appCards.filter(item => item.code !== card.code))
    setPlayer(true)
  }

  const handleDrawCards = () => {
    dispatch(drawCards(deck.deck_id, 12))
    setFlegTwo(false)
  }

  const renderTable = card => {
    return (
      <Grid onClick={handleSelecTableCard(card)} key={card.code} item xs={2}>
        <Card className={classes.root}>
          <CardMedia
            className={card.selected ? classes.selected : classes.media}
            image={card.image}
          />
        </Card>
      </Grid>
    )
  }

  const renderPlayerCards = card => {
    return (
      <Grid onClick={playerMove(card)} key={card.code} item xs={2}>
        <Card className={classes.root}>
          <CardMedia
            className={classes.media}
            image={card.image}
          />
        </Card>
      </Grid>
    )
  }

  const renderAppCards = card => {
    return (
      <Grid onClick={appMove(card)} key={card.code} item xs={2}>
        <Card className={classes.root}>
          <CardMedia
            className={classes.media}
            image={card.image}
          />
        </Card>
      </Grid>
    )
  }

  if (cards.length === consts.INITIAL_NO_CARDS && !flag) {
    console.log('initial')
    const player = cards.slice(0, 6)
    const app = cards.slice(6, 12)
    const table = cards.slice(12, cards.length)
    setPlayerCards(player)
    setAppCards(app)
    setTableCards(table)
    setFleg(true)
  }
  if (cards.length === 12 && !flagTwo) {
    console.log('dvanest')
    const player = cards.slice(0, 6)
    const app = cards.slice(6, 12)
    setPlayerCards(player)
    setAppCards(app)
    setFlegTwo(true)
  }

  return (
    <Grid className={classes.container}>
      <Grid className={classes.item} justify="center" container>
        {playerCards.map(renderPlayerCards)}
      </Grid>
      <Grid className={classes.item} justify="center" container>
        {tableCards.map(renderTable)}
      </Grid>
      <Grid className={classes.item} justify="center" container>
        {appCards.map(renderAppCards)}
      </Grid>
    </Grid>
  )
}

export default Table
