"use client"

import { useState, useEffect } from "react"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { LinkItem } from "@/components/AddLinkDialog"
import { LinkList } from "@/components/LinkList"

export default function Home() {
  const [links, setLinks] = useState<LinkItem[]>([])

  useEffect(() => {
    const q = query(collection(db, "user", "anonymous", "links"), orderBy("createdAt", "asc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLinks: LinkItem[] = []
      snapshot.forEach((doc) => {
        fetchedLinks.push({ id: doc.id, ...doc.data() } as LinkItem)
      })
      setLinks(fetchedLinks)
    })

    return () => unsubscribe()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 sm:py-12">
      <div className="w-full max-w-[480px] min-h-[800px] bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden relative border-[8px] border-zinc-200 dark:border-zinc-800 flex flex-col">
        
        {/* Profile Header */}
        <div className="flex flex-col items-center mt-12 px-6">
          <div className="w-24 h-24 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden mb-4 border-4 border-white dark:border-zinc-700 shadow-lg">
            <img 
              src="https://api.dicebear.com/9.x/notionists/svg?seed=Felix" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">@developer</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-center mt-2 text-sm">
            Frontend Engineer | Open Source Contributor
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
