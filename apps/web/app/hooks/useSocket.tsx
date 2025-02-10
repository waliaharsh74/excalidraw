
"use client"
import { useEffect, useState } from "react"
import { WS_URL } from "../config";

let socketInstance: WebSocket | null = null;

export const useSocket = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        if (!socketInstance) {
            socketInstance = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5NzA5ZWM3ZS0zOTI5LTRmNWItOWNjZi02ZTc5MGFlYmIxMjYiLCJpYXQiOjE3Mzc4MTIxODN9.fZTMYZTRypbDXPeVK4tKi7brk7nASJh5pY6MIn_r2_g`);

            socketInstance.onopen = () => {
                console.log("connected to ws");
                setLoading(false);
                setSocket(socketInstance);
            };

            socketInstance.onclose = () => {
                console.log("disconnected from ws");
                socketInstance = null;
                setLoading(true);
                setSocket(null);
            };
        } else {
            setLoading(false);
            setSocket(socketInstance);
        }

        return () => {

        };
    }, []);

    return {
        loading,
        socket
    };
};