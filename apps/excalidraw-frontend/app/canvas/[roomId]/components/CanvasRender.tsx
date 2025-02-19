import initDraw from '@/app/draw'
import React, { useEffect, useRef, useState } from 'react'



const CanvasRender = ({ socket, roomId }: { socket: WebSocket | null, roomId: number }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [selectedShape, setSelectedShape] = useState('')

    useEffect(() => {

        if (canvasRef.current && socket) initDraw(canvasRef.current, selectedShape, roomId, socket)

    }, [canvasRef, selectedShape])
    return (
        <div>
            <div className='flex'>
                <button onClick={() => { setSelectedShape("rectangle") }}>rectangle</button>
                <button onClick={() => { setSelectedShape("circle") }}>circle</button>
                <button onClick={() => { setSelectedShape("pencil") }}>pencil</button>
            </div>
            <canvas className="" ref={canvasRef} width={1422} height={670}></canvas>

        </div>
    )
}

export default CanvasRender