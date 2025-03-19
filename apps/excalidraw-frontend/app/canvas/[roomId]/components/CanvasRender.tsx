import React, { useEffect, useRef, useState } from 'react';
import initDraw from '@/app/draw';

const CanvasRender = ({ socket, roomId }: { socket: WebSocket | null; roomId: number }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedShape, setSelectedShape] = useState('');
    const [color, setColor] = useState('#FFFFFF');

    const transformRef = useRef({
        scale: 1,
        offsetX: 0,
        offsetY: 0,
    });

    useEffect(() => {
        let cancelled = false;
        let cleanupFn: () => void;

        if (canvasRef.current && socket) {
            initDraw(canvasRef.current, selectedShape, roomId, socket, color, transformRef.current)
                .then((cleanup) => {
                    if (!cancelled) {
                        cleanupFn = cleanup;
                    }
                })
                .catch((err) => console.error(err));
        }

        return () => {
            cancelled = true;
            if (cleanupFn) cleanupFn();
        };
    }, [canvasRef, selectedShape, color, socket, roomId]);

    return (
        <div>
            <div className="flex gap-2 mb-4">
                <button onClick={() => setSelectedShape('rectangle')} className="px-4 py-2 text-white rounded">
                    Rectangle
                </button>
                <button onClick={() => setSelectedShape('circle')} className="px-4 py-2 text-white rounded">
                    Circle
                </button>
                <button onClick={() => setSelectedShape('pencil')} className="px-4 py-2 text-white rounded">
                    Pencil
                </button>
                <button onClick={() => setSelectedShape('text')} className="px-4 py-2 text-white rounded">
                    Text
                </button>
                <button onClick={() => setSelectedShape('pan')} className="px-4 py-2 text-white rounded">
                    Pan
                </button>
                <div className="mt-[7px]">
                    <label htmlFor="colorPicker" className="mr-2 text-white rounded">
                        Color:
                    </label>
                    <input
                        type="color"
                        id="colorPicker"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="p-1 border rounded"
                    />
                </div>
            </div>

            <canvas className="bg-black" ref={canvasRef} width={1300} height={670}></canvas>
        </div>
    );
};

export default CanvasRender;
