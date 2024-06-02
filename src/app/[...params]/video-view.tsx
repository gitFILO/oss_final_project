"use client";

import { useEffect } from "react";
import React from "react";
import { useState, useRef } from "react";
import ReactPlayer from "react-player";

// export default function VideoView({ openVideoUrl }: VideoViewProps) {
export default function VideoView({
  videoId,
  getTimeLine,
}: {
  videoId: string | null;
  getTimeLine: string[];
}) {
  const [showVideo, setShowVideo] = useState(false); 

  const playerRefs: (React.LegacyRef<ReactPlayer> | undefined)[] = [];
  const timeLineArr: (React.LegacyRef<ReactPlayer> | undefined)[] = [];

  const playerRef = useRef<ReactPlayer | null>(null); //하나만할때

  for (let i = 0; i < getTimeLine.length - 1; i++) {
    // playerRefs.push(useRef(null)); // 여러개 할땐 필요
    timeLineArr.push(getTimeLine[i]);
  }

  // console.log('timeLineArr=', timeLineArr);
  const [startTime, setST] = useState(0);
  useEffect(() => {
    if (document) {
      //document 가 생성되고 난후에 reactplayer 할당
      setShowVideo(true);
    }
  }, [videoId, getTimeLine]);

  const timeLineBtn = (timeInSeconds: any) => {
    if (playerRef.current) {
      const [minutes, seconds] = timeInSeconds.split(":").map(Number);
      const getSeconds = minutes * 60 + seconds; //분 단위로 변경
      setST(getSeconds);
      // console.log('getSeconds = ', getSeconds);
      playerRef.current.seekTo(getSeconds);
      playerRef.current.getInternalPlayer()?.playVideo();
    }
  };

  if (!showVideo) {
    return <></>;
  } else {
    return (
      <div
        className="w-full flex flex-col gap-5 overflow-y-auto overflow-x-hidden"
        style={{ border: "10px solid rgba(0,0,0,0)", boxSizing: "border-box" }}
      >
        <div style={{ position: "relative", paddingTop: "56.25%" }}>
          <ReactPlayer
            // url='/downloads/8VZvs6O5tZY.mp4'
            ref={playerRef}
            url={"https://www.youtube.com/watch?v=" + videoId}
            controls
            width="100%"
            height="100%"
            // style={{ maxWidth: '100%', height: 'auto' }}
            onError={(e: any) => console.log("onError", e)}
            onStart={() => {}}
            onReady={() => {}}
            style={{ position: "absolute", top: 0, left: 0 }}
            config={{
              youtube: {
                playerVars: {
                  controls: 1,
                  modestbranding: 1,
                  width: "100%",
                  height: "100%",
                },
              },
            }}
          />
        </div>
        <div className="timeLine gap-4 px-5">
          {
            typeof timeLineArr === "number" || timeLineArr.length === 0 ? (
              <div> 타임라인이 없습니다. </div>
            ) : (
              timeLineArr.map((time: any, index: number) => (
                <div key={index}>
                  <button
                    className="showTimeLine"
                    onClick={() => timeLineBtn(timeLineArr[index])}
                  >
                    {timeLineArr[index]?.toString()}
                  </button>
                </div>
              ))
            )
          }
        </div>
      </div>
    );
  }
}
