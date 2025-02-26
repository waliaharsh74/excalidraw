"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="text-center text-white">
      <motion.h1
        className="text-6xl font-bold mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome to Auth Demo
      </motion.h1>
      <motion.p
        className="text-xl mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Experience a creative authentication journey with animations and style.
      </motion.p>
      <motion.div
        className="space-x-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Link
          href="/signin"
          className="bg-white text-purple-600 font-bold py-3 px-6 rounded-full inline-block transition-transform hover:scale-105"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="bg-purple-600 text-white font-bold py-3 px-6 rounded-full inline-block transition-transform hover:scale-105"
        >
          Sign Up
        </Link>
      </motion.div>
    </div>
  )
}

