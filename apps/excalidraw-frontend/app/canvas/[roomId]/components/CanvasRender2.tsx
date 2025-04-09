import React, { useEffect, useRef, useState } from 'react';
import CanvasDrawer from '../../../draw/CanvasDrawer';
import { Circle, Hand, Pencil, RectangleHorizontal } from 'lucide-react';

interface CanvasRenderProps {
    socket: WebSocket | null;
    roomId: number;
}

const CanvasRender = ({ socket, roomId }: CanvasRenderProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedShape, setSelectedShape] = useState('');
    const [color, setColor] = useState('#FFFFFF');
    const transformRef = useRef({
        scale: 1,
        offsetX: 0,
        offsetY: 0,
    });
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [zoomLevel, setZoomLevel] = useState(100);

    // We'll create the drawer instance only once (or when socket/roomId changes)
    const drawerRef = useRef<CanvasDrawer | null>(null);

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        let cancelled = false;
        async function initDrawer() {
            if (canvasRef.current && socket) {
                const drawer = await CanvasDrawer.create(
                    canvasRef.current,
                    selectedShape,
                    roomId,
                    socket,
                    color,
                    transformRef.current,
                    setZoomLevel
                );
                if (!cancelled) {
                    drawerRef.current = drawer;
                }
            }
        }
        initDrawer();

        return () => {
            cancelled = true;
            if (drawerRef.current) {
                drawerRef.current.cleanup();
                drawerRef.current = null;
            }
        };
    }, [socket, roomId]);

    // Update shape without reinitializing the drawer.
    useEffect(() => {
        if (drawerRef.current) {
            drawerRef.current.setShape(selectedShape);
        }
    }, [selectedShape]);

    // Update color and force a canvas refresh.
    useEffect(() => {
        if (drawerRef.current) {
            drawerRef.current.setColor(color);
        }
    }, [color]);

    return (
        <div className="flex flex-col h-screen pt-16">
            <div className="bg-[#232329] flex justify-center gap-2 py-2 z-10 sticky top-16">
                <button
                    onClick={() => setSelectedShape('rectangle')}
                    className={`px-4 py-2 text-white rounded ${selectedShape === 'rectangle' ? 'bg-black' : ''}`}
                >
                    <RectangleHorizontal />
                </button>
                <button
                    onClick={() => setSelectedShape('circle')}
                    className={`px-4 py-2 text-white rounded ${selectedShape === 'circle' ? 'bg-black' : ''}`}
                >
                    <Circle />
                </button>
                <button
                    onClick={() => setSelectedShape('pencil')}
                    className={`px-4 py-2 text-white rounded ${selectedShape === 'pencil' ? 'bg-black' : ''}`}
                >
                    <Pencil />
                </button>
                <button
                    onClick={() => setSelectedShape('pan')}
                    className={`px-4 py-2 text-white rounded ${selectedShape === 'pan' ? 'bg-black' : ''}`}
                >
                    <Hand />
                </button>
                <div className="mt-[7px]">
                    <label htmlFor="colorPicker" className="mr-2 text-white rounded"></label>
                    <input
                        type="color"
                        id="colorPicker"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="p-1 border rounded"
                    />
                </div>
            </div>

            <canvas
                className="bg-black absolute"
                ref={canvasRef}
                width={windowSize.width + 1}
                height={windowSize.height - 64}
            ></canvas>

            <div className="absolute bottom-4 right-4 bg-gray-800 bg-opacity-75 px-3 py-1 rounded text-white">
                Zoom: {zoomLevel}%
            </div>
        </div>
    );
};

export default CanvasRender;
