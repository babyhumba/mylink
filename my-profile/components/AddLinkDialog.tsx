"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

export interface LinkItem {
  id: string
  title: string
  url: string
  isVisible: boolean
}

interface AddLinkDialogProps {
  onAddLink: (link: LinkItem) => void
}

export function AddLinkDialog({ onAddLink }: AddLinkDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !url.trim()) return

    const newLink: LinkItem = {
      id: Math.random().toString(36).substring(7),
      title: title.trim(),
      url: url.trim(),
      isVisible: true,
    }

    onAddLink(newLink)
    setTitle("")
    setUrl("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full flex items-center justify-center gap-2 font-pixel text-xl py-6 bg-[#00FF00] text-black border-4 border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all rounded-none">
          <Plus className="w-6 h-6 border-2 border-black rounded-none" />
          새로운 링크 추가
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] font-pixel border-4 border-black shadow-[8px_8px_0_0_#000] bg-[#FFD700] rounded-none">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl text-black">링크 추가</DialogTitle>
            <DialogDescription className="text-black text-sm">
              새로운 링크의 이름과 연결될 URL을 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-black">표시될 버튼 이름</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 내 기술 블로그"
                autoComplete="off"
                className="border-4 border-black shadow-[2px_2px_0_0_#000] rounded-none font-pixel bg-white text-black h-12"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url" className="text-black">이동할 목적지 URL</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                autoComplete="off"
                className="border-4 border-black shadow-[2px_2px_0_0_#000] rounded-none font-pixel bg-white text-black h-12"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="font-pixel text-lg border-4 border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all rounded-none bg-[#0000FF] text-white">
              저장하기
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
