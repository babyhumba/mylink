import { MetadataRoute } from "next"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 배포 시 실제 도메인으로 변경해야 합니다. 개발 환경에서는 환경변수나 localhost를 사용합니다.
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  // 1. 정적 라우트
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ]

  // 2. 동적 라우트 (Firestore에서 닉네임/유저 목록 가져오기)
  const dynamicRoutes: MetadataRoute.Sitemap = []
  
  try {
    // usernames 컬렉션에 커스텀 닉네임(username)과 실제 uid 매핑 정보가 저장되어 있습니다.
    const querySnapshot = await getDocs(collection(db, "usernames"))
    
    querySnapshot.forEach((doc) => {
      const username = doc.id
      dynamicRoutes.push({
        url: `${baseUrl}/${username}`,
        lastModified: new Date(),
        changeFrequency: "always",
        priority: 0.9,
      })
    })
  } catch (error) {
    console.error("Sitemap 생성 중 Firestore 조회 에러:", error)
    // 에러 발생 시 동적 라우트는 제외하고 정적 라우트만이라도 반환합니다.
  }

  return [...staticRoutes, ...dynamicRoutes]
}
