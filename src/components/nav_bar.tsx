"use client";
import React from "react";
import useSWR from "swr";
import axiosInstance from "@/lib/axiosInterceptor";
import Cookies from "js-cookie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import { ModeToggle } from "./toggle";
import NavLoading from "./nav_loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

const NavBar = () => {
  const { data: user, error: userError } = useSWR("/auth/profile", fetcher);
  const { data: users, error: usersError } = useSWR("/user", fetcher);

  async function handleClick(userId: number) {
    try {
      await axiosInstance.post("/chat", {
        userIds: [user.id, userId],
      });
      window.location.reload();
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  }

  async function logoutHandler() {
    try {
      Cookies.remove("token");
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  if (userError || usersError) {
    return <NavLoading />;
  }

  if (!user || !users) {
    return <NavLoading />;
  }

  return (
    <div className="h-[10vh] flex flex-col justify-between bg-gray-100 text-gray-900 shadow-md dark:bg-gray-800 dark:text-white">
      <NavigationMenu>
        <NavigationMenuList className="flex justify-around items-center w-screen px-6 py-4">
          <NavigationMenuItem className="text-xl font-semibold flex gap-2 items-center ">
            <Avatar>
              <AvatarImage src={user.avatar} alt="@shadcn" />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="capitalize">{user.name}</div>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                [+]
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white text-gray-900 dark:bg-gray-700 dark:text-white">
                <DropdownMenuLabel className="font-bold">
                  Message People
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {users.map((user: any) => (
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
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button
              onClick={logoutHandler}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <ModeToggle />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link target="_blank" rel="noopener noreferrer" href="https://ak-chat-portal.vercel.app">ChatRoom</Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="h-1 bg-indigo-600 rounded-full dark:bg-indigo-300"></div>
    </div>
  );
};

export default NavBar;
