'use client'
import React, { useState, ChangeEvent } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useToast } from '@/components/ui/use-toast'
import Spinner from '../components/spinner'

type Props = {
  input: string
}

export function InputWithButton(props?: Props): JSX.Element {
  const [inputValue, setInputValue] = useState<string>(props?.input || '')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value)
  }

  const handleFetch = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/digest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl: inputValue }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let result = '';
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        result += decoder.decode(value, { stream: true });
      }
      toast({
        title: '성공적으로 요약되었습니다!',
        description: '개인 스페이스에서 확인해보세요',
        duration: 2000,
      });
      setLoading(false)
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: '요약에 실패했습니다!',
        variant: 'destructive',
        description: 'something went wrong',
        duration: 2000,
      });
      setLoading(false)
    }
  };
  

  return (
    <div
      className="flex w-full items-center space-x-2"
      style={{ maxWidth: '100rem' }}
    >
    {loading && <Spinner />}
      <motion.div
        className="flex w-full items-center space-x-2"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.125 }}
      >
        <Input
          placeholder="Youtube URL"
          value={inputValue}
          onChange={handleInputChange}
          className="group bg-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-100
        hover:scale-100 active:scale-110 transition cursor-pointer borderBlack dark:bg-white/10"
        />

        <Button
          asChild
          className="grou px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-105 hover:scale-105 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10"
          onClick={handleFetch}
        >
          {/* <Link href={`/restaurants?search=${encodeURIComponent(inputValue)}`}>
            digest
          </Link> */}
          <span>digest</span>
        </Button>
      </motion.div>
    </div>
  )
}
