import React from 'react';

import MessageCard from './MessageCard';

export default function AlreadyVotedCard() {
  return (
    <MessageCard
      title="Thanks for voting!"
      message="Our system is showing that you've already voted. If you believe this is a mistake, please email rushil.perera1081@gmail.com"
    />
  );
}
