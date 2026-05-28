"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { doc, getDoc, writeBatch, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
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

interface ProfileEditDialogProps {
  uid: string
  currentDisplayName: string
  onProfileUpdated?: () => void
}

export function ProfileEditDialog({ uid, currentDisplayName, onProfileUpdated }: ProfileEditDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [errorMsg, setErrorMsg] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // 다이얼로그 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setDisplayName(currentDisplayName)
      setIsAvailable(null)
      setErrorMsg("")
    }
  }, [isOpen, currentDisplayName])

  // 이름이 바뀌면 사용 가능 여부 초기화
  useEffect(() => {
    if (displayName !== currentDisplayName) {
      setIsAvailable(null)
    } else {
      setIsAvailable(true) // 내 원래 이름은 사용 가능
      setErrorMsg("")
    }
  }, [displayName, currentDisplayName])

  const checkDuplicate = async () => {
    const trimmed = displayName.trim()
    if (!trimmed) {
      setErrorMsg("닉네임을 입력해주세요.")
      return
    }
    // 영문, 숫자, 하이픈, 언더스코어만 허용 (URL 안전)
    const isValidFormat = /^[a-zA-Z0-9_-]+$/.test(trimmed)
    if (!isValidFormat) {
      setErrorMsg("영문, 숫자, 하이픈(-), 언더스코어(_)만 사용 가능합니다.")
      setIsAvailable(false)
      return
    }
    if (trimmed === currentDisplayName) {
      setIsAvailable(true)
      setErrorMsg("")
      return
    }

    setIsChecking(true)
    setErrorMsg("")
    try {
      const nameDoc = await getDoc(doc(db, "usernames", trimmed))
      if (nameDoc.exists()) {
        setIsAvailable(false)
        setErrorMsg("이미 사용 중인 닉네임입니다.")
      } else {
        setIsAvailable(true)
        setErrorMsg("사용 가능한 닉네임입니다!")
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("중복 확인 중 오류가 발생했습니다.")
    } finally {
      setIsChecking(false)
    }
  }

  const handleSave = async () => {
    if (!isAvailable) return
    setIsSaving(true)
    
    try {
      const trimmedName = displayName.trim()
      const batch = writeBatch(db)
      
      // 만약 이름이 바뀌었다면
      if (trimmedName !== currentDisplayName) {
        // 기존 닉네임 선점 해제 (기존 닉네임이 빈 값이 아니었다면)
        if (currentDisplayName) {
          batch.delete(doc(db, "usernames", currentDisplayName))
        }
        // 새 닉네임 선점 등록
        batch.set(doc(db, "usernames", trimmedName), { uid })
      }

      // 내 프로필 문서 업데이트 (기존에 문서가 없을 수 있으므로 setDoc merge 사용)
      batch.set(doc(db, "users", uid), {
        displayName: trimmedName,
        updatedAt: new Date().getTime()
      }, { merge: true })

      await batch.commit()
      
      setIsOpen(false)
      onProfileUpdated?.()
    } catch (err) {
      console.error(err)
      setErrorMsg("저장 중 오류가 발생했습니다.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">프로필 수정</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>프로필 수정</DialogTitle>
          <DialogDescription>
            공유 링크의 주소로 사용될 나만의 닉네임을 설정하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="display-name">공유 주소 아이디 (닉네임)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="예: developer_kr"
                className="flex-1"
                autoComplete="off"
              />
              <Button 
                type="button" 
                variant="secondary" 
                onClick={checkDuplicate}
                disabled={isChecking || displayName.trim() === currentDisplayName}
              >
                {isChecking ? "확인 중..." : "중복 확인"}
              </Button>
            </div>
            {errorMsg && (
              <p className={`text-sm mt-1 ${isAvailable ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                {errorMsg}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              영문, 숫자, 하이픈(-), 언더스코어(_)만 허용됩니다.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleSave} 
            disabled={!isAvailable || isSaving}
          >
            {isSaving ? "저장 중..." : "저장하기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
