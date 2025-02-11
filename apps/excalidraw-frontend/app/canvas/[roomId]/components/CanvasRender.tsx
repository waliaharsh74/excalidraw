import initDraw from '@/app/draw'
import React, { useEffect, useRef } from 'react'

const CanvasRender = ({ socket, roomId }: { socket: WebSocket | null, roomId: number }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        socket?.send(JSON.stringify({
            type: "join_room",
            roomId
        }))
        if (canvasRef.current) initDraw(canvasRef.current)

    }, [canvasRef])
    return (
        <div>
            <canvas className="" ref={canvasRef} width={1422} height={670}></canvas>
        </div>
    )
}

export default CanvasRender