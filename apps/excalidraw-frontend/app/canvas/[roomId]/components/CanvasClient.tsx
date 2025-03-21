"use client"
import { WS_BACKEND_URL } from '@/app/config'

import React, { useEffect, useState } from 'react'
import CanvasRender from './CanvasRender'

const CanvasClient = ({ roomId }: { roomId: number }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("shapeSmithToken")
        const ws = new WebSocket(`${WS_BACKEND_URL}?token=${token}`)

        ws.onopen = (e) => {
            console.log("connected to ws");
            setSocket(ws);
            setLoading(true)
            ws?.send(JSON.stringify({
                type: "join_room",
                roomId
            }))
        }




        ws.onclose = (e) => {
            console.log("dis-connected from ws");
            setSocket(null);
            setLoading(false)
        }



    }, [])
    if (loading && !socket) {
        return (
            <div></div>
        )
    }


    return (
        <CanvasRender socket={socket} roomId={roomId} />
    )
}

export default CanvasClient