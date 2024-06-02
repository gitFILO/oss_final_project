"use client";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast as sonnerToast } from "sonner";
import { InputWithButton } from "@/components/inputwithbutton";
import { motion } from "framer-motion";
import { FaYoutube } from "react-icons/fa";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen p-10 gap-4">
        <motion.div
          initial={{ y: -100, x: '-50%', opacity: 0 }}
          animate={{ y: 0, x: '-50%', opacity: 1 }}
          className="fixed top-0 left-1/2 h-[4.5rem] w-full rounded-none sm:top-60 sm:h-[20rem] sm:w-[45rem] sm:rounded-full"
        >
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Welcome to Digest</h1>
            <p>Digest에 오신 것을 환영합니다!</p>
            <p>요약하고 싶은 영상(20분 이내)을 youtube에서 찾아 URL을 입력해주세요!</p>
        
          <button
          className="flex-row items-center gap-2 p-0"
          onClick={() => window.open("https://www.youtube.com/")}
          >
          <FaYoutube className="size-9 fill-red-700" />
        </button>{" "}
        </div>
        </motion.div>
          <InputWithButton input={''} />
          
      </div>
    </>
  );
}
