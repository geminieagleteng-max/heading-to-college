import type { Metadata } from 'next';
import { Outfit, Noto_Sans_TC } from 'next/font/google';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import Link from 'next/link';
import HeaderWrapper from '../components/HeaderWrapper';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-noto-sans-tc',
});

export const metadata: Metadata = {
  title: '台灣頂大申請入學落點與18學群性向測驗系統',
  description: '專為台灣高中生設計的一站式大學升學導航平台。透過18學群興趣測驗找到理想領域，並一鍵對比15所頂尖大學申請入學一階篩選、二階甄試與面試日期。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      className={`${outfit.variable} ${notoSansTC.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#0b0f19] bg-grid text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
        <AppProvider>
          {/* 背景發光裝飾點 */}
          <div className="glow-spot w-[600px] h-[600px] bg-indigo-500/20 top-[-200px] left-[-200px]" />
          <div className="glow-spot w-[500px] h-[500px] bg-purple-500/15 top-[30%] right-[-100px]" />
          <div className="glow-spot w-[700px] h-[700px] bg-blue-500/10 bottom-[-200px] left-[20%]" />

          {/* 導覽列 (使用 Client Wrapper 來處理與全域 State 相關的動態資訊如比較校系數) */}
          <HeaderWrapper />

          {/* 主要內容區 */}
          <main className="flex-1 flex flex-col z-10 relative">
            {children}
          </main>

          {/* 頁尾 */}
          <footer className="border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md py-8 z-10 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <span className="font-outfit font-bold tracking-wider text-glow-gradient text-lg">HEADING TO COLLEGE</span>
                <p className="text-xs text-slate-400 mt-1">
                  © 2026 大學升學導航系統. 依據台灣大考中心與各校申請入學簡章模擬製作
                </p>
              </div>
              <div className="flex gap-6 text-sm text-slate-400">
                <Link href="/" className="hover:text-indigo-400 transition-colors">首頁</Link>
                <a href="#quiz-section" className="hover:text-indigo-400 transition-colors">18學群測驗</a>
                <a href="#database-section" className="hover:text-indigo-400 transition-colors">頂大科系庫</a>
              </div>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
