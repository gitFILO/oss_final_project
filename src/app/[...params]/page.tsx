
import ChatList from "./chat-list";
import { Suspense} from "react";
import ChatContentWrapper from "./chat-content-wrapper";
import VideoWrapper from "./video-wrapper";
//db
import { db } from "@/db";
import { chats as chatsTable, userInWorkspace } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import {
  currentUser,
  getSpace,
} from "@/lib/auth";

import VideoView2 from "./components/view2";
import { cookies } from "next/headers";
import { ClientComponent } from "./resizable_page";
import AccessDenied from "./components/access-denied";
import { cn } from "@/lib/utils";

export interface TeamSpace {
  id: string | null;
  name: string | null;
  description: string | null;
  isHost: boolean;
}
export default async function Page({
  params,
  searchParams,
}: {
  params: { params: string };
  searchParams: { search?: string };
}) {
  const search = searchParams.search;
  const spaceId = params.params[0];
  const chatId = params.params[1] ?? null;
  const currentSpace = await getSpace(spaceId);
  const user = await currentUser();
  if (user === null) {
    
    return;
  }

  const [isUserDeserveForWorkspace] = await db
    .select()
    .from(userInWorkspace)
    .where(
      and(
        eq(userInWorkspace.userId, user.id),
        eq(userInWorkspace.workspaceId, spaceId),
        eq(userInWorkspace.accept, true)
      )
    );

  if (isUserDeserveForWorkspace === undefined) {
    return <AccessDenied />;
  }
  const toggleList = cookies().get("react-chatlist-toggle:show");

  // console.log("cookies =", cookies());
  let chatToggle;
  // console.log("chatToggle =", chatToggle);

  if (toggleList) {
    chatToggle = JSON.parse(toggleList.value);
  } else {
    chatToggle = "false";
  }

  return (
    <ClientComponent chatId={chatId} chatToggle={chatToggle}>
      {/* first children */}
      <Suspense fallback={<div>Loading...</div>}>
          <ChatList
            spaceId={spaceId}
            chatId={chatId}
            search={search}
          />
      </Suspense>

      {/* second children */}
      {chatId ? (
        <Suspense>
          <div
            className={cn(
              "h-full",
              currentSpace.type === "team" && ""
            )}
          >
            <ChatContentWrapper chatId={chatId} />
          </div>
        </Suspense>
      ) : (
        <div
          className={cn(
            "w-full h-full flex flex-col justify-center align-middle items-center",
            currentSpace.type === "team" && ""
          )}
        >
        <Suspense fallback={<div>Loading...</div>}>
            <VideoView2
              workspaceId={""}
              spaceId={spaceId}
            />
        </Suspense>
        </div>
      )}
      {/* third children */}
      {chatId && (
        <div
          className={cn(
            "w-full h-full flex flex-col",
            currentSpace.type === "team" && "bg-stone-200 bg-opacity-60"
          )}
        >
          <VideoWrapper
            chatId={chatId}
            spaceId={spaceId}
            spaceType={currentSpace.type}
          ></VideoWrapper>
        </div>
      )}
    </ClientComponent>
  );
}
