import sys
import autogen

def analyze_tweet_and_generate_reply(tweet_content):
    config_list = [{'model': 'gpt-3.5-turbo', 'api_key': 'your-api-key'}]
    
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
        print(reply)  # To be captured by Node.js