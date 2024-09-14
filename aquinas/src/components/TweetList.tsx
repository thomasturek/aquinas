import React from 'react';

interface Tweet {
  id_str: string;
  text: string;
  user: {
    name: string;
    screen_name: string;
  };
  suggestedReply: string;
}

interface TweetListProps {
  tweets: Tweet[];
}

const TweetList: React.FC<TweetListProps> = ({ tweets }) => {
  return (
    <div>
      <h2>Recent Tweets</h2>
      {tweets.map((tweet) => (
        <div key={tweet.id_str}>
          <p>{tweet.text}</p>
          <p>By: {tweet.user.name} (@{tweet.user.screen_name})</p>
          <p>Suggested Reply: {tweet.suggestedReply}</p>
        </div>
      ))}
    </div>
  );
};

export default TweetList;