"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import {useRouter} from "next/navigation"
import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react"
import ShapePreview from "../components/ShapePreview"
import { withProtectedRoute } from "../context/withProtectedRoute"

function Home() {
  const [login,setLogin]=useState(false);
  const router = useRouter();
  useEffect(()=>{
    const userLogin=localStorage.getItem("shapeSmithToken")
    if(userLogin){
      setLogin(true)
      router.push('/home')
      
    }
  })
  return (
    <div className=" ">
      <section className="pt-32 pb-20 px-6 md:px-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-pattern opacity-50"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-2">
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
                >
                  Collaborative Drawing
                  <span className="text-primary block">Made Simple</span>
                </motion.h1>

                <motion.p
                  className="text-lg md:text-xl text-gray-600 mt-4 max-w-lg"
                  style={{ animationDelay: '0.1s' }}
                >
                  Create, share, and collaborate on diagrams, wireframes, and visual ideas in real-time with Shapesmith.
                </motion.p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link href="/create-room">
                  <Button size="lg" className="w-full sm:w-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    Create Room
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/join-room">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    Join room
                  </Button>
                </Link>
              </div>

              <div className="pt-6 flex items-center space-x-4 text-sm text-gray-500 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex">
                  <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white -ml-2"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white -ml-2"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-white -ml-2 flex items-center justify-center text-white text-xs">
                    +2k
                  </div>
                </div>
                <span>Joined this month</span>
              </div>
            </div>

            <div className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-xl animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="absolute inset-0 bg-white">
                <ShapePreview />

                {/* Foreground Mockup UI */}
                <div className="absolute bottom-4 left-4 right-4 p-3 frosted-glass rounded-lg">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-sm bg-blue-500"></div>
                    </div>
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                    </div>
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                      <div className="w-4 h-4 bg-green-500" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
                    </div>
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                      <div className="w-4 h-4 bg-red-500" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    
      
    </div>
  )
}

export default withProtectedRoute(Home)