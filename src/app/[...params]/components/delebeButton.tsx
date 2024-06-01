"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast as sonnerToast } from "sonner";

export default function DelebeButton({
  spaceId,
  chatId,
}: {
  spaceId: string;
  chatId: string;
}) {
  const deleteChat = async () => {
    const deleteChat = {
      chatId: chatId,
    };
    const response = await fetch("/api/deleteChat", {
      method: "DELETE",
      body: JSON.stringify(deleteChat),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "서버 요청에 실패함");
    }

    console.log("response:", response);

    sonnerToast("요약 삭제", {
      description: "요약이 삭제 되었습니다!",
    });

    setTimeout(() => {
      window.location.href = `/${spaceId}`;
    }, 800);

    return data;
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="gap-2  min-w-[117px]">
          <Trash2></Trash2>삭제하기
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>요약 삭제하기</AlertDialogTitle>
          <AlertDialogDescription>삭제하시겠습니까?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={deleteChat}>삭제하기</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
