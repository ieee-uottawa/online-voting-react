import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  root: {
    margin: '0 auto 32px',
  },
  '@media screen and (min-width: 410px)': {
    root: {
      width: '25%',
      minWidth: '369px',
    },
  },
  '@media screen and (max-width: 409px)': {
    root: {
      maxWidth: '369px',
      margin: '0 16px 32px',
      width: '92%',
    },
  },
});

export default function MessageCard({ message, title }) {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        {title && <Typography variant="h4" gutterBottom>{title}</Typography>}
        <Typography variant="body1">{message}</Typography>
      </CardContent>
    </Card>
  );
}

MessageCard.propTypes = {
  message: PropTypes.string.isRequired,
  title: PropTypes.string,
};

MessageCard.defaultProps = {
  title: undefined,
};
