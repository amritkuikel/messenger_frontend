"use client";

import axiosInstance from "@/lib/axiosInterceptor";
import { Chat, User } from "@/lib/types";
import React, { useRef, useEffect } from "react";
import useSWR from "swr";
import ChatInput from "./chatInput";
import { Label } from "./ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface MainProps {
  id: string;
}

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

const Main: React.FC<MainProps> = ({ id }) => {
  const { data: user, error: userError } = useSWR<User>(
    "/auth/profile",
    fetcher
  );
  const { data: users, error: usersError } = useSWR("/user", fetcher);
  const {
    data: chat,
    error: chatError,
    mutate: mutateChat,
  } = useSWR<Chat>(`/chat/${id}`, fetcher, {
    refreshInterval: 1,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  async function handleClick(userId: number) {
    try {
      const existingUserIds = chat?.users.map((u) => u.id) || [];
      await axiosInstance.put(`/chat/${id}`, {
        isGroup: true,
        userIds: [...existingUserIds, userId],
      });
      mutateChat(); // Refresh chat data
    } catch (error) {
      console.error("Error adding user to chat:", error);
    }
  }

  useEffect(() => {
    if (chat) {
      scrollToBottom();
    }
  }, [chat]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const sendMessage = async (message: string) => {
    if (message.trim() && user?.id) {
      const messagePayload = {
        chatId: Number(id),
        senderId: user.id,
        message,
      };
      try {
        await axiosInstance.post("/message", messagePayload);

        if (chat) {
          mutateChat(
            {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  id: Date.now(),
                  senderId: user.id,
                  message,
                  timestamp: new Date().toISOString(),
                },
              ],
            },
            false
          );
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  if (userError || chatError) {
    return (
      <div className="flex items-center justify-center h-full pl-10">
        <div className="bg-red-100 text-red-800 p-4 rounded-md shadow-md max-w-sm mx-auto text-center">
          <svg
            className="w-6 h-6 inline-block mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18.364 5.636l-1.414-1.414L12 9.172 7.05 4.222l-1.414 1.414L9.172 12l-3.536 3.536 1.414 1.414L12 14.828l4.95 4.95 1.414-1.414L14.828 12l3.536-3.536z"
            ></path>
          </svg>
          {userError
            ? "Error fetching user profile"
            : "Error loading chat data"}
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex items-center justify-center h-full pl-10">
        <div className="bg-blue-100 text-blue-800 p-4 rounded-md shadow-md max-w-sm mx-auto text-center ml-[10vw]">
          <svg
            className="w-6 h-6 animate-spin inline-block mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582C6.698 5.5 10.389 3 14.5 3c4.643 0 8.5 3.358 8.5 7.5S19.143 18 14.5 18c-3.098 0-5.875-1.543-7.486-3.839L4 14v5H3v-9h5v1H4.41l1.091-1.636C7.977 10.555 11.008 13 14.5 13c3.86 0 7-2.686 7-6s-3.14-6-7-6C10.775 1 7.635 3.533 6.582 7H7v2H4V4h1z"
            ></path>
          </svg>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="w-[75vw] h-[90vh] p-4 md:p-6 flex flex-col justify-between bg-gray-100 dark:bg-gray-900 rounded-lg">
      <div className="overflow-y-auto flex-grow">
        <div className="sticky z-10 top-0 font-bold bg-gray-300 dark:bg-gray-700 p-2 rounded mb-2 flex gap-6 justify-center items-center">
          <Label className="font-bold capitalize">
            {chat.users.map((user) => user.name).join(", ")}
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              [+]
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-gray-900 dark:bg-gray-700 dark:text-white">
              <DropdownMenuLabel className="font-bold">
                Add People
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {users?.map((user: any) => (
                <DropdownMenuItem
                  key={user.id}
                  onClick={() => handleClick(user.id)}
                  className="hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {user.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          {chat.messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                user?.id === message.senderId ? "items-end" : ""
              }`}
            >
              <div
                className={`flex gap-2 items-center m-2 p-2 w-fit max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg rounded overflow-hidden ${
                  user?.id === message.senderId
                    ? "bg-blue-400 dark:bg-blue-600"
                    : "bg-gray-400 dark:bg-gray-600"
                }`}
                style={{ wordWrap: "break-word" }}
              >
                {user?.id === message.senderId ? (
                  ""
                ) : (
                  <Avatar>
                    <AvatarImage src={user?.avatar} alt="@shadcn" />
                    <AvatarFallback>{user?.name[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div>{message.message}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="mt-4">
        {user && (
          <ChatInput chatId={id} userId={user.id} sendMessage={sendMessage} />
        )}
      </div>
    </div>
  );
};

export default Main;
