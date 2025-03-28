import { ChatHistoryTuple } from "../types";

// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = 'https://logichat-production.up.railway.app/api';

export async function sendMessageToAPI(message: string, chatHistory: ChatHistoryTuple[]) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: message,
        chat_history: chatHistory 
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.answer;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}