import sys
import json
import autogen
import os

# Configure your OpenAI API key here
openai_api_key = os.environ.get("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError("Please set the OPENAI_API_KEY environment variable.")

config_list = [
    {
        "model": "gpt-4",
        "api_key": openai_api_key
    }
]

# Agent 1: Tweet Catcher
tweet_catcher = autogen.AssistantAgent(
    name="TweetCatcher",
    llm_config={"config_list": config_list},
    system_message="You are responsible for monitoring incoming tweets and identifying those that mention the company's name. Analyze the content and sentiment of these tweets."
)

# Agent 2: Content Screener
content_screener = autogen.AssistantAgent(
    name="ContentScreener",
    llm_config={"config_list": config_list},
    system_message="Your role is to review tweets flagged by the TweetCatcher. Assess if the content is appropriate for a response. Consider factors such as sentiment, potential controversy, and relevance to the company."
)

# Agent 3: Response Generator
response_generator = autogen.AssistantAgent(
    name="ResponseGenerator",
    llm_config={"config_list": config_list},
    system_message="Based on the approved tweets, generate witty and relevant reply suggestions. Ensure the responses align with the company's brand voice and are engaging for the audience."
)

# Human Proxy for final approval (simulated in this script)
human_proxy = autogen.UserProxyAgent(
    name="HumanApprover",
    human_input_mode="ALWAYS",  # Always ask for human input
    max_consecutive_auto_reply=0,  # Disable auto-replies
    is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("APPROVE"),
    system_message="You are a human approver. Review the suggested response and type 'APPROVE' if it's good to go, or provide feedback for improvements."
)

def process_tweet(tweet_content):
    # Initiate the workflow
    tweet_catcher.initiate_chat(
        human_proxy,
        message=f"Analyze this tweet: {tweet_content}"
    )
    
    analysis = human_proxy.last_message()["content"]
    
    # Check if the tweet is relevant
    content_screener.initiate_chat(
        human_proxy,
        message=f"Is this tweet appropriate to respond to: {tweet_content}\nAnalysis: {analysis}"
    )
    
    screening = human_proxy.last_message()["content"]
    
    # If appropriate, generate a response
    if "appropriate" in screening.lower():
        response_generator.initiate_chat(
            human_proxy,
            message=f"Generate a witty response to this tweet: {tweet_content}\nAnalysis: {analysis}\nScreening: {screening}"
        )
        
        suggested_reply = human_proxy.last_message()["content"]
        
        return json.dumps({
            "original_tweet": tweet_content,
            "analysis": analysis,
            "screening": screening,
            "suggested_reply": suggested_reply
        })
    
    return json.dumps({
        "original_tweet": tweet_content,
        "analysis": analysis,
        "screening": screening,
        "suggested_reply": None
    })

if __name__ == "__main__":
    tweet_content = sys.argv[1]
    result = process_tweet(tweet_content)
    print(result)  # This will be captured by our TypeScript server