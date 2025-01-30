"use client"
import { useEffect, useState } from "react"
import { WS_URL } from "../config";

export const useSocket = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [socket, setSocket] = useState<WebSocket>();
    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5NzA5ZWM3ZS0zOTI5LTRmNWItOWNjZi02ZTc5MGFlYmIxMjYiLCJpYXQiOjE3Mzc4MTIxODN9.fZTMYZTRypbDXPeVK4tKi7brk7nASJh5pY6MIn_r2_g`)
        ws.onopen = () => {
            console.log("connected to ws");
            setLoading(false)
            setSocket(ws)
        }

    }, [])
    return {
        loading,
        socket
    }


}