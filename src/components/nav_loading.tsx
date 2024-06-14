import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
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
import { Skeleton } from "./ui/skeleton";
const NavLoading = () => {
  return (
    <div className="h-[10vh] flex flex-col justify-between bg-gray-100 text-gray-900 shadow-md dark:bg-gray-800 dark:text-white">
      <NavigationMenu>
        <NavigationMenuList className="flex justify-around items-center w-screen px-6 py-4">
          <NavigationMenuItem className="text-xl font-semibold">
            <Skeleton className="h-9 w-9"/>
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
                
              </DropdownMenuContent>
            </DropdownMenu>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button
              
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <ModeToggle />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="h-1 bg-indigo-600 rounded-full dark:bg-indigo-300"></div>
    </div>
  );
};

export default NavLoading;
