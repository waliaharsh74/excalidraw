"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ToastContainer, toast } from 'react-toastify';
import {  signInSchema } from "@repo/common/types";
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";


import axios from "axios"
interface signInError{
    email?: string[] | undefined;
    password?: string[] | undefined
}

export default function SignIn() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

   
    const [err, setErr] = useState<signInError>({})
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const parsedData = signInSchema.safeParse({
                email, password
            })
            if (parsedData.error) {
                setErr(parsedData.error.flatten().fieldErrors)
                return
            }
            setLoading(true);
            const result = await axios.post("http://localhost:3003/api/v1/sign-in", {
                email, password
            })
            toast(result.data?.msg);
            setTimeout(() => {
                toast.success('Signed in successfully!');
                setLoading(false);
               
            }, 1500);
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
        <div className="flex min-h-screen bg-gray-50">
            {/* Left panel - Form */}
            <div className="w-full lg:w-1/2 flex flex-col p-6 md:p-12 justify-center animate-fade-in">
                <div className="max-w-md w-full mx-auto">
                    {/* <div className="mb-8">
                        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to home
                        </Link>
                    </div> */}

                    <div className="space-y-2 mb-8">
                        {/* <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 relative">
                                <div className="absolute inset-0 bg-blue-500 rounded-md rotate-45 transform -translate-x-1 translate-y-1"></div>
                                <div className="absolute inset-0 bg-purple-500 rounded-md"></div>
                            </div>
                            <span className="text-xl font-semibold tracking-tight">Shapesmith</span>
                        </div> */}
                        <h1 className="text-2xl font-bold">Welcome back</h1>
                        <p className="text-gray-500">Sign in to your account to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                {err && err?.email && <div className="">{err?.email[0]}</div>}

                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pr-10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >

                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                    {err && err?.password && <div className="">{err?.password[0]}</div>}

                                </div>
                            </div>



                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Signing in..." : "Sign in"}
                            </Button>
                            </div>
                    </form>

                    {/* <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-gray-50 px-2 text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <Button variant="outline" type="button" className="flex items-center justify-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" fill="currentColor" />
                                </svg>
                                <span>Google</span>
                            </Button>

                            <Button variant="outline" type="button" className="flex items-center justify-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" fill="currentColor" />
                                </svg>
                                <span>Facebook</span>
                            </Button>
                        </div>
                    </div> */}

                    <div className="mt-8 text-center text-sm">
                        Don't have an account?{' '}
                        <Link href="/signup" className="font-medium text-primary hover:text-primary/80">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right panel - Illustration */}
            <div className="hidden lg:block lg:w-1/2 relative bg-primary overflow-hidden">
                <div className="absolute inset-0 bg-mesh-pattern opacity-10"></div>

                <div className="absolute inset-0 flex flex-col justify-center items-center p-12 text-white">
                    <div className="max-w-md text-center">
                        <svg className="w-32 h-32 mx-auto mb-8 text-white/90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g className="animate-float">
                                <rect x="20" y="20" width="30" height="30" rx="4" fill="currentColor" fillOpacity="0.7" />
                            </g>
                            <g className="animate-float" style={{ animationDelay: '1s' }}>
                                <circle cx="65" cy="65" r="15" fill="currentColor" fillOpacity="0.7" />
                            </g>
                            <g className="animate-float" style={{ animationDelay: '0.5s' }}>
                                <path d="M50 15L65 40L35 40L50 15Z" fill="currentColor" fillOpacity="0.7" />
                            </g>
                        </svg>

                        <h2 className="text-2xl font-bold mb-4">Welcome back to Shapesmith</h2>
                        <p className="text-white/80 mb-6">
                            Continue creating and collaborating on your visual projects with your team.
                        </p>

                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-left">
                            <blockquote className="text-sm italic text-white/90 mb-3">
                                "Shapesmith has transformed how our team visualizes ideas. The collaborative features are incredibly intuitive."
                            </blockquote>
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-white/20 mr-3"></div>
                                <div>
                                    <div className="text-xs font-medium">Sarah Johnson</div>
                                    <div className="text-xs text-white/60">Product Designer at Acme Inc.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

