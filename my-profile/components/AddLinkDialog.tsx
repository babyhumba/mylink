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
        <Button className="w-full flex items-center gap-2 rounded-full py-6 text-md bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-xl transition-all">
          <Plus className="w-5 h-5" />
          새로운 링크 추가
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>링크 추가</DialogTitle>
            <DialogDescription>
              새로운 링크의 이름과 연결될 URL을 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">표시될 버튼 이름</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 내 기술 블로그"
                autoComplete="off"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">이동할 목적지 URL</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                autoComplete="off"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">저장하기</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
