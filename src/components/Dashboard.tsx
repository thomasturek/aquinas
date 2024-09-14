import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import TweetList from './TweetList';
import ReplyForm from './ReplyForm';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  token: string;
}

const Dashboard: React.FC<DashboardProps> = ({ token }) => {
  const [tweets, setTweets] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keywords, setKeywords] = useState('');

  // Just some placeholder chart data
  const chartData = [
    { name: 'Jan', tweets: 40, replies: 24 },
    { name: 'Feb', tweets: 30, replies: 13 },
    { name: 'Mar', tweets: 20, replies: 18 },
    { name: 'Apr', tweets: 27, replies: 20 },
    { name: 'May', tweets: 18, replies: 15 },
    { name: 'Jun', tweets: 23, replies: 19 },
    { name: 'Jul', tweets: 34, replies: 30 },
  ];

  useEffect(() => {
    fetchTweets(currentPage);

    const socket = io({
      auth: {
        token: token
      }
    });

    socket.on('newTweet', (tweet) => {
      setTweets((prevTweets) => [tweet, ...prevTweets]);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, currentPage]);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywords(e.target.value);
  };

  const handleKeywordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Call API to update tweet stream with new keywords
    console.log('Updating keywords:', keywords);
  };

  const fetchTweets = async (page: number) => {
    try {
      const response = await fetch(`/api/tweets?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setTweets(data.tweets);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching tweets:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        {/* Sidebar content */}
      </aside>
      <main className="main-content">
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

        <div className="card chart-container">
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

        <div className="card keyword-search">
          <form onSubmit={handleKeywordSubmit}>
            <input
              type="text"
              placeholder="Enter keywords to track (comma-separated)"
              value={keywords}
              onChange={handleKeywordChange}
            />
            <button type="submit">Update Keywords</button>
          </form>
        </div>

        <div className="card tweet-list">
          {tweets.map((tweet) => (
            <div key={tweet.id} className="tweet">
              <div className="tweet-author">{tweet.user.name}</div>
              <div className="tweet-content">{tweet.text}</div>
              <div className="tweet-actions">
                <button>Send Reply</button>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;