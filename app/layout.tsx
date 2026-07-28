import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "세특랩 | AI 에이전트 기반 세특 초안 작성기",
  description: "학생의 활동 키워드로 과목별 세특 초안을 만드는 AI 에이전트 워크스페이스",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
