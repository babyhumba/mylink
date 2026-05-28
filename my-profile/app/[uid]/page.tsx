"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { collection, onSnapshot, query, orderBy, getDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { LinkItem } from "@/components/AddLinkDialog"
import { LinkList } from "@/components/LinkList"

export default function UserProfile() {
  const params = useParams()
  const uid = params?.uid as string

  const [links, setLinks] = useState<LinkItem[]>([])
  const [profileUid, setProfileUid] = useState<string | null>(null)
  const [isNotFound, setIsNotFound] = useState(false)

  // 1. URL 파라미터(displayName 또는 uid)로 실제 uid 찾기
  useEffect(() => {
    if (!uid) return

    const resolveUid = async () => {
      try {
        // usernames 컬렉션에서 먼저 조회
        const nameDoc = await getDoc(doc(db, "usernames", uid))
        if (nameDoc.exists()) {
          setProfileUid(nameDoc.data().uid)
        } else {
          // 없으면 파라미터 자체가 uid일 수 있음 (초기 유저 폴백)
          const userDoc = await getDoc(doc(db, "users", uid))
          if (userDoc.exists()) {
            setProfileUid(uid)
          } else {
            setIsNotFound(true)
          }
        }
      } catch (err) {
        console.error("Error resolving uid:", err)
        setIsNotFound(true)
      }
    }

    resolveUid()
  }, [uid])

  // 2. 실제 uid를 찾은 후 링크 데이터 가져오기
  useEffect(() => {
    if (!profileUid) return

    const q = query(collection(db, "users", profileUid, "links"), orderBy("createdAt", "asc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLinks: LinkItem[] = []
      snapshot.forEach((doc) => {
        fetchedLinks.push({ id: doc.id, ...doc.data() } as LinkItem)
      })
      setLinks(fetchedLinks)
    })

    return () => unsubscribe()
  }, [profileUid])

  if (isNotFound) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-muted-foreground">존재하지 않는 프로필입니다.</p>
        </div>
      </main>
    )
  }

  if (!profileUid) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="animate-pulse text-muted-foreground">프로필을 불러오는 중...</p>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 sm:py-12">
      <div className="w-full max-w-[480px] min-h-[800px] bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden relative border-[8px] border-zinc-200 dark:border-zinc-800 flex flex-col">
        
        {/* Profile Header */}
        <div className="flex flex-col items-center mt-12 px-6">
          <div className="w-24 h-24 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden mb-4 border-4 border-white dark:border-zinc-700 shadow-lg">
            <img 
              src={`https://api.dicebear.com/9.x/notionists/svg?seed=${profileUid}`} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            @{uid ? uid.substring(0, 8) : "user"}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-center mt-2 text-sm">
            My Link Profile
          </p>
        </div>

        {/* Links Section */}
        <div className="flex-1 px-6 pb-24 overflow-y-auto mt-6 no-scrollbar">
          <LinkList links={links} />
        </div>

      </div>
    </main>
  )
}
