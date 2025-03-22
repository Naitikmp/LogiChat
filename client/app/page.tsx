"use client";

import { useChat } from "@/lib/hooks/useChat";
import { ChatList } from "@/components/chat/chat-list";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";
import NexauraChatbot from '../components/chat/NexauraChatbot';

export default function Home() {
  const { chats, currentChat, isLoading, createNewChat, sendMessage, setCurrentChat } = useChat();

  return (
    <>
      <NexauraChatbot
        // apiEndpoint="https://your-api-endpoint.com/chat"
        // apiHeaders={{ 'Authorization': 'Bearer YOUR_API_KEY' }}
        botName="NexAura.AI assistant"
        welcomeMessage="Hello! How can I help you today?"
        // primaryColor="#4a6cf7"
        primaryColor="#000"
      />
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <div className="w-80 border-r flex flex-col">
          <ChatList
            chats={chats}
            currentChatId={currentChat?.id}
            onSelect={setCurrentChat}
            onNewChat={createNewChat}
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentChat ? (
            <>
              <MessageList messages={currentChat.messages} isLoading={isLoading} />
              <ChatInput onSend={sendMessage} isLoading={isLoading} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <p>Select a chat or start a new conversation</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}