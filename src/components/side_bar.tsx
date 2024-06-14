"use client";
import React, { useState } from "react";
import useSWR from "swr";
import axiosInstance from "@/lib/axiosInterceptor";
import { Chat } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import SideLoading from "./side_loading";

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

const SideBar = () => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const router = useRouter();

  const { data: user, error: userError } = useSWR("/auth/profile", fetcher);

  const { data: chatData, error: chatError } = useSWR(
    user ? `/chat/user/${user.id}` : null,
    fetcher,
    { refreshInterval: 1 }
  );

  if (userError || chatError) {
    return <SideLoading />;
  }

  if (!user || !chatData) {
    return <SideLoading />;
  }

  const handleChatClick = (chatId: number) => {
    setSelectedChatId(chatId);
    router.push(`/chat/${chatId}`);
  };

  return (
    <div className="flex w-[25vw] h-[90vh] justify-end bg-gray-100 dark:bg-gray-900">
      <div className="text-center capitalize font-bold py-6 flex flex-col gap-4 px-2 w-full overflow-y-scroll">
        {chatData.chats.map((chat: Chat) => {
          // Get the names of the users in the chat, excluding the current user
          const chatUserNames = chat.users
            .filter((chatUser) => chatUser.id !== user.id)
            .map((chatUser) => chatUser.name)
            .join(", ");

          return (
            <div
              key={chat.id}
              onClick={() => handleChatClick(chat.id)}
              className="w-full"
            >
              <Button
                className={`w-full p-5 rounded overflow-hidden ${
                  selectedChatId === chat.id
                    ? "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-700 dark:text-gray-100 dark:hover:bg-blue-800"
                    : "bg-blue-300 text-white hover:bg-blue-400 dark:bg-blue-500 dark:text-gray-100 dark:hover:bg-blue-600"
                }`}
              >
                {chatUserNames}
              </Button>
            </div>
          );
        })}
      </div>
      <div className="w-1 bg-blue-300 dark:bg-blue-600"></div>
    </div>
  );
};

export default SideBar;
