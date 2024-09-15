# Aquinas: AI-Powered Social Media Engagement Tool

![Aquinas Logo](./assets/logo.png)

## Introduction

Aquinas is an innovative social media engagement tool designed to enhance customer interaction by adding a touch of fun and intelligence to brand communication. Leveraging the power of AutoGen, a multi-agent AI framework, Aquinas continuously monitors Twitter for mentions of specific topics or keywords of interest. It then analyzes the context and content of these tweets to generate witty and relevant reply suggestions, which can be reviewed and sent with human approval.

## Example Use Case

John, the owner of a coffee brand called "BeanVibe," wants to ensure that his brand engages effectively with customers on social media. He uses Aquinas, which automatically monitors Twitter for mentions of "BeanVibe" or related keywords like "coffee" or "morning brew." When a user tweets:

“Just had the best cup of coffee from @BeanVibe to kickstart my day!”

Aquinas detects the mention and, using its AI framework, generates a reply suggestion:

“We’re thrilled to be part of your morning routine! ☕ What’s your favorite blend from BeanVibe?”

John reviews the suggested reply and with a single click approves it to be sent automatically, adding a personal touch without the need for manual crafting.

## Table of Contents
1. [Key Features](#key-features)
2. [Technology Stack](#technology-stack)
3. [AutoGen Implementation](#autogen-implementation)
4. [Prerequisites](#prerequisites)
5. [Installation and Setup](#installation-and-setup)
6. [Running the Application](#running-the-application)
7. [Project Structure](#project-structure)
8. [Configuration](#configuration)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)
11. [Contributing](#contributing)
12. [License](#license)

## Key Features

- Real-time Twitter monitoring for brand-relevant tweets
- AI-powered tweet analysis and response generation
- Multi-agent workflow for nuanced understanding and creative replies
- Human-in-the-loop approval process for quality control
- Web-based dashboard for tweet management and response approval

## Technology Stack

- Backend: Node.js with Express, TypeScript
- Frontend: React, TypeScript
- AI Framework: AutoGen (Python)
- Database: Redis for caching
- APIs: Twitter API for tweet streaming and posting
- Authentication: JWT for secure user sessions

## AutoGen Implementation

Aquinas utilizes AutoGen, a powerful framework for building multi-agent AI systems, to analyze tweets and generate appropriate responses. This implementation is crucial for providing intelligent, context-aware, and brand-appropriate replies at scale.

### AutoGen Workflow

1. **Tweet Capture**: The Node.js backend captures relevant tweets using the Twitter streaming API.
2. **AutoGen Processing**: Captured tweets are sent to the AutoGen service for analysis and response generation.
3. **Multi-Agent Analysis**: Within AutoGen, multiple AI agents collaborate to understand and respond to the tweet.
4. **Human Approval**: Generated responses are sent back to the Node.js backend and presented for human approval via the frontend interface.
5. **Reply Posting**: Approved responses are posted back to Twitter using the Twitter API.

### AutoGen Agents and Their Roles

1. **Tweet Catcher Agent**
   - Role: Monitors incoming tweets and identifies those relevant to the brand.
   - Implementation:
     ```python
     tweet_catcher = autogen.AssistantAgent(
         name="TweetCatcher",
         llm_config={"config_list": config_list},
         system_message="You are responsible for monitoring incoming tweets and identifying those that mention the company's name. Analyze the content and sentiment of these tweets."
     )
     ```

2. **Content Screener Agent**
   - Role: Reviews flagged tweets to assess appropriateness for response.
   - Implementation:
     ```python
     content_screener = autogen.AssistantAgent(
         name="ContentScreener",
         llm_config={"config_list": config_list},
         system_message="Your role is to review tweets flagged by the TweetCatcher. Assess if the content is appropriate to respond to. Consider factors such as sentiment, potential controversy, and relevance to the company."
     )
     ```

3. **Response Generator Agent**
   - Role: Creates witty and relevant reply suggestions for approved tweets.
   - Implementation:
     ```python
     response_generator = autogen.AssistantAgent(
         name="ResponseGenerator",
         llm_config={"config_list": config_list},
         system_message="Based on the approved tweets, generate witty and relevant reply suggestions. Ensure the responses align with the company's brand voice and are engaging for the audience."
     )
     ```

4. **Human Proxy Agent**
   - Role: Simulates human approval in the automated workflow (for testing and development).
   - Implementation:
     ```python
     human_proxy = autogen.UserProxyAgent(
         name="HumanApprover",
         human_input_mode="NEVER",
         max_consecutive_auto_reply=1,
         is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("APPROVE"),
         system_message="You are a human approver. Review the suggested response and type 'APPROVE' if it's good to go, or provide feedback for improvements."
     )
     ```

   Note: In the production environment, this will be replaced with actual human input through the frontend interface.

## Prerequisites

Before setting up Aquinas, ensure you have the following installed:

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- Python (v3.8 or higher)
- Redis (v6.x or higher)
- Git

You'll also need:
- A Twitter Developer Account with API keys
- An OpenAI API key for AutoGen

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/aquinas.git
   cd aquinas

2. Install backend dependencies:
    ```bash
    bashCopynpm install

3. Set up the Python environment for AutoGen:
    ```bash
    bashCopypython -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    pip install pyautogen openai

4. Install frontend dependencies:
    ```bash
    bashCopycd frontend
    npm install
    cd ..

5. Create and configure the .env file in the project root:
    ```bash
    CopyTWITTER_CONSUMER_KEY=your_twitter_consumer_key
    TWITTER_CONSUMER_SECRET=your_twitter_consumer_secret
    TWITTER_ACCESS_TOKEN=your_twitter_access_token
    TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
    JWT_SECRET=your_jwt_secret
    REDIS_URL=redis://localhost:6379
    OPENAI_API_KEY=your_openai_api_key

6. Create and configure the .env file in the frontend directory:
    ```bash
    CopyREACT_APP_API_URL=http://localhost:3001

 ## Running the Application

1. Start Redis:
    ```bash
    bashCopyredis-server

2. In a new terminal, start the Node.js backend:
    ```bash 
    bashCopynpm run build
    npm start

3. In another terminal, start the React frontend:
    ```bash
    bashCopycd frontend
    npm start

4. Open your browser and navigate to http://localhost:3000 to access the Aquinas dashboard.

## Configuration

Adjust the config_list in autogen_service.py to change the AI model or parameters.

Modify the twitterService.ts to adjust tweet filtering criteria.

Update the frontend .env file if your backend runs on a different port or host.

## Deployment

For production deployment:

1. Set up a production-grade Redis instance.
2. Use a process manager like PM2 to run the Node.js backend.
3. Build the React frontend (npm run build in the frontend directory) and serve it with a web server like Nginx.
4. Set up HTTPS for secure connections.
5. Configure environment variables on your production server.

## Troubleshooting

1. If tweets are not being captured, check your Twitter API credentials and the console for error messages.
2. For AutoGen-related issues, ensure the Python environment is correctly set up and the OPENAI_API_KEY is valid.
3. If the frontend is not connecting to the backend, verify the REACT_APP_API_URL in the frontend .env file.
4. For Redis connection issues, confirm Redis is running and the REDIS_URL is correct.