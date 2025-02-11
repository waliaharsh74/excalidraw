"use client"
import { WS_BACKEND_URL } from '@/app/config'
import initDraw from '@/app/draw'

import React, { useEffect, useRef, useState } from 'react'
import CanvasRender from './CanvasRender'

const CanvasClient = ({ roomId }: { roomId: number }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const ws = new WebSocket(`${WS_BACKEND_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5NzA5ZWM3ZS0zOTI5LTRmNWItOWNjZi02ZTc5MGFlYmIxMjYiLCJpYXQiOjE3Mzc4MTIxODN9.fZTMYZTRypbDXPeVK4tKi7brk7nASJh5pY6MIn_r2_g`)

        ws.onopen = (e) => {
            console.log("connected to ws");
            setSocket(ws);
            setLoading(true)
        }




        ws.onclose = (e) => {
            console.log("dis-connected from ws");
            setSocket(null);
            setLoading(false)
        }



    }, [])
    if (loading && !socket) {
        return (
            <div>Loading....</div>
        )
    }


    return (
        <CanvasRender socket={socket} roomId={roomId} />
    )
}

export default CanvasClient