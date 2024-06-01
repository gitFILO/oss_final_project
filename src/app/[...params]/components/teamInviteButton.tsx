"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export async function sendContactEmail(sender: any) {
  // console.log("sender = ", sender);
  const response = await fetch("/api/invite", {
    method: "POST",
    body: JSON.stringify(sender),
    headers: {
      "Content-Type": "application/json",
    },
  });
  // console.log("response = ", response);

  const data = await response.json();
  // console.log("data = ", data);

  if (!response.ok) {
    throw new Error(data.message || "서버 요청에 실패함");
  }

  return data;
}

export const TeamInviteButton = React.forwardRef<
  HTMLButtonElement,
  React.HTMLProps<HTMLButtonElement>
>((_props) => {
  // console.log("inside Team!");
  const onSubmit = () => {
    const sender = {
      to: "x1xgudwls@naver.com",
      from: process.env.USER_EMAIL,
      html: "<p>안녕하세요. 내용입니다.</p>", // 잘 바꾸면 이쁨
      subject: "Digest 워크스페이스에 초대합니다.",
    };
    // console.log("sender:", sender);
    sendContactEmail(sender);
    toast("초대가 완료되었습니다!", {
      description: "상대방이 초대를 수락하면 팀으로 합류합니다.",
      action: {
        label: "OK",
        onClick: () => console.log("OK"),
      },
    });
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">팀 스페이스 초대</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>팀 스페이스 초대</DialogTitle>
            <DialogDescription>
              이메일을 입력하여 초대하세요! 메일로 초대장이 발송됩니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" placeholder="email" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={onSubmit}>초대하기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

TeamInviteButton.displayName = "Search";

