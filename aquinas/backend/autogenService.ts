async function analyzeTweetAndGenerateReply(tweetContent: string): Promise<string> {
    try {
      const response = await fetch('/api/analyze-and-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tweet: tweetContent }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze tweet and generate reply');
      }
      
      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error('Error in analyzeTweetAndGenerateReply:', error);
      throw error;
    }
  }