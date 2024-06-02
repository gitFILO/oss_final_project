"use client";

import React from "react";
import ReactPlayer from "react-player";
import { Button } from "@/components/ui/button";
import { FaYoutube } from "react-icons/fa";
import { SelectChat, chats as chatsTable } from "@/db/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";


export default function VideoView2({
  workspaceId,
  spaceId,
}: {
  workspaceId: string;
  spaceId: string;
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error has occurred: {error.message}</div>;

  console.log("chats:", chats)
  console.log("chats.length:",chats)
  const showVideo = true

  function deleteCookie(name: string) {
    // 만료일을 과거로 설정하여 쿠키 삭제
    document.cookie =
      name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  const layoutResize = () => {
    // console.log('cookie=', cookies().get(`react-resizable-panels:layout`));
    const layoutCookie = document.cookie.match(
      "(^|;) ?" + "react-resizable-panels:layout" + "=([^;]*)(;|$)"
    );

    if (layoutCookie === null) {
      document.cookie = `react-resizable-panels:layout=${JSON.stringify([
        5, 47.5, 47.5,
      ])}; path=/`;
      return [5, 47.5, 47.5];
    }
    let layout = layoutCookie[2].slice(1, -1)?.split(",").map(Number);
    if (layout[2]) {
      document.cookie = `react-resizable-panels:layout=${JSON.stringify(
        layout
      )}; path=/`;
      return layoutCookie;
    }
    layout = [layout[0], layout[1] / 2, layout[1] / 2];
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(
      layout
    )}; path=/`;
    return;
  };

  if (!showVideo) {
    return <>Loading..</>;
  } else {
    return (
      <ScrollArea className="h-full w-full">
        <div className="videoPlayer2 m-3">
          <div className="oriVideo2 gap-5">
            {chats.length ? (
              chats.map((item: any, index: number) => (
                <div className="ori_video gap-2" key={index}>
                  <ReactPlayer
                    url={"https://www.youtube.com/watch?v=" + item.videoId}
                    controls
                    width="400px"
                    height="220px"
                    onError={(e: any) => console.log("onError", e)}
                    onStart={() => {}}
                    onReady={() => {}}
                  />
                  <div className="video_title">
                    <Link
                      href={`${workspaceId}/${spaceId}/${item.id}`}
                      dangerouslySetInnerHTML={{ __html: item.name }}
                      onClick={(e) => layoutResize()}
                    ></Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col p-6 gap-6 ">
                <h1 className="text-3xl font-bold">
                  워크스페이스에 영상이 없습니다
                </h1>
                <p>
                  요약하고 싶은 영상을 youtube에서 digest 아이콘을 눌러
                  추가해주세요!
                </p>
                <div className="flex flex-row items-center ">
                  <Button
                    variant={"secondary"}
                    className="flex flex-row items-center gap-2 p-0"
                    onClick={() => window.open("https://www.youtube.com/")}
                  >
                    <FaYoutube className="size-9 fill-red-700" />
                    YouTube창 열기
                  </Button>{" "}
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    );
  }
}
