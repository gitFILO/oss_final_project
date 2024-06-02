"use server";

import { db } from "@/db";
import { chats, users as userTable } from "@/db/schema";
import { currentUser, getCurrentUserPersonalSpace } from "@/lib/auth";
import { revalidateTag } from "next/cache";
import { error } from "console";
import { VideoDetails } from "youtube-caption-extractor";

export async function createChat({
  videoDetails,
  video_id,
}: {
  videoDetails?: VideoDetails | undefined;
  video_id?: string | undefined;
}) {
  const user = await currentUser();

  const currentUserPersonalSpace = await getCurrentUserPersonalSpace();
  if (!user) {
    // console.log("unauthorized");
    throw error("Unauthorized");
  }

  const [result] = await db
    .insert(chats)
    .values({
      name: videoDetails?.title ?? "",
      workspaceId: currentUserPersonalSpace ?? "",
      videoId: video_id ?? "",
    })
    .returning();

  revalidateTag("get-chats-for-chat-list");

  return result;
}

export type CreateChat = typeof createChat;
