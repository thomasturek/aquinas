# Comprehensive Guide to Setting Up and Running Aquinas

## Introduction to Aquinas

Aquinas is an innovative social media engagement tool designed to enhance customer interaction by adding a touch of fun to brand communication. The tool continuously monitors Twitter for mentions of specific topics or keywords of interest. Through a multi-agent workflow powered by AutoGen, it analyzes the context and content of these tweets to generate witty and relevant reply suggestions that can be automatically sent.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Backend Setup](#backend-setup)
4. [AutoGen Integration](#autogen-integration)
5. [Frontend Setup](#frontend-setup)
6. [Twitter API Configuration](#twitter-api-configuration)
7. [Running the Application](#running-the-application)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- Git
- Node.js 14.x or higher
- npm 6.x or higher
- Python 3.8 or higher
- Redis 6.x or higher
- A Twitter Developer Account with API keys

## Project Structure

The Aquinas project consists of three main components:
1. Node.js Backend: Handles API requests, Twitter stream processing, and communication with AutoGen.
2. Python AutoGen Service: Provides AI-powered tweet analysis and reply generation.
3. React Frontend: User interface for interacting with the system.

## Backend Setup

### 1. Clone the Repository

```bash
git clone https://github.com/thomasturek/aquinas.git
cd aquinas
```

### 2. Install Backend Dependencies

```bash
npm install
```

This command installs all necessary Node.js packages, including `express`, `socket.io`, `twit`, and `python-shell`.

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
touch .env
```

Add the following variables (replace with your actual values):

```
TWITTER_CONSUMER_KEY=your_consumer_key
TWITTER_CONSUMER_SECRET=your_consumer_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your_openai_api_key
```

### 4. Set Up Redis

Ensure Redis is installed and running on your system. The default configuration assumes Redis is running on localhost:6379. If your setup differs, update the `REDIS_URL` in the `.env` file.

### 5. Prepare the Backend

The backend is written in TypeScript. Ensure all TypeScript files are compiled:

```bash
npm run build
```

This command should be defined in your `package.json` to compile TypeScript files to JavaScript.

## AutoGen Integration

AutoGen is a key component of Aquinas, providing AI-powered analysis and reply generation. It's integrated into the Node.js backend but runs as a separate Python service.

### 1. Set Up Python Environment

Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

### 2. Install AutoGen Dependencies

```bash
pip install pyautogen openai
```

### 3. Configure AutoGen Service

Create `autogen_service.py` in the project root:

```python
import sys
import autogen

def analyze_tweet_and_generate_reply(tweet_content):
    config_list = [{'model': 'gpt-3.5-turbo', 'api_key': 'your_openai_api_key'}]
    
    analyzer = autogen.AssistantAgent(
        name="analyzer",
        llm_config={
            "config_list": config_list,
            "temperature": 0.7,
        }
    )
    
    reply_generator = autogen.AssistantAgent(
        name="reply_generator",
        llm_config={
            "config_list": config_list,
            "temperature": 0.9,
        }
    )
    
    user_proxy = autogen.UserProxyAgent(name="user")
    
    analysis = user_proxy.initiate_chat(analyzer, message=f"Analyze this tweet: '{tweet_content}'")
    reply = user_proxy.initiate_chat(reply_generator, message=f"Based on this analysis: '{analysis}', generate a witty and relevant reply.")
    
    return reply

if __name__ == "__main__":
    if len(sys.argv) > 1:
        tweet_content = sys.argv[1]
        reply = analyze_tweet_and_generate_reply(tweet_content)
        print(reply)
```

Replace `'your_openai_api_key'` with your actual OpenAI API key.

### 4. Integrate AutoGen with Node.js Backend

Update the `analyzeTweetAndGenerateReply` function in `server.ts`:

```typescript
import { PythonShell, Options } from 'python-shell';
import path from 'path';

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
```

This function calls the Python AutoGen script to analyze tweets and generate replies.

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Configure Frontend Environment

Create a `.env` file in the frontend directory:

```bash
touch .env
```

Add:

```
REACT_APP_API_URL=http://localhost:3001
```

### 4. Build the Frontend

```bash
npm run build
```

## Twitter API Configuration

1. Log in to your Twitter Developer account (https://developer.twitter.com/).
2. Create a new application or use an existing one.
3. Generate Consumer Keys and Access Tokens.
4. Update the `.env` file in the project root with these credentials.

## Running the Application

1. Start Redis:
   ```bash
   redis-server
   ```

2. Start the Node.js backend:
   ```bash
   npm start
   ```

3. In a new terminal, navigate to the frontend directory and start the development server:
   ```bash
   cd frontend
   npm start
   ```

4. Open a web browser and go to `http://localhost:3000`.

The application should now be running, fetching tweets, and generating replies using AutoGen.

## Deployment

For production deployment:

1. Set up a production Redis instance.
2. Use a process manager like PM2 to run the Node.js backend.
3. Set up a reverse proxy (e.g., Nginx) to serve the frontend and route API requests to the backend.
4. Use HTTPS for secure connections.
5. Set up environment variables on your production server.

## Troubleshooting

- **Issue**: Backend fails to start
  **Solution**: Check if all environment variables are set correctly and Redis is running.

- **Issue**: AutoGen script fails
  **Solution**: Ensure Python environment is set up correctly and all dependencies are installed.

- **Issue**: Tweets are not being fetched
  **Solution**: Verify your Twitter API credentials and check the backend logs for any error messages.

- **Issue**: Automatic replies are not being generated
  **Solution**: Check the AutoGen script logs and ensure it's being called correctly from the Node.js backend.

- **Issue**: Redis connection fails
  **Solution**: Verify Redis is running and the REDIS_URL is correct in your .env file.

For any other issues, please check the application logs and refer to the project's GitHub issues page.