"use client"

import { useState, useEffect } from "react"
import { signInWithPopup, signOut } from "firebase/auth"
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore"

import { auth, googleProvider, db } from "@/lib/firebase"
import { useAuth } from "@/components/AuthProvider"
import { LinkList } from "@/components/LinkList"
import { LinkItem, AddLinkDialog } from "@/components/AddLinkDialog"
import { Button } from "@/components/ui/button"

export default function MyPage() {
  const [links, setLinks] = useState<LinkItem[]>([])
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!user) {
      setLinks([])
      return
    }

    const q = query(collection(db, "user", "anonymous", "links"), orderBy("createdAt", "asc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLinks: LinkItem[] = []
      snapshot.forEach((doc) => {
        fetchedLinks.push({ id: doc.id, ...doc.data() } as LinkItem)
      })
      setLinks(fetchedLinks)
    })

    return () => unsubscribe()
  }, [user])

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-muted-foreground animate-pulse">인증 정보를 불러오는 중입니다...</p>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center py-10 bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-6 max-w-sm text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
              <path d="M9 18c-4.51 2-5-2-7-2"/>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">관리자 로그인</h1>
            <p className="text-muted-foreground text-sm">프로필 페이지에 노출할 링크를 관리하려면 Google 계정으로 로그인해 주세요.</p>
          </div>
          <Button onClick={handleLogin} className="w-full h-12 text-base shadow-md">
            Google 계정으로 로그인
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center py-10 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-2xl px-6 flex flex-col gap-8">
        
        {/* 상단 : 내 링크 관리 제목 및 유저 정보 */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              내 링크 관리
            </h1>
            <p className="text-muted-foreground mt-2">
              반갑습니다, <span className="font-semibold text-foreground">{user.displayName || user.email}</span>님!
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="shadow-sm">로그아웃</Button>
        </header>

        {/* 중간 : 링크 추가 폼 (다이얼로그) */}
        <section className="flex justify-center my-2">
          <AddLinkDialog onAddLink={async (newLink) => {
            try {
              await addDoc(collection(db, "user", "anonymous", "links"), {
                title: newLink.title,
                url: newLink.url,
                isVisible: newLink.isVisible,
                createdAt: new Date().getTime(),
              })
            } catch (error) {
              console.error("Error adding document: ", error)
            }
          }} />
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
