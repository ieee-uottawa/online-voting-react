import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import MessageCard from '../components/MessageCard';
import request from '../network';

export default function CanVote(props) {
  const [isLoading, setLoading] = useState(true);
  const [votingNotStarted, setNotStarted] = useState(false);
  const [votingEnded, setClosed] = useState(false);
  const [date, setDate] = useState(undefined);

  useEffect(() => {
    const updateState = (state) => {
      const { notStarted, isClosed, date: voteDate } = state;
      setNotStarted(notStarted);
      setClosed(isClosed);
      setDate(voteDate);
    };

    if (!props.location.state) {
      request.get('/can-vote')
        .ok(res => res.status < 500)
        .then(({ status, body }) => {
          if (status === 412) updateState(body);
          setLoading(false);
        });
    } else {
      updateState(props.location.state);
      setLoading(false);
    }
  }, [props.location.state]);

  if (isLoading) {
    return <MessageCard message="Loading..." />;
  }

  if (votingNotStarted) {
    return <MessageCard message={`Voting begins at ${date}`} title="Voting has not started yet" />;
    // eslint-disable-next-line no-else-return
  } else if (votingEnded) {
    return <MessageCard message={`Voting ended at ${date}`} title="Voting ended" />;
  } else {
    return <Redirect to="/login" />;
  }
}
