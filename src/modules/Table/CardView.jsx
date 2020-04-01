import React from 'react'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import PropTypes from 'prop-types'

const CardView = ({ card, action, classes }) => {
  return (
    <Grid onClick={action(card)} item xs={2}>
      <Card className={classes.root}>
        <CardMedia
          className={card.selected ? classes.selected : classes.media}
          image={card.image}
        />
      </Card>
    </Grid>
  )
}
CardView.propTypes = {
  card: PropTypes.object.isRequired,
  action: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}
export default CardView
