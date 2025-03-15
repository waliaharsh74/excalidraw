"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { HomeIcon, UserPlusIcon, UserIcon } from "@heroicons/react/24/solid"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {Button} from "@repo/ui/button"

export default function Nav() {

    const [login, setLogin] = useState(false);
    const router = useRouter();
    const handleLogOut =()=>{
        localStorage.removeItem("shapeSmithToken")
        router.push('/')
    }
    useEffect(() => {
        const userLogin = localStorage.getItem("shapeSmithToken")

        if (userLogin) {
            setLogin(true)
           

        }
    })
    return (
        <nav className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg text-white p-4 sticky top-0 z-10">
            <div className="container mx-auto flex justify-between items-center">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Link href="/" className="text-xl font-bold flex items-center">
                        <HomeIcon className="h-6 w-6 mr-2" />
                        Shape Smith
                    </Link>
                </motion.div>
                {!login && <div className="space-x-4">
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
                </div>}
                {login && <div className="space-x-4">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="inline-block">
                        <Button className="flex items-center hover:text-gray-300" fn={handleLogOut}>
                            <UserIcon className="h-5 w-5 mr-1" />
                            Logout
                        </Button>
                    </motion.div>
                   
                </div>}
            </div>
        </nav>
    )
}

