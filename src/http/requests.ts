import { post } from './api';

const AI_AGENT_URL = process.env.EXPO_PUBLIC_AI_AGENT_URL;

export const startAI = async (channelId: string) =>
  post(`${AI_AGENT_URL}/start-ai-agent`, { channel_id: channelId });

export const stopAI = async (channelId: string) =>
  post(`${AI_AGENT_URL}/stop-ai-agent`, { channel_id: channelId });
