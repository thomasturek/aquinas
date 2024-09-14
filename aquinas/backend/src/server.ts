import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { streamTweets, sendTweet } from '../twitterService';
import { registerUser, loginUser } from '../userService';
import { authenticateToken } from '../auth';
import { cacheData, getCachedData } from '../cacheService';
import dotenv from 'dotenv';
import { PythonShell, Options } from 'python-shell';
import path from 'path';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3001;

app.use(express.json());

const tweetQueue: any[] = [];

app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await registerUser(username, password);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

async function analyzeTweetAndGenerateReply(tweetContent: string): Promise<string> {
  try {
    const options: Options = {
      mode: 'text',
      pythonPath: 'python', // Update this path if necessary
      args: [tweetContent]
    };

    const scriptPath = path.join(__dirname, '..', 'autogen_service.py');
    const results = await PythonShell.run(scriptPath, options);
    return results[0] || '';
  } catch (error) {
    console.error('Error running Python script:', error);
    throw error;
  }
}

async function fetchTweetsFromDatabase() {
  // In a real application, this would fetch tweets, for now just some dummy data :)
  return Array.from({ length: 100 }, (_, i) => ({
    id: i,
    text: `This is tweet number ${i}`,
    user: {
      name: `User ${i}`,
      screen_name: `user${i}`
    },
    created_at: new Date().toISOString()
  }));
}

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await loginUser(username, password);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.get('/api/tweets', authenticateToken, async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const cachedTweets = await getCachedData(`tweets_page_${page}`);
  if (cachedTweets) {
    return res.json(cachedTweets);
  }

  // Fetch tweets from the database or API
  const allTweets = await fetchTweetsFromDatabase();
  const paginatedTweets = allTweets.slice(startIndex, endIndex);
  
  const result = {
    tweets: paginatedTweets,
    currentPage: page,
    totalPages: Math.ceil(allTweets.length / limit)
  };

  // Cache the paginated tweets for 5 minutes
  await cacheData(`tweets_page_${page}`, result, 300);
  
  res.json(result);
});

app.post('/api/reply', authenticateToken, async (req, res) => {
  const { tweetId, replyContent } = req.body;
  try {
    const result = await sendTweet(replyContent);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const stream = streamTweets(['your', 'keywords', 'here'], async (tweet) => {
  try {
    const suggestedReply = await analyzeTweetAndGenerateReply(tweet.text);
    const tweetWithReply = { ...tweet, suggestedReply };
    io.emit('newTweet', tweetWithReply);
  } catch (error) {
    console.error('Error processing tweet:', error);
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use('/api/tweets', authenticateToken);
app.use('/api/reply', authenticateToken);