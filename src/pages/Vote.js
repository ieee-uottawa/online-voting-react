import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card/index';
import CardHeader from '@material-ui/core/CardHeader/index';
import CardContent from '@material-ui/core/CardContent/index';
import CircularProgress from '@material-ui/core/CircularProgress/index';
import FormControl from '@material-ui/core/FormControl/index';
import FormControlLabel from '@material-ui/core/FormControlLabel/index';
import FormLabel from '@material-ui/core/FormLabel/index';
import Radio from '@material-ui/core/Radio/index';
import RadioGroup from '@material-ui/core/RadioGroup/index';
import CardActions from '@material-ui/core/CardActions/index';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button/index';
import { makeStyles } from '@material-ui/styles';

import MessageCard from '../components/MessageCard';
import request from '../network';

const useStyles = makeStyles({
  root: {
    maxWidth: '21rem',
    margin: '16px auto 0 auto',
  },
  title: {
    paddingBottom: '0',
  },
  subHeader: {
    marginTop: '16px',
  },
});

function Vote() {
  const [isLoading, setLoading] = useState(true);
  const [candidatesObj, setCandidates] = useState([]);
  const [selected, setSelected] = useState([]);

  let counter = 0;
  const messageQueue = [];
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [messageInfo, setMessageInfo] = useState({});

  function showMessage(message) {
    messageQueue.push({
      // eslint-disable-next-line no-plusplus
      key: counter++,
      message,
    });

    if (showSnackbar) {
      setShowSnackbar(false);
    } else {
      processQueue();
    }
  }

  function processQueue() {
    if (messageQueue.length > 0) {
      setMessageInfo(messageQueue.shift());
      setShowSnackbar(true);
    }
  }

  function handleSnackbarClose() {
    setShowSnackbar(false);
  }

  function handleSnackbarExit() {
    processQueue();
  }

  async function getCandidates() {
    const { body: data } = await request.get('/vote/candidates');
    setCandidates(data);
    setSelected(
      Object.entries(data)
        .reduce((obj, [position, candidates]) => {
          const newObj = obj;
          newObj[position] = candidates.filter(({ name }) => name === 'Abstain')[0].id;
          return newObj;
        }, {})
    );
    setLoading(false);
  }

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    getCandidates();
  }, []);

  const classes = useStyles();

  if (isLoading) {
    return (
      <div>
        <CircularProgress />
        <MessageCard message="Loading..." />
      </div>
    );
  }

  function handleChange(event) {
    const node = event.target;
    const position = node.parentNode.parentNode.parentNode.parentNode.getAttribute('aria-label');
    setSelected({
      ...selected,
      [position]: node.value,
    });
  }

  async function submitVote() {
    showMessage('Submitting vote...');
    const { ok } = await request.post('/vote/submit')
      .send({ candidates: Object.values(selected) })
      .set('Authorization', `Bearer ${localStorage.getItem('token')}`);

    if (ok) {
      showMessage('Vote successfully submitted!');
    } else {
      showMessage('Failed to submit vote! Please wait a few minutes before trying again...');
    }
  }

  return (
    <>
      <Card className={classes.root}>
        <CardHeader className={classes.title} title="Vote for your next ..." />
        <CardContent>
          <FormControl component="fieldset">
            {
              Object.entries(candidatesObj)
                .map(([position, candidates], index) => (
                  <div key={position}>
                    <FormLabel key={`${position}-header`} component="legend" className={index > 0 ? classes.subHeader : ''}>{position}</FormLabel>
                    <RadioGroup aria-label={position} name={position} value={selected[position].toString()} onChange={handleChange}>
                      {candidates.map(({ id, name }) => (
                        <FormControlLabel
                          key={`${position}-${name}`}
                          control={<Radio color="secondary" />}
                          label={name}
                          value={id.toString()}
                        />
                      ))}
                    </RadioGroup>
                  </div>
                ))
            }
          </FormControl>
        </CardContent>
        <CardActions>
          <Button size="small" color="secondary" onClick={() => submitVote()}>
            Submit
          </Button>
        </CardActions>
      </Card>
      <Snackbar
        key={messageInfo.key}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={showSnackbar}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        onExited={handleSnackbarExit}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{messageInfo.message}</span>}
      />
    </>
  );
}

export default Vote;
