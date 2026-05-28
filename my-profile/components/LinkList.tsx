"use client"

import { LinkItem } from "./AddLinkDialog"
import { Pencil, Trash2 } from "lucide-react"

interface LinkListProps {
  links: LinkItem[]
  isAdmin?: boolean
  onEdit?: (link: LinkItem) => void
  onDelete?: (id: string) => void
}

export function LinkList({ links, isAdmin = false, onEdit, onDelete }: LinkListProps) {
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
        // 관리자가 아니고 숨김 처리된 링크면 퍼블릭에선 렌더링 제외
        if (!isAdmin && !link.isVisible) return null

        return (
          <li key={link.id} className="w-full flex items-center gap-2">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => console.log(`[Link] '${link.title}' 링크 클릭됨 (URL: ${link.url})`)}
              className={`group flex-1 flex items-center justify-center p-4 rounded-xl border-2 border-transparent bg-secondary text-secondary-foreground shadow-sm transition-all hover:scale-[1.02] hover:bg-zinc-100 hover:border-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${!link.isVisible ? 'opacity-50 line-through' : ''}`}
            >
              <span className="font-semibold">{link.title}</span>
            </a>
            {isAdmin && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    console.log(`[Edit] '${link.title}' 수정 버튼 클릭됨`)
                    onEdit?.(link)
                  }}
                  className="p-3 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl transition-colors"
                  aria-label="수정"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    console.log(`[Delete] '${link.title}' 삭제 버튼 클릭됨 (ID: ${link.id})`)
                    onDelete?.(link.id)
                  }}
                  className="p-3 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                  aria-label="삭제"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
