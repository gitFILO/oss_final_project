"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FaList } from "react-icons/fa";
import React from "react";

// layout 값을 반환하는 함수 정의
export const getDefaultLayout = () => {
  if (typeof document !== "undefined") {
    const layoutCookie = document.cookie.match(
      "(^|;) ?" + "react-resizable-panels:layout" + "=([^;]*)(;|$)"
    );
    if (layoutCookie === null) {
      return [5, 47.5, 47.5];
    }
    const layout = layoutCookie[2].slice(1, -1)?.split(",").map(Number);
    return layout;
  }
  return [5, 47.5, 47.5]; // 서버 사이드 렌더링일 경우 기본값 반환
};

export function ClientComponent({
  chatId,
  children,
  chatToggle,
}: {
  chatId: string | undefined;
  children: ReactNode[];
  chatToggle: boolean | undefined;
}) {
  const [getSize, setSize] = useState<number[]>([5, 47.5, 47.5]);
  const [getToggle, setToggle] = useState(false);
  const [checkLoad, setLoad] = useState(false);
  const path = "/";

  const onLayout = (sizes: number[]) => {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(
      sizes
    )}; path=${path}`;
    if (sizes[0] <= 5) {
      document.cookie = `react-chatlist-toggle:show=${JSON.stringify(
        false
      )}; path=${path}`;
      setToggle(false);
    } else {
      document.cookie = `react-chatlist-toggle:show=${JSON.stringify(
        true
      )}; path=${path}`;
      setToggle(true);
    }
    setSize(sizes);
  };

  useEffect(() => {
    const layout = getDefaultLayout();
    setSize(layout);
    setLoad(true);
  }, []);

  const changeLayout = () => {
    const size = getSize;
    setSize([20, size[1] - 15, size[2] ? size[2] : 0]);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div
        className="main w-full h-full flex flex-row"
        suppressContentEditableWarning={true}
      >
        <ResizablePanelGroup direction="horizontal" onLayout={onLayout}>
          <ResizablePanel
            defaultSize={getSize[0]}
            minSize={5}
            maxSize={35}
          >
            {checkLoad &&
              (getSize[0] <= 5 ? (
                <div className="listItem flex justify-center my-4">
                  <FaList size={20} onClick={changeLayout} />
                </div>
              ) : (
                <div className="listItem h-full">{children && children[0]}</div>
              ))}
          </ResizablePanel>
          <ResizableHandle withHandle />

          {children[2] ? (
            <>
              {" "}
              <ResizablePanel
                defaultSize={getSize[1]}
                minSize={30}
                maxSize={70}
              >
                {children && children[1]}
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel
                defaultSize={getSize[2]}
                minSize={30}
                maxSize={70}
              >
                {children && children[2]}
              </ResizablePanel>
            </>
          ) : (
            <>
              {" "}
              <ResizablePanel defaultSize={100 - getSize[0]} minSize={10}>
                {children && children[1]}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
