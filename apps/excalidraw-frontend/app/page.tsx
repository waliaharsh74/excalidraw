"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {useRouter} from "next/navigation"


import { ArrowRight, Zap, Users, Lock, Layers, Palette, Globe, Sparkles } from 'lucide-react';
import { Button } from "./components/ui/button";
import { motion } from "framer-motion";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FeatureCard from './components/FeatureCard';
import AnimatedSvg from './components/AnimatedSvg';
import ShapePreview from './components/ShapePreview';
import RoomCard from './components/RoomCard';

interface RoomExample {
  id: string;
  name: string;
  participants: number;
  createdAt: string;
  thumbnailColor: string;
}

const examples: RoomExample[] = [
  {
    id: 'demo-1',
    name: 'Product Roadmap Whiteboard',
    participants: 8,
    createdAt: '2023-06-15T10:30:00Z',
    thumbnailColor: 'bg-blue-100'
  },
  {
    id: 'demo-2',
    name: 'Marketing Campaign Storyboard',
    participants: 5,
    createdAt: '2023-06-18T14:45:00Z',
    thumbnailColor: 'bg-purple-100'
  },
  {
    id: 'demo-3',
    name: 'UI/UX Design Session',
    participants: 3,
    createdAt: '2023-06-20T09:15:00Z',
    thumbnailColor: 'bg-green-100'
  }
];

export default function Home() {
  const [login,setLogin]=useState(false);
  const router = useRouter();
  useEffect(()=>{
    const userLogin=localStorage.getItem("shapeSmithToken")
    if(userLogin){
      setLogin(true)
      router.push('/home')
      
    }
  })
  const motion = {
    div: (props: any) => <div {...props} className={`${props.className} animate-fade-in`} />,
    h1: (props: any) => <h1 {...props} className={`${props.className} animate-fade-in`} />,
    p: (props: any) => <p {...props} className={`${props.className} animate-fade-in`} />,
  };

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
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
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                {/* <Link href="/demo">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    Try Demo
                  </Button>
                </Link> */}
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

      {/* Features Section */}
      <section className="py-20 px-6 md:px-10 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold animate-on-scroll opacity-0">Why Shapesmith?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto animate-on-scroll opacity-0" style={{ animationDelay: '0.1s' }}>
              Designed with simplicity and collaboration in mind, our platform helps teams visualize ideas effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="animate-on-scroll opacity-0" style={{ animationDelay: '0.2s' }}>
              <FeatureCard
                icon={<Zap className="h-6 w-6" />}
                title="Real-time Collaboration"
                description="Work together with your team in real-time, seeing changes instantly as they happen."
              />
            </div>

            <div className="animate-on-scroll opacity-0" style={{ animationDelay: '0.3s' }}>
              <FeatureCard
                icon={<Users className="h-6 w-6" />}
                title="Unlimited Rooms"
                description="Create as many collaborative spaces as you need for different projects and teams."
              />
            </div>

            <div className="animate-on-scroll opacity-0" style={{ animationDelay: '0.4s' }}>
              <FeatureCard
                icon={<Lock className="h-6 w-6" />}
                title="Secure Sharing"
                description="Control who can view and edit your drawings with flexible permission settings."
              />
            </div>

            <div className="animate-on-scroll opacity-0" style={{ animationDelay: '0.5s' }}>
              <FeatureCard
                icon={<Layers className="h-6 w-6" />}
                title="Smart Shapes"
                description="Create perfect shapes that automatically snap into place with our intelligent drawing tools."
              />
            </div>

            <div className="animate-on-scroll opacity-0" style={{ animationDelay: '0.6s' }}>
              <FeatureCard
                icon={<Palette className="h-6 w-6" />}
                title="Customizable Styles"
                description="Personalize your drawings with a wide range of colors, styles, and formatting options."
              />
            </div>

            <div className="animate-on-scroll opacity-0" style={{ animationDelay: '0.7s' }}>
              <FeatureCard
                icon={<Globe className="h-6 w-6" />}
                title="Cloud-Based"
                description="Access your drawings from anywhere, on any device, with our cloud-based platform."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold animate-on-scroll opacity-0">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto animate-on-scroll opacity-0" style={{ animationDelay: '0.1s' }}>
              Get started in just a few simple steps.
            </p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute left-1/2 top-12 h-[calc(100%-80px)] w-0.5 bg-gray-200 -translate-x-1/2"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
              <div className="relative animate-on-scroll opacity-0" style={{ animationDelay: '0.2s' }}>
                <div className="lg:text-right">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4 lg:ml-auto">1</div>
                  <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
                  <p className="text-gray-600">Sign up for a free account href get started with Shapesmith.</p>
                </div>
                <div className="hidden lg:block absolute right-0 top-8 w-8 h-0.5 bg-gray-200 translate-x-4"></div>
              </div>

              <div className="lg:pt-32 animate-on-scroll opacity-0" style={{ animationDelay: '0.3s' }}>
                <div className="hidden lg:block absolute left-0 top-[148px] w-8 h-0.5 bg-gray-200 -translate-x-4"></div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2">Create or Join a Room</h3>
                <p className="text-gray-600">Start a new drawing room or join an existing one with a simple link.</p>
              </div>

              <div className="lg:pt-32 relative animate-on-scroll opacity-0" style={{ animationDelay: '0.4s' }}>
                <div className="lg:text-right">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4 lg:ml-auto">3</div>
                  <h3 className="text-xl font-semibold mb-2">Draw & Collaborate</h3>
                  <p className="text-gray-600">Use our intuitive tools href create shapes, add text, and collaborate in real-time.</p>
                </div>
                <div className="hidden lg:block absolute right-0 top-40 w-8 h-0.5 bg-gray-200 translate-x-4"></div>
              </div>

              
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 px-6 md:px-10 bg-gradient-radial from-white href-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 animate-on-scroll opacity-0">
              <Sparkles className="mr-2 h-3 w-3" /> Interactive Demo
            </div>
            <h2 className="text-3xl md:text-4xl font-bold animate-on-scroll opacity-0" style={{ animationDelay: '0.1s' }}>
              See Shapesmith in Action
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto animate-on-scroll opacity-0" style={{ animationDelay: '0.2s' }}>
              Try out these example rooms or create your own href experience the power of collaborative drawing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examples.map((room, index) => (
              <div key={room.id} className="animate-on-scroll opacity-0" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                <RoomCard {...room} />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center animate-on-scroll opacity-0" style={{ animationDelay: '0.6s' }}>
            <Link href="/signup">
              <Button size="lg">
                Create Your Own Room
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-10 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-pattern opacity-10"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold animate-on-scroll opacity-0">
                Ready to Collaborate Visually?
              </h2>
              <p className="mt-4 text-lg opacity-90 animate-on-scroll opacity-0" style={{ animationDelay: '0.1s' }}>
                Join thousands of teams using Shapesmith href bring their ideas href life. Get started for free, no credit card required.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/signup">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto animate-on-scroll opacity-0" style={{ animationDelay: '0.2s' }}>
                    Sign Up Free
                  </Button>
                </Link>

                <Link href="/signin">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white/20 hover:bg-white/10 animate-on-scroll opacity-0" style={{ animationDelay: '0.3s' }}>
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>

            <div className="max-w-md animate-on-scroll opacity-0" style={{ animationDelay: '0.4s' }}>
              <AnimatedSvg className="w-full max-w-md filter brightness-150 contrast-125" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

