'use client'

import { SelectChat, chats as chatsTable } from "@/db/schema";
import Link from "next/link";
import { FaImage } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { Key } from "react";


export default async function ChatList({
  spaceId,
  chatId,
  search,
}: {
  spaceId: string | null;
  chatId: string | null;
  search?: string;
}) {

  const getChats = async () => {
    
    const res = await fetch(`/api/chats/${spaceId}`)

    console.log("res:" , res)
    if (!res.ok) throw new Error('Failed to fetch chats');
    return res.json();
  };
  
  const { data: chats, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: getChats, 
    refetchInterval: 2000 // 2초마다 폴링
});
  console.log(chats)
  if(!chats){
    return <></>
  }
  return (
    <div className="h-full w-full overflow-x-hidden overflow-y-auto text-2xl">
      {" "}
      <div className="chatlistUp flex w-full h-full">
        <div className="chatlist w-full my-3">
          <div className="flex flex-col mx-1">
            <Link
              key=""
              className="inline-flex items-center whitespace-nowrap text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground  rounded-md px-3 justify-start leading-10"
              href={`/${spaceId}`}
              style={{
                backgroundColor: chatId === null ? "black" : "",
                color: chatId === null ? "white" : "",
              }}
            >
              <FaImage size={22} color={chatId === null ? "white" : "black"} />{" "}
              <div className="mx-2">Show Thumbnail</div>
            </Link>
            {/* <SearchForm search={search} /> */}
            {chats.map((chat: { id: Key | null | undefined; name: string; }) => (
              <Link
                key={chat.id}
                href={`/${spaceId}/${chat.id}?search=${
                  search ?? ""
                }`}
                className={`chatlistitem truncate inline-flex items-center whitespace-nowrap text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md px-3 justify-start leading-10`}
                style={{
                  backgroundColor: chatId === chat.id ? "black" : "",
                  color: chatId === chat.id ? "white" : "",
                }}
                dangerouslySetInnerHTML={{ __html: "&dot; " + chat.name }}
                scroll={false}
              ></Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChatListSkeleton() {
  return (
    <div className="flex flex-col p-10 gap-y-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-gray-300 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-gray-300 rounded col-span-2"></div>
                <div className="h-2 bg-gray-300 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
