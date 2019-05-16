import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import dayjs from 'dayjs';

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
      setDate(dayjs(voteDate).format('MMMM D [at] h:mm A'));
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
    return <MessageCard title="Is the voting system open?" message="Loading..." />;
  }

  if (votingNotStarted) {
    return <MessageCard message={`Voting begins at ${date}`} title="Is the voting system open?" />;
    // eslint-disable-next-line no-else-return
  } else if (votingEnded) {
    return <MessageCard message={`Voting ended at ${date}`} title="Is the voting system open?" />;
  } else {
    return <Redirect to="/login" />;
  }
}
