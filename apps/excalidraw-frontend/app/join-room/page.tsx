"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ToastContainer, toast } from 'react-toastify';
import { CreateRoomSchema } from "@repo/common/types";


import axios from "axios"
interface SlugError{
    slug?: string[] | undefined;
   
}

export default function SignIn() {
    const [slug, setSlug] = useState("")
   
   
    const [err, setErr] = useState<SlugError>({})
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const parsedData = CreateRoomSchema.safeParse({
                slug
            })
            if (parsedData.error) {
                setErr(parsedData.error.flatten().fieldErrors)
                return
            }
            const result = await axios.post("http://localhost:3003/api/v1/create-room", {
                slug, 
            })
            toast(result.data?.msg);
            if (result.data?.token){
                localStorage.setItem("shapeSmithToken", result.data?.token)
                router.push('/home')
            }
            
        } catch (error) {
            console.log(error);
            toast("Oops Something went wrong!");
        }
        
        
        
       
        
    }

    return (
        <div>
        <div className=" relative max-w-md mx-auto bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-lg">
            <motion.h1
                className="text-4xl font-bold mb-6 text-center text-white"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Sign In
            </motion.h1>
            <motion.form
                onSubmit={handleSubmit}
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <div>
                    <label htmlFor="email" className="block mb-1 text-white">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded bg-white bg-opacity-50 focus:bg-opacity-70 transition-all"
                    />
                    {err && err?.slug && <div className="text-white">{err?.slug[0]}</div>}
                </div>
               
                <motion.button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Sign In
                </motion.button>
            </motion.form>
           
        </div>
            <ToastContainer />
        </div>
    )
}

