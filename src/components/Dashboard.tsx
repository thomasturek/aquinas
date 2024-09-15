import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  token: string;
}

interface Tweet {
  id: number;
  author: string;
  content: string;
  suggestedReply: string;
}

const Dashboard: React.FC<DashboardProps> = ({ token }) => {
  const [keywords, setKeywords] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Placeholder chart data
  const chartData = [
    { name: 'Jan', tweets: 40, replies: 24 },
    { name: 'Feb', tweets: 30, replies: 13 },
    { name: 'Mar', tweets: 20, replies: 18 },
    { name: 'Apr', tweets: 27, replies: 20 },
    { name: 'May', tweets: 18, replies: 15 },
    { name: 'Jun', tweets: 23, replies: 19 },
    { name: 'Jul', tweets: 34, replies: 30 },
  ];

  // Placeholder tweets with suggested replies
  const placeholderTweets: Tweet[] = [
    { id: 1, author: 'John Doe', content: 'Just tried the new feature. Its amazing! #ProductName', suggestedReply: "We're thrilled you're enjoying it, John! Thanks for sharing your experience." },
    { id: 2, author: 'Jane Smith', content: 'Having some issues with the latest update. Any help? @SupportTeam', suggestedReply: "We're sorry to hear that, Jane. Our support team will reach out to you shortly to assist." },
    { id: 3, author: 'Tech Enthusiast', content: 'Comparing #ProductName with competitors. So far, its winning!', suggestedReply: "That's great to hear! We'd love to know what features you find most compelling." },
    { id: 4, author: 'New User', content: 'Just signed up. Excited to explore all the features!', suggestedReply: "Welcome aboard! Feel free to reach out if you need any help getting started." },
    { id: 5, author: 'Power User', content: 'Pro tip: Use the shortcut Ctrl+Shift+P for quick access. #ProductTip', suggestedReply: "Thanks for sharing that tip! Our power users always have the best insights." },
  ];

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywords(e.target.value);
  };

  const handleKeywordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement keyword update logic here
    console.log('Keywords updated:', keywords);
  };

  const handleReply = (tweetId: number) => {
    // Implement reply logic here
    console.log('Replying to tweet:', tweetId);
  };

  return (
    <div className="dashboard-container">
      <div className="left-panel">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>129+</h3>
            <p>Tweets Analyzed</p>
          </div>
          <div className="stat-card">
            <h3>20+</h3>
            <p>Replies Sent</p>
          </div>
          <div className="stat-card">
            <h3>130+</h3>
            <p>Engagements</p>
          </div>
          <div className="stat-card">
            <h3>15+</h3>
            <p>New Followers</p>
          </div>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="tweets" stroke="#6366f1" name="Tweets" />
              <Line type="monotone" dataKey="replies" stroke="#10b981" name="Replies" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <form className="keyword-search" onSubmit={handleKeywordSubmit}>
          <input
            type="text"
            placeholder="Enter keywords to track (comma-separated)"
            value={keywords}
            onChange={handleKeywordChange}
          />
          <button type="submit">Update Keywords</button>
        </form>
      </div>

      <div className="right-panel">
        <div className="tweet-feed">
          {placeholderTweets.map((tweet) => (
            <div key={tweet.id} className="tweet">
              <div className="tweet-author">{tweet.author}</div>
              <div className="tweet-content">{tweet.content}</div>
              <div className="tweet-reply">
                <div className="ai-label">AI-generated response:</div>
                <p>{tweet.suggestedReply}</p>
                <button className="reply-button" onClick={() => handleReply(tweet.id)}>Reply</button>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of 1</span>
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === 1}>
            Next
          </button>
        </div>
      </div>

      <button className="logout-button">Logout</button>
    </div>
  );
};

export default Dashboard;