"use client";

import { MessageCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Chat } from "@/lib/types";

interface ChatListProps {
  chats: Chat[];
  currentChatId?: string;
  onSelect: (chat: Chat) => void;
  onNewChat: () => void;
}

export function ChatList({ chats, currentChatId, onSelect, onNewChat }: ChatListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Button onClick={onNewChat} className="w-full">
          <MessageCircle className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`p-4 cursor-pointer hover:bg-muted ${
              chat.id === currentChatId ? "bg-muted" : ""
            }`}
            onClick={() => onSelect(chat)}
          >
            <h3 className="font-semibold mb-1">Chat {chat.id}</h3>
            {chat.lastMessage && (
              <p className="text-sm text-muted-foreground truncate">
                {chat.lastMessage}
              </p>
            )}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}