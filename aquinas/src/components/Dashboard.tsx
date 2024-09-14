import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import TweetList from './TweetList';
import ReplyForm from './ReplyForm';

interface DashboardProps {
  token: string;
}

const Dashboard: React.FC<DashboardProps> = ({ token }) => {
  const [tweets, setTweets] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
    <div>
      <h1>Social Media Engagement Dashboard</h1>
      <TweetList tweets={tweets} />
      <div>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      <ReplyForm token={token} />
    </div>
  );
};

export default Dashboard;