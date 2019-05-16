import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import CardActions from '@material-ui/core/CardActions';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { Redirect } from 'react-router-dom';

import request from '../network';
import MessageCard from '../components/MessageCard';
import AlreadyVotedCard from '../components/AlreadyVotedCard';
import SuccessfullyVotedCard from '../components/SuccessfullyVotedCard';
import VoteConfirmationDialog from '../components/VoteConfirmationDialog';

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
  instructions: {
    margin: '0 16px',
  },
});

function Vote() {
  const [canVote, setCanVote] = useState(true);
  const [canVoteBody, setCanVoteBody] = useState(undefined);
  const [hasAlreadyVoted, setAlreadyVoted] = useState(false);
  const [hasSuccessfullyVoted, setSuccessfullyVoted] = useState(false);

  const [isLoading, setLoading] = useState(true);
  const [candidatesObj, setCandidates] = useState([]);
  const [selected, setSelected] = useState([]);

  const [showConfirmationDialog, setShowDialog] = useState(false);

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
    const { body: data, status } = await request
      .get('/vote/candidates')
      .ok(res => res.status < 500);

    if (status === 412) {
      setCanVoteBody(data);
      setCanVote(false);
    } else {
      setCandidates(data);
      setSelected(
        Object.entries(data)
          .reduce((obj, [position, candidates]) => {
            const newObj = obj;
            const { id, position: positionName, name: candidate } = candidates.filter(({ name }) => name === 'Abstain')[0];
            newObj[position] = {
              id,
              position: positionName,
              name: candidate,
            };
            return newObj;
          }, {}),
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    getCandidates();
  }, []);

  function handleChange(event) {
    const node = event.target;

    const position = node.parentNode.parentNode.parentNode.parentNode.getAttribute('aria-label');

    const radioButton = node.parentNode.parentNode.parentNode;
    const id = radioButton.children[0].children[0].children[1].getAttribute('value');
    const name = radioButton.children[1].innerText;

    setSelected({
      ...selected,
      [position]: {
        position,
        id,
        name,
      },
    });
  }

  async function submitVote() {
    closeConfirmationDialog();
    showMessage('Submitting vote...');
    const { ok, status, body } = await request
      .post('/vote/submit')
      .ok(res => res.status < 500)
      .send({ candidates: Object.values(selected) })
      .set('Authorization', `Bearer ${localStorage.getItem('token')}`);

    try {
      console.log(ok, status, body);
      if (ok) {
        localStorage.removeItem('token');
        setSuccessfullyVoted(true);
      } else if (status === 409) {
        setAlreadyVoted(true);
      } else if (status === 412) {
        setCanVoteBody(body);
        setCanVote(false);
      } else {
        showMessage('Failed to submit vote! Please wait a few minutes before trying again...');
      }
    } catch (e) {
      showMessage('Failed to submit vote! Please wait a few minutes before trying again...');
    }
  }

  function handleShowConfirmationDialog() {
    setShowDialog(true);
  }

  function closeConfirmationDialog() {
    setShowDialog(false);
  }

  const classes = useStyles();

  if (!canVote) {
    return (
      <Redirect
        to={{
          pathname: '/',
          state: canVoteBody,
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <div>
        <CircularProgress />
        <MessageCard message="Loading..." />
      </div>
    );
  }

  if (hasAlreadyVoted) {
    return <AlreadyVotedCard />;
  }

  if (hasSuccessfullyVoted) {
    return <SuccessfullyVotedCard />;
  }

  if (localStorage.getItem('token') === null) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Typography className={classes.instructions} variant="body1" gutterBottom>
        If you are confident that any of the candidates are not going to do well in the position they are running for, select
        {' '}
        <strong>No Confidence.</strong>
        {' '}
        If you would rather not vote for any of the candidates for a certain position for any other reason, select
        {' '}
        <strong>Abstain.</strong>
      </Typography>
      <Card className={classes.root}>
        <CardHeader className={classes.title} title="Vote for your next ..." />
        <CardContent>
          <FormControl component="fieldset">
            {
              Object.entries(candidatesObj)
                .map(([position, candidates], index) => (
                  <div key={position}>
                    <FormLabel key={`${position}-header`} component="legend" className={index > 0 ? classes.subHeader : ''}>{position}</FormLabel>
                    <RadioGroup aria-label={position} name={position} value={selected[position].id.toString()} onChange={handleChange}>
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
          <Button size="small" color="secondary" onClick={() => handleShowConfirmationDialog()}>
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
      <VoteConfirmationDialog
        show={showConfirmationDialog}
        handleConfirmation={submitVote}
        positions={selected}
        handleCancel={closeConfirmationDialog}
      />
    </>
  );
}

export default Vote;
