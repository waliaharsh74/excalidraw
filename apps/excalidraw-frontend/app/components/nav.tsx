"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { HomeIcon, UserPlusIcon, UserIcon } from "@heroicons/react/24/solid"

export default function Nav() {
    return (
        <nav className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg text-white p-4 sticky top-0 z-10">
            <div className="container mx-auto flex justify-between items-center">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Link href="/" className="text-xl font-bold flex items-center">
                        <HomeIcon className="h-6 w-6 mr-2" />
                        Auth Demo
                    </Link>
                </motion.div>
                <div className="space-x-4">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="inline-block">
                        <Link href="/signin" className="flex items-center hover:text-gray-300">
                            <UserIcon className="h-5 w-5 mr-1" />
                            Sign In
                        </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="inline-block">
                        <Link href="/signup" className="flex items-center hover:text-gray-300">
                            <UserPlusIcon className="h-5 w-5 mr-1" />
                            Sign Up
                        </Link>
                    </motion.div>
                </div>
            </div>
        </nav>
    )
}

