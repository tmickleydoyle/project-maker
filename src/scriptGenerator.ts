import OpenAI from 'openai';
import { ChatSession } from './chatSession';
import { logger } from './logger';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.API_KEY) {
    throw new Error('API_KEY environment variable is not set');
}

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.API_KEY
});

export async function generateResponse(chatSession: ChatSession): Promise<string> {
  let messages = chatSession.conversationHistory.map(msg => ({
    role: msg.role,
    content: msg.content,
  }));

  // Calculate token count
  const tokenLimit = 8000 - 1000; // Reserve some tokens for the response
  while (true) {
    const encoder = new TextEncoder();
    let totalTokens = 0;
    for (const msg of messages) {
      const contentBytes = encoder.encode(msg.content);
      totalTokens += contentBytes.length / 4; // Approximation; actual tokenization may differ
      if (totalTokens > tokenLimit) break;
    }
    if (totalTokens <= tokenLimit) break;
    if (messages.length === 0) break;
    messages.shift();
  }

  const response = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: messages,
  });
  return response.choices[0].message.content || '';
}