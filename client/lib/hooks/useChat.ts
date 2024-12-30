"use client";

import { useState } from 'react';
import { Message, Chat, ChatHistoryTuple } from '../types';
import { sendMessageToAPI } from '../api/chat';

export function useChat() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [
        {
          id: 'system-0',
          content: 'You are an AI assistant.',
          role: 'system',
          timestamp: new Date().toISOString(),
        }
      ],
      timestamp: new Date().toISOString(),
    };
    setChats([newChat, ...chats]);
    setCurrentChat(newChat);
  };

  const formatChatHistory = (messages: Message[]): ChatHistoryTuple[] => {
    return messages.map(msg => [msg.role, msg.content]);
  };

  const sendMessage = async (content: string) => {
    if (!currentChat) return;

    setIsLoading(true);
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    // Add user message
    const updatedMessages = [...currentChat.messages, userMessage];
    const updatedChat = { ...currentChat, messages: updatedMessages };
    setCurrentChat(updatedChat);
    setChats(chats.map(chat => chat.id === currentChat.id ? updatedChat : chat));

    try {
      const chatHistory = formatChatHistory(currentChat.messages);
      const response = await sendMessageToAPI(content, chatHistory);

      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      const finalChat = { 
        ...updatedChat, 
        messages: finalMessages,
        lastMessage: assistantMessage.content
      };
      
      setCurrentChat(finalChat);
      setChats(chats.map(chat => chat.id === currentChat.id ? finalChat : chat));
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    chats,
    currentChat,
    isLoading,
    createNewChat,
    sendMessage,
    setCurrentChat,
  };
}