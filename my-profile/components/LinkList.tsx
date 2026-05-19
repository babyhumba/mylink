"use client"

import { LinkItem } from "./AddLinkDialog"

interface LinkListProps {
  links: LinkItem[]
}

export function LinkList({ links }: LinkListProps) {
  if (links.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground border-2 border-dashed border-border rounded-xl mt-6">
        <p>아직 추가된 링크가 없습니다.</p>
        <p className="text-sm mt-1">버튼을 눌러 첫 링크를 추가해보세요!</p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-3 mt-6 w-full">
      {links.map((link) => {
        if (!link.isVisible) return null

        return (
          <li key={link.id} className="w-full">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-full p-4 rounded-xl border-2 border-transparent bg-secondary text-secondary-foreground shadow-sm transition-all hover:scale-[1.02] hover:bg-zinc-100 hover:border-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span className="font-semibold">{link.title}</span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
