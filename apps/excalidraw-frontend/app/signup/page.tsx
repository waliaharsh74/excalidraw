"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import { signUpSchema } from "@repo/common/types"
interface signUpError {
    firstName?: string[] | undefined;
    lastName?: string[] | undefined;
    email?: string[] | undefined;
    password?: string[] | undefined;
}

export default function SignUp() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [err, setErr] = useState<signUpError>({})
    
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const parsedData = signUpSchema.safeParse({
                email, password,firstName,lastName
            })
            if (parsedData.error) {
                setErr(parsedData.error.flatten().fieldErrors)
                return
            }
            const result = await axios.post("http://localhost:3003/api/v1/sign-up", {
                firstName, lastName, email, password
            })
            toast(result.data?.msg);
            if (result.data?.id) {
                router.push("/signin")
            }

        } catch (error) {
            console.log(error);
            toast("Oops Something went wrong!");
        }
        
        
        
    }

    return (
        <div>
        <div className="max-w-md mx-auto  bg-opacity-20 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-lg">
            <motion.h1
                className="text-4xl font-bold mb-6 text-center "
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Sign Up
            </motion.h1>
            <motion.form
                onSubmit={handleSubmit}
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <div>
                    <label htmlFor="firstName" className="block mb-1 ">
                        First Name
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded  bg-opacity-50 focus:bg-opacity-70 transition-all"
                    />
                        {err && err?.firstName && <div className="">{err?.firstName[0]}</div>}
                </div>
                <div>
                    <label htmlFor="lastName" className="block mb-1 ">
                        Last Name
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded  bg-opacity-50 focus:bg-opacity-70 transition-all"
                    />
                        {err && err?.lastName && <div className="">{err?.lastName[0]}</div>}
                </div>
                <div>
                    <label htmlFor="email" className="block mb-1 ">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded  bg-opacity-50 focus:bg-opacity-70 transition-all"
                    />
                        {err && err?.email && <div className="">{err?.email[0]}</div>}
                </div>
                <div>
                    <label htmlFor="password" className="block mb-1 ">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded  bg-opacity-50 focus:bg-opacity-70 transition-all"
                    />
                        {err && err?.password && <div className="">{err?.password[0]}</div>}
                </div>
                <motion.button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700  font-bold py-2 px-4 rounded transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Sign Up
                </motion.button>
            </motion.form>
        </div>
            <ToastContainer />
        </div>
    )
}

