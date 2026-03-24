import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fdfdfd] p-6 font-sans text-black selection:bg-[#FEF08A] selection:text-black">
      <main className="flex w-full max-w-[360px] flex-col items-center gap-8 md:max-w-[768px] lg:max-w-[1024px]">
        {/* Profile Section (Neo-brutalism) */}
        <div className="flex w-full flex-col items-center gap-8 rounded-[12px] border-[3px] border-black bg-[#FEF08A] p-8 shadow-[6px_6px_0_black] transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0_black] md:flex-row md:justify-center md:gap-12 lg:gap-16 lg:p-12">
          {/* Profile Image */}
          <div className="h-[120px] w-[120px] shrink-0 overflow-hidden rounded-full border-[3px] border-black bg-white">
            <Image
              src="/profile.png"
              alt="프로필 이미지"
              width={120}
              height={120}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          {/* Profile Details */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h1 className="text-4xl font-black tracking-tight lg:text-5xl">김준형</h1>
            <p className="mt-3 text-lg font-bold text-black/80 lg:text-xl">안녕하세요</p>
            
            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap justify-center gap-4 md:justify-start">
              <button className="rounded-[12px] border-[3px] border-black bg-white px-6 py-2.5 font-bold shadow-[4px_4px_0_black] transition-all hover:bg-gray-50 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none">
                Contact
              </button>
              <button className="rounded-[12px] border-[3px] border-black bg-[#A7F3D0] px-6 py-2.5 font-bold shadow-[4px_4px_0_black] transition-all hover:bg-[#6EE7B7] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none">
                Projects
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
