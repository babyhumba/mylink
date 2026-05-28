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
      <div className="font-pixel text-center py-10 bg-white border-4 border-black shadow-[4px_4px_0_0_#000] mt-6">
        <p className="text-black text-xl">아직 추가된 링크가 없습니다.</p>
        <p className="text-sm mt-2 text-zinc-600">버튼을 눌러 첫 링크를 추가해보세요!</p>
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
              className={`font-pixel group flex-1 flex items-center justify-center py-4 px-6 bg-white text-black text-xl border-4 border-black shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all ${!link.isVisible ? 'opacity-50 line-through' : ''}`}
            >
              <span className="font-bold tracking-widest">{link.title}</span>
            </a>
            {isAdmin && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    console.log(`[Edit] '${link.title}' 수정 버튼 클릭됨`)
                    onEdit?.(link)
                  }}
                  className="p-3 bg-[#0000FF] text-white border-4 border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
                  aria-label="수정"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    console.log(`[Delete] '${link.title}' 삭제 버튼 클릭됨 (ID: ${link.id})`)
                    onDelete?.(link.id)
                  }}
                  className="p-3 bg-[#FF0000] text-white border-4 border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
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
