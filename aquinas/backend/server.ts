import express from 'express';
import { streamTweets, sendTweet } from './twitterService';
import { analyzeTweetAndGenerateReply } from './autogenService';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

const tweetQueue: any[] = [];

app.get('/api/tweets', (req, res) => {
  res.json(tweetQueue);
});

app.post('/api/reply', async (req, res) => {
  const { tweetId, replyContent } = req.body;
  try {
    const result = await sendTweet(replyContent);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

const stream = streamTweets(['your', 'keywords', 'here'], async (tweet) => {
  const suggestedReply = await analyzeTweetAndGenerateReply(tweet.text);
  tweetQueue.push({ ...tweet, suggestedReply });
  if (tweetQueue.length > 100) {
    tweetQueue.shift();
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});