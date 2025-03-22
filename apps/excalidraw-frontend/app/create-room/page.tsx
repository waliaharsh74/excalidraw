"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast,ToastContainer } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { CreateRoomSchema } from "@repo/common/types";
import { withProtectedRoute } from "../context/withProtectedRoute";

import axios from "axios"
interface SlugError {
    slug?: string[] | undefined;

}

 function CreateRoom() {
    const [slug, setSlug] = useState("")
    const [loading, setLoading] = useState(false);

    const [err, setErr] = useState<SlugError>({})
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = localStorage.getItem("shapeSmithToken")

        try {
            const parsedData = CreateRoomSchema.safeParse({
                slug
            })
            if (parsedData.error) {
                setErr(parsedData.error.flatten().fieldErrors)
                return
            }
            setLoading(true);

            const result = await axios.post("http://localhost:3003/api/v1/create-room", { slug }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
         
            setTimeout(() => {
                setLoading(false);

            }, 1500);
            if (result.data?.roomId) {

                router.push(`/canvas/${result.data?.roomId}`)
            }

        } catch (error) {
            console.log(error);
            toast.error("Oops Something went wrong!");
        }





    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className="w-full lg:w-1/2 flex flex-col p-6 md:p-12 justify-center animate-fade-in">
                <div className="max-w-md w-full mx-auto">


                    <div className="space-y-2 mb-8">

                        <h1 className="text-2xl font-bold">Welcome! </h1>
                        <p className="text-gray-500">Create and join room to draw. </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Room Slug</Label>
                                <Input
                                    type="text"
                                    id="slug"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="Enter room slug"
                                    required
                                    className="w-full px-3 py-2 border rounded bg-white bg-opacity-50 focus:bg-opacity-70 transition-all"
                                />
                                {err && err?.slug && <div className="text-white">{err?.slug[0]}</div>}
                            </div>





                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Joining..." : "Create and Join room"}
                            </Button>
                        </div>
                    </form>




                </div>
            </div>

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
            <ToastContainer/>
           
        </div>
    )
}

export default withProtectedRoute(CreateRoom)