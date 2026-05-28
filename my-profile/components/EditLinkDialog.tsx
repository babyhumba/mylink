"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LinkItem } from "./AddLinkDialog"

interface EditLinkDialogProps {
  isOpen: boolean
  onClose: () => void
  initialData: LinkItem | null
  onSave: (id: string, newTitle: string, newUrl: string) => void
}

export function EditLinkDialog({ isOpen, onClose, initialData, onSave }: EditLinkDialogProps) {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setUrl(initialData.url)
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !url.trim() || !initialData) return

    onSave(initialData.id, title.trim(), url.trim())
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] font-pixel border-4 border-black shadow-[8px_8px_0_0_#000] bg-[#FFD700] rounded-none">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl text-black">링크 수정</DialogTitle>
            <DialogDescription className="text-black text-sm">
              링크의 이름과 목적지 URL을 수정합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title" className="text-black">표시될 버튼 이름</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 내 기술 블로그"
                autoComplete="off"
                className="border-4 border-black shadow-[2px_2px_0_0_#000] rounded-none font-pixel bg-white text-black h-12"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-url" className="text-black">이동할 목적지 URL</Label>
              <Input
                id="edit-url"
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
