import { Agent, UserProxyAgent, AssistantAgent } from 'pyautogen';

const analyzerAgent = new AssistantAgent('analyzer', {
  llm_config: {
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
  },
});

const replyGeneratorAgent = new AssistantAgent('replyGenerator', {
  llm_config: {
    model: 'gpt-3.5-turbo',
    temperature: 0.9,
  },
});

const userProxyAgent = new UserProxyAgent('user');

export async function analyzeTweetAndGenerateReply(tweetContent: string) {
  const result = await userProxyAgent.initiateChatWithAgent(
    analyzerAgent,
    `Analyze this tweet: "${tweetContent}"`
  );

  const analysis = result.messages[result.messages.length - 1].content;

  const replyResult = await userProxyAgent.initiateChatWithAgent(
    replyGeneratorAgent,
    `Based on this analysis: "${analysis}", generate a witty and relevant reply.`
  );

  return replyResult.messages[replyResult.messages.length - 1].content;
}