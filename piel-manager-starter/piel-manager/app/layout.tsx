import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PIEL Product Manager",
  description: "PIEL 상품 수집 및 샵링커 등록 관리",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
