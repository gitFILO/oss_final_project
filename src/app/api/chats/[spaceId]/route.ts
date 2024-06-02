import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from "@/db";
import { chats as chatsTable, userInWorkspace } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  
  if (!req.url){
    return 400
  }
  const spaceId = req.url.split('/').pop();
  
  if(!spaceId){
    return 400
  }
  const chats = await db
      .select({
        id: chatsTable.id,
        name: chatsTable.name,
        videoId: chatsTable.videoId,
      })
      .from(chatsTable)
      .where(eq(chatsTable.workspaceId, spaceId))
      .orderBy(desc(chatsTable.createdAt));

  return NextResponse.json(chats)
}