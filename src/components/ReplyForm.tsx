import React, { useState } from 'react';

interface ReplyFormProps {
  token: string;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ token }) => {
  const [replyContent, setReplyContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ replyContent }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Reply sent successfully!');
        setReplyContent('');
      } else {
        alert('Failed to send reply');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        placeholder="Enter your reply..."
      />
      <button type="submit">Send Reply</button>
    </form>
  );
};

export default ReplyForm;