import Twit from 'twit';
import dotenv from 'dotenv';

dotenv.config();

const T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY as string,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET as string,
  access_token: process.env.TWITTER_ACCESS_TOKEN as string,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET as string,
});

export function streamTweets(keywords: string[], callback: (tweet: any) => void) {
  const stream = T.stream('statuses/filter', { track: keywords });

  stream.on('tweet', (tweet) => {
    callback(tweet);
  });

  return stream;
}

export function sendTweet(status: string) {
  return new Promise((resolve, reject) => {
    T.post('statuses/update', { status }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}