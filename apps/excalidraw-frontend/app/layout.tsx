import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import Nav from "./components/nav"

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
      <body className={`${inter.className} bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 min-h-screen`}>
        <Nav />
        <main className="container mx-auto px-4 py-8">{children}</main>
        
      </body>
    </html>
  )
}

