import { createChat } from "@/app/[...params]/actions";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { currentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { getSubtitles, getVideoDetails } from "youtube-caption-extractor";
import { fetchTranscript } from "youtube-subtitle-transcript";
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";
import { initialProgrammerMessages } from "@/app/api/message/messages";
import fs from "fs";

export const POST = async (req: NextRequest, res: NextResponse) => {
  // console.log("Post 요청 들어옴");
  const origin = req.headers.get("origin");
  // 스패너 돌기 시작
  const user = await currentUser();

  // console.log("inside POST:", user);
  if (!user) {
    return NextResponse.json(
      { error: "not logged in" },
      {
        status: 401,
      }
    );
  }

  const data = await readRequestBody(req);

  let videoURL = data.videoUrl;

  const parsed_videoURL = videoURL.split("?v=");
  let video_id = parsed_videoURL[1];
  if (videoURL) {
    const { transcript, error } = await fetchTranscript(video_id, "ko");
    let parsed_script = transcript
      .map((entry) => [
        Math.floor(Number(entry.start) / 60).toFixed(0) +
          ":" +
          (Number(entry.start) % 60).toFixed(0).padStart(2, "0") +
          "-" +
          entry.text,
      ])
      .join("/");
    let lang = "ko";

    const videoDetails = await getVideoDetails({ videoID: video_id, lang });
    console.log("details:", videoDetails)
    const chat = await createChat({ videoDetails, video_id });
    
    const chatId = chat.id;

    if (chatId === undefined) {
      return new Response("error", {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": `${origin}`,
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Expose-Headers":
            "date, etag, access-control-allow-origin, access-control-allow-credentials, access-control-allow-headers",
        },
      });
    }

    const content = JSON.stringify(parsed_script);
    const body = JSON.stringify({ content, chatId });
    // console.log("body:", body);
    // 2. transcript ai에 넣고 결과 얻기

    const allDBMessages = await db
      .select({
        role: messages.role,
        content: messages.content,
      })
      .from(messages)
      .where(eq(messages.chatId, chatId))
      .orderBy(messages.createdAt);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        ...initialProgrammerMessages,
        ...allDBMessages,
        { role: "user", content },
      ],
      model: "gpt-3.5-turbo-1106",
      stream: true,
      max_tokens: 4096,
    });

    const stream = OpenAIStream(chatCompletion, {
      onStart: async () => {},
      onToken: async (token: string) => {},
      onCompletion: async (completion: string) => {
        try {
          await db.insert(messages).values([
            {
              chatId,
              role: "user",
              content,
            },
            {
              chatId,
              role: "system",
              content: completion,
            },
          ]);
        } catch (e) {
          console.error(e);
        }
        console.log("messages 들어감");
      },
    });

    console.log("stream:", stream)
    return new StreamingTextResponse(stream, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${origin}`,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Expose-Headers":
          "date, etag, access-control-allow-origin, access-control-allow-credentials, access-control-allow-headers",
      },
    });
  } else {
    // 유튜브 동영상 말고 그냥 데이터 인 경우
    let url = data.url;
    let contents = data.contents;
    // console.log(url, contents);
  }
  return new Response("OK", {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": `${origin}`,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Expose-Headers":
        "date, etag, access-control-allow-origin, access-control-allow-credentials, access-control-allow-headers",
    },
  });
};

async function readRequestBody(req: Request) {
  const chunks = [];
  for await (const chunk of req.body as any) {
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString());
}

// preflight - OPTIONS
export const OPTIONS = async (req: NextRequest, res: NextResponse) => {
  const origin = req.headers.get("origin");
  return new Response("OK", {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": `${origin}`,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Expose-Headers":
        "date, etag, access-control-allow-origin, access-control-allow-credentials, access-control-allow-headers",
    },
  });
};
