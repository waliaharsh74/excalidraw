"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function SignUp() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically send a request to your API
        console.log("Sign up:", { firstName, lastName, email, password })
        // Redirect to sign in page after successful sign up
        router.push("/signin")
    }

    return (
        <div className="max-w-md mx-auto bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-lg">
            <motion.h1
                className="text-4xl font-bold mb-6 text-center text-white"
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
                    <label htmlFor="firstName" className="block mb-1 text-white">
                        First Name
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded bg-white bg-opacity-50 focus:bg-opacity-70 transition-all"
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="block mb-1 text-white">
                        Last Name
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded bg-white bg-opacity-50 focus:bg-opacity-70 transition-all"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block mb-1 text-white">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded bg-white bg-opacity-50 focus:bg-opacity-70 transition-all"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block mb-1 text-white">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded bg-white bg-opacity-50 focus:bg-opacity-70 transition-all"
                    />
                </div>
                <motion.button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Sign Up
                </motion.button>
            </motion.form>
        </div>
    )
}

