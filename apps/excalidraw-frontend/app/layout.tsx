import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import Navbar from './components/Navbar';

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Shape Smith",
  description: "An Excalidraw Clone",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden `}>
        <Navbar/>
        <main className="min-h-screen flex flex-col">{children}</main>
      </body>
    </html>
  )
}

