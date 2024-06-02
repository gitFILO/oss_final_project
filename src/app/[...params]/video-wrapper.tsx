import ChatContent from "./chat-content";
import { createChat } from "./actions";

import { db } from "@/db";
import { chats as chatsTable } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import VideoView from "./video-view";
import fs from "fs";

import { messages as messagesTable } from "@/db/schema";
import { getCurrentUserTeamSpace } from "@/lib/auth";
import ShareSelector from "./components/shareSelector";
import DelebeButton from "./components/delebeButton";
import { FaRegCircleXmark } from "react-icons/fa6";
const lang = "ko"; // Optional, default is 'ko' (English)
let videoLink = "";
let outputPath = "";
let openVideoUrl = "";

export default async function VideoWrapper({
  chatId,
  spaceId,
  spaceType,
}: // getTimeLine
{
  chatId: string;
  spaceId: string;
  spaceType: "personal" | "team";
  // getTimeLine : number[][];
}) {
  //해당 채팅 아이디의 비디오 아이디를 가져옴
  const [chat] = await db
    .select()
    .from(chatsTable)
    .where(eq(chatsTable.id, chatId))
    .orderBy(desc(chatsTable.createdAt));

  if (chat === undefined) {
    return (
      <div className="w-full h-full flex flex-col justify-center align-middle items-center">
        <FaRegCircleXmark size={25}></FaRegCircleXmark>존재하지 않습니다
      </div>
    );
  }
  //해당 채팅 아이디의 메세지 내용 가져와서 타임라인만 가져와야함
  const [message] = await db
    .select()
    .from(messagesTable)
    .where(
      and(eq(messagesTable.chatId, chatId), eq(messagesTable.role, "system"))
    )
    .orderBy(desc(messagesTable.createdAt));

  const teamSpaces = await getCurrentUserTeamSpace();

  const timelineMatches = message?.content.match(/\d{1,2}:\d{2}/g);
  const getTimeLine = [...new Set(timelineMatches)];

  return (
    <>
      <VideoView videoId={chat?.videoId} getTimeLine={getTimeLine} />
      {spaceType === "personal" ? (
        <div className="flex flex-row p-2 gap-2 flex-wrap">
          <ShareSelector teamSpaces={teamSpaces} chatId={chatId} />
          <DelebeButton spaceId={spaceId} chatId={chatId} />
        </div>
      ) : (
        <div className="flex flex-row p-2 gap-2">
          <DelebeButton spaceId={spaceId} chatId={chatId} />
        </div>
      )}
    </>
  );
}
