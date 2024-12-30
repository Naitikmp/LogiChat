"use client";

import { useChat } from "@/lib/hooks/useChat";
import { ChatList } from "@/components/chat/chat-list";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";

export default function Home() {
  const { chats, currentChat, isLoading, createNewChat, sendMessage, setCurrentChat } = useChat();

  return (
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
  );
}