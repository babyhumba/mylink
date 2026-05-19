"use client"

import { useState } from "react"

import { LinkList } from "@/components/LinkList"
import { LinkItem, AddLinkDialog } from "@/components/AddLinkDialog"

export default function MyPage() {
  const [links, setLinks] = useState<LinkItem[]>([])

  return (
    <main className="flex min-h-screen flex-col items-center py-10 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-2xl px-6 flex flex-col gap-8">
        
        {/* 상단 : 내 링크 관리 제목 */}
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            내 링크 관리
          </h1>
          <p className="text-muted-foreground mt-2">
            프로필 페이지에 노출할 링크들을 직접 관리해보세요.
          </p>
        </header>

        {/* 중간 : 링크 추가 폼 (다이얼로그) */}
        <section className="flex justify-center my-2">
          <AddLinkDialog onAddLink={(newLink) => setLinks((prev) => [...prev, newLink])} />
        </section>

        {/* 하단 : 링크 목록 */}
        <section>
          <h2 className="text-xl font-bold mb-4 px-1">등록된 링크</h2>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-border min-h-[300px]">
            <LinkList links={links} />
          </div>
        </section>
        
      </div>
    </main>
  )
}
