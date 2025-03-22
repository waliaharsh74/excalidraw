import React, { useEffect, useRef, useState } from 'react';
import initDraw from '@/app/draw';
import { Circle, Eraser, Hand, PaintBucket, Pencil, RectangleHorizontal, ZoomIn, ZoomOut } from 'lucide-react';


const CanvasRender = ({ socket, roomId }: { socket: WebSocket | null; roomId: number }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedShape, setSelectedShape] = useState('');
    const [color, setColor] = useState('#FFFFFF');
    const [zoomLevel, setZoomLevel] = useState(100)

    const transformRef = useRef({
        scale: 1,
        offsetX: 0,
        offsetY: 0,
    });
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

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

    // useEffect(() => {
    //     if (canvasRef.current) {
    //         if (selectedShape === 'pan') {
    //             canvasRef.current.style.cursor = 'grab';
    //         } else {
    //             canvasRef.current.style.cursor = 'default'; 
    //         }
    //     }
    // }, [selectedShape]);


    const zoomIn = () => {
       
        console.log(transformRef.current.scale);
    };

   
    const zoomOut = () => {
     
        console.log(transformRef.current.scale);

    };


    return (
        <div className='flex flex-col w-full h-screen pt-16'>
            <div className="bg-[#232329] flex justify-center gap-2 py-2 z-10 sticky top-16">
                <button onClick={() => setSelectedShape('rectangle')} className={`px-4 py-2 text-white bg rounded ${selectedShape ==='rectangle'? 'bg-black':''}`}>
                    <RectangleHorizontal />
                </button>
                <button onClick={() => setSelectedShape('circle')} className={`px-4 py-2 text-white rounded ${selectedShape =='circle'? 'bg-black':''}`}>
                    <Circle />
                </button>
                <button onClick={() => setSelectedShape('pencil')} className={`px-4 py-2 text-white rounded ${selectedShape =='pencil'? 'bg-black':''}`}>
                    <Pencil />
                </button>
                {/* <button onClick={() => setSelectedShape('text')} className=`px-4 py-2 text-white rounded`>
                    Text
                </button> */}
                {/* <button onClick={() => setSelectedShape('eraser')} className={`px-4 py-2 text-white rounded ${selectedShape =='eraser'? 'bg-black':''}`}>
                    <Eraser />
                </button> */}
                <button onClick={() => setSelectedShape('pan')} className={`px-4 py-2 text-white rounded ${selectedShape =='pan'? 'bg-black':''}`}>
                    <Hand />
                </button>
                <div className="mt-[7px]">
                    <label htmlFor="colorPicker" className="mr-2 text-white rounded">
                        {/* <PaintBucket /> */}
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
                    
            <canvas className="bg-black absolute" ref={canvasRef} width={windowSize.width} height={windowSize.height}></canvas>

            <div className='relative text-white'>
                {/* <div className="flex items-center">
                    <button onClick={zoomOut} className="px-4 py-2 text-white rounded">
                        <ZoomOut />
                    </button>
                    <span className="text-white mx-2">{zoomLevel}%</span>
                    <button onClick={zoomIn} className="px-4 py-2 text-white rounded">
                        <ZoomIn />
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default CanvasRender;
