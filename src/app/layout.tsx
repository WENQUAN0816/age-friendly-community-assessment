import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '老龄友好社区评估系统',
  description: '基于中国国情的老龄友好社区宜居性评估平台 - Age-Friendly Community Assessment System',
  keywords: '老龄友好,社区评估,宜居性,老年人,社区建设',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {children}
        </div>
      </body>
    </html>
  );
}