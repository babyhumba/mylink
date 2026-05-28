"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import { useAuth } from "@/components/AuthProvider"

export default function LandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // 이미 로그인되어 있으면 바로 mypage로 이동
    if (user) {
      router.push("/mypage")
    }
  }, [user, router])

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      // signInWithPopup 성공 시 auth state가 변경되어 useEffect가 /mypage로 보냅니다.
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  // 로그인 상태 확인 중일 때는 아무것도 렌더링하지 않음 (깜빡임 방지)
  if (loading || user) return null

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-[#FFD700] overflow-hidden">
      
      {/* 8-bit 스타일 배경 장식 (격자 무늬 등 선택적 구현) */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)',
        backgroundSize: '32px 32px'
      }} />

      {/* 우상단 Mylink (검은색, 클릭 시 초기 화면) */}
      <a 
        href="/" 
        className="absolute top-6 right-6 font-pixel text-black text-3xl font-bold z-10 hover:scale-105 active:scale-95 transition-transform"
      >
        Mylink
      </a>

      {/* 메인 텍스트 컨테이너 */}
      <div className="text-center z-10 flex flex-col items-center">
        {/* 메인 카피: Mylink에 오신걸 환영합니다 */}
        <h1 
          className="font-pixel text-4xl sm:text-5xl text-white mb-6 leading-tight tracking-widest"
          style={{ textShadow: '4px 4px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000, 2px 2px 0px #000' }}
        >
          Mylink에 오신걸<br/>환영합니다
        </h1>
        
        {/* 서브 카피: 로그인 후 다양한 링크 등록하세요 (메인의 50% 크기) */}
        <p 
          className="font-pixel text-xl sm:text-2xl text-black mb-12"
          style={{ textShadow: '2px 2px 0px rgba(255,255,255,1)' }}
        >
          로그인 후 다양한 링크 등록하세요
        </p>
        
        {/* 구글 로그인 버튼 (8-bit 레트로 스타일) */}
        <button 
          onClick={handleGoogleLogin}
          className="font-pixel bg-[#FF0000] text-white text-xl sm:text-2xl py-4 px-8 border-4 border-black shadow-[6px_6px_0_0_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0_0_#000] active:translate-y-[6px] active:translate-x-[6px] active:shadow-none transition-all"
        >
          Google로 시작하기
        </button>
      </div>
    </main>
  )
}
