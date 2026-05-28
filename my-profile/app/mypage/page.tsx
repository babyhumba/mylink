"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signInWithPopup, signOut } from "firebase/auth"
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore"

import { auth, googleProvider, db } from "@/lib/firebase"
import { useAuth } from "@/components/AuthProvider"
import { LinkList } from "@/components/LinkList"
import { LinkItem, AddLinkDialog } from "@/components/AddLinkDialog"
import { EditLinkDialog } from "@/components/EditLinkDialog"
import { ProfileEditDialog } from "@/components/ProfileEditDialog"
import { Button } from "@/components/ui/button"

export default function MyPage() {
  const [links, setLinks] = useState<LinkItem[]>([])
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null)
  const [profile, setProfile] = useState<{ displayName: string } | null>(null)
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!user) {
      setLinks([])
      return
    }

    const q = query(collection(db, "users", user.uid, "links"), orderBy("createdAt", "asc"))
    const unsubscribeLinks = onSnapshot(q, (snapshot) => {
      const fetchedLinks: LinkItem[] = []
      snapshot.forEach((doc) => {
        fetchedLinks.push({ id: doc.id, ...doc.data() } as LinkItem)
      })
      setLinks(fetchedLinks)
    })

    const unsubscribeProfile = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data() as { displayName: string })
      } else {
        setProfile({ displayName: "" })
      }
    })

    return () => {
      unsubscribeLinks()
      unsubscribeProfile()
    }
  }, [user])

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleEditSave = async (id: string, newTitle: string, newUrl: string) => {
    if (!user) return
    try {
      const linkRef = doc(db, "users", user.uid, "links", id)
      const now = new Date().getTime()
      await updateDoc(linkRef, {
        title: newTitle,
        url: newUrl,
        updatedAt: now
      })
      console.log(`[Edit] 링크 수정 성공 - ID: ${id}, updatedAt: ${new Date(now).toLocaleString()}`)
    } catch (error) {
      console.error("Error updating document:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user) return
    if (!window.confirm("정말 이 링크를 삭제하시겠습니까?")) return
    try {
      // 화면에서 즉시 사라지게 로컬 상태 먼저 업데이트 (선택적 최적화)
      setLinks((prev) => prev.filter(link => link.id !== id))
      
      // Firebase에서 실제 문서 영구 삭제 (Hard Delete)
      await deleteDoc(doc(db, "users", user.uid, "links", id))
      console.log(`[Delete] 링크 완전 삭제(Hard Delete) 성공 - ID: ${id}, deletedAt: ${new Date().toLocaleString()}`)
    } catch (error) {
      console.error("Error deleting document:", error)
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#00FFFF]">
        <p className="font-pixel text-2xl text-black animate-pulse bg-white border-4 border-black p-4 shadow-[4px_4px_0_0_#000]">
          로딩 중...
        </p>
      </main>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="flex min-h-screen flex-col items-center py-10 bg-[#00FFFF] relative overflow-hidden">
      {/* 8-bit 배경 패턴 */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)',
        backgroundSize: '32px 32px'
      }} />

      <div className="w-full max-w-2xl px-6 flex flex-col gap-8 z-10">
        
        {/* 상단 : 내 링크 관리 제목 및 유저 정보 */}
        <header className="flex flex-col sm:flex-row items-center justify-between bg-[#FFD700] border-4 border-black p-6 shadow-[8px_8px_0_0_#000] gap-4">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <h1 className="font-pixel text-4xl sm:text-5xl font-bold tracking-tight text-black" style={{ textShadow: '2px 2px 0px #FFF' }}>
                내 링크 관리
              </h1>
              {profile && (
                <ProfileEditDialog 
                  uid={user.uid} 
                  currentDisplayName={profile.displayName} 
                />
              )}
            </div>
            <p className="font-pixel text-black mt-3 text-lg sm:text-xl">
              반갑습니다, <span className="font-bold">{profile?.displayName || user.displayName || user.email}</span>님!
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="font-pixel border-4 border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all rounded-none bg-white text-black hover:bg-zinc-200 h-12 px-6">
            로그아웃
          </Button>
        </header>

        {/* 내 고유 공유 주소 안내 */}
        <div className="bg-white border-4 border-black p-4 flex flex-col sm:flex-row items-center justify-between shadow-[8px_8px_0_0_#000] gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <p className="font-pixel text-lg font-bold text-black">내 프로필 공유 주소</p>
            <a href={`/${profile?.displayName || user.uid}`} target="_blank" rel="noopener noreferrer" className="font-pixel text-sm sm:text-lg text-blue-600 hover:text-blue-800 hover:underline break-all px-2">
              {typeof window !== "undefined" ? window.location.origin : ""}/{profile?.displayName || user.uid}
            </a>
          </div>
          <Button variant="secondary" size="sm" onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/${profile?.displayName || user.uid}`)
            alert("주소가 복사되었습니다!")
          }} className="font-pixel border-4 border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all rounded-none bg-[#0000FF] text-white hover:bg-blue-700 h-10 px-4 w-full sm:w-auto">
            복사하기
          </Button>
        </div>

        {/* 중간 : 링크 추가 폼 (다이얼로그) */}
        <section className="flex justify-center my-2">
          <AddLinkDialog onAddLink={async (newLink) => {
            if (!user) return
            try {
              const now = new Date().getTime()
              const docRef = await addDoc(collection(db, "users", user.uid, "links"), {
                title: newLink.title,
                url: newLink.url,
                isVisible: newLink.isVisible,
                createdAt: now,
                updatedAt: now,
              })
              console.log(`[Add] 링크 추가 성공 - ID: ${docRef.id}, createdAt: ${new Date(now).toLocaleString()}`)
            } catch (error) {
              console.error("Error adding document: ", error)
            }
          }} />
        </section>

        {/* 하단 : 링크 목록 */}
        <section>
          <div className="inline-block bg-white border-4 border-black shadow-[4px_4px_0_0_#000] mb-4">
            <h2 className="font-pixel text-2xl font-bold px-4 py-2 text-black">
              등록된 링크
            </h2>
          </div>
          <div className="bg-[#FF00FF] p-6 border-8 border-black shadow-[12px_12px_0_0_#000] min-h-[300px]">
            <LinkList 
              links={links} 
              isAdmin={true} 
              onEdit={(link) => setEditingLink(link)} 
              onDelete={handleDelete} 
            />
          </div>
        </section>
        
        {/* 수정 다이얼로그 */}
        <EditLinkDialog 
          isOpen={!!editingLink} 
          onClose={() => setEditingLink(null)} 
          initialData={editingLink} 
          onSave={handleEditSave} 
        />
        
      </div>
    </main>
  )
}
