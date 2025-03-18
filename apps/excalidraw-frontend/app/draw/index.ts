import { HTTP_BACKEND_URL } from "../config";
import { Shape } from "../types";
import axios from "axios";

export interface Transform {
    scale: number;
    offsetX: number;
    offsetY: number;
}

async function initDraw(
    canvas: HTMLCanvasElement,
    shape: string,
    roomId: number,
    socket: WebSocket,
    color: string = "#FFFFFF",
    transform: Transform
): Promise<() => void> {
    const { shapes } = await getExistingShapes(roomId);
    const existingShapes: Shape[] = shapes;

    const ctx = canvas.getContext("2d");
    if (!ctx) return () => { };

    const zoomIntensity: number = 0.1;


    let isPanning: boolean = false;
    let panStartX: number = 0;
    let panStartY: number = 0;
    let startOffsetX: number = 0;
    let startOffsetY: number = 0;

    const handleSocketMessage = (event: MessageEvent) => {
        const { type, ShapeType, color: shapeColor, ...shapeData } = JSON.parse(event.data);
        if (type === "shape") {
            existingShapes.push({ type: ShapeType, color: shapeColor, ...shapeData });
            clearCanvas(existingShapes, canvas, ctx, transform);
        }
    };
    socket.onmessage = handleSocketMessage;

    clearCanvas(existingShapes, canvas, ctx, transform);

    let clicked: boolean = false;
    let startX: number = 0;
    let startY: number = 0;
    let currentPencilPoints: { x: number; y: number }[] = [];


    const getWorldCoordinates = (e: MouseEvent): { x: number; y: number } => ({
        x: (e.offsetX - transform.offsetX) / transform.scale,
        y: (e.offsetY - transform.offsetY) / transform.scale,
    });

    const handleMouseDown = (e: MouseEvent) => {
        if (shape === "pan") {
            
            isPanning = true;
            panStartX = e.offsetX;
            panStartY = e.offsetY;
            startOffsetX = transform.offsetX;
            startOffsetY = transform.offsetY;
            clearCanvas(existingShapes, canvas, ctx, transform);
            return;
        }
        clicked = true;
        const pos = getWorldCoordinates(e);
        startX = pos.x;
        startY = pos.y;
        if (shape === "pencil") {
            currentPencilPoints = [{ x: startX, y: startY }];
        } else if (shape === "text") {
            const text = prompt("Enter text:");
            if (text) {
                existingShapes.push({ type: "text", x: startX, y: startY, text, color });
                socket.send(
                    JSON.stringify({
                        type: "shape",
                        shapeType: "text",
                        x: startX,
                        y: startY,
                        text,
                        roomId,
                        color,
                    })
                );
                clearCanvas(existingShapes, canvas, ctx, transform);
            }
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (shape === "pan") {
            if (!isPanning) return;
            const dx = e.offsetX - panStartX;
            const dy = e.offsetY - panStartY;
            transform.offsetX = startOffsetX + dx;
            transform.offsetY = startOffsetY + dy;
            ctx.setTransform(transform.scale, 0, 0, transform.scale, transform.offsetX, transform.offsetY);
            clearCanvas(existingShapes, canvas, ctx, transform);
            return;
        }
        if (!clicked) return;
        clearCanvas(existingShapes, canvas, ctx, transform);
        ctx.strokeStyle = color;
        const pos = getWorldCoordinates(e);
        if (shape === "rectangle") {
            const width = pos.x - startX;
            const height = pos.y - startY;
            ctx.strokeRect(startX, startY, width, height);
        } else if (shape === "pencil") {
            currentPencilPoints.push({ x: pos.x, y: pos.y });
            ctx.beginPath();
            currentPencilPoints.forEach((point, index) => {
                index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
        } else if (shape === "circle") {
            const radius = Math.hypot(pos.x - startX, pos.y - startY);
            ctx.beginPath();
            ctx.arc(startX, startY, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (shape === "pan") {
            isPanning = false;
            clearCanvas(existingShapes, canvas, ctx, transform);
            return;
        }
        if (!clicked) return;
        clicked = false;
        const pos = getWorldCoordinates(e);
        if (shape === "rectangle") {
            const width = pos.x - startX;
            const height = pos.y - startY;
            existingShapes.push({ type: "rectangle", x: startX, y: startY, width, height, color });
            socket.send(
                JSON.stringify({
                    type: "shape",
                    shapeType: "rectangle",
                    x: startX,
                    y: startY,
                    width,
                    height,
                    roomId,
                    color,
                })
            );
        } else if (shape === "pencil") {
            existingShapes.push({ type: "pencil", points: [...currentPencilPoints], color });
            socket.send(
                JSON.stringify({
                    type: "shape",
                    shapeType: "pencil",
                    points: currentPencilPoints,
                    color,
                    roomId,
                })
            );
            currentPencilPoints = [];
        } else if (shape === "circle") {
            const radius = Math.hypot(pos.x - startX, pos.y - startY);
            existingShapes.push({ type: "circle", x: startX, y: startY, radius, color });
            socket.send(
                JSON.stringify({
                    type: "shape",
                    shapeType: "circle",
                    x: startX,
                    y: startY,
                    radius,
                    roomId,
                    color,
                })
            );
        }
        clearCanvas(existingShapes, canvas, ctx, transform);
    };

    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;
        const oldScale = transform.scale;
        let newScale = oldScale;

        if (e.deltaY < 0) {
            newScale = oldScale + zoomIntensity;
        } else {
            newScale = Math.max(0.1, oldScale - zoomIntensity);
        }


        const worldX = (mouseX - transform.offsetX) / oldScale;
        const worldY = (mouseY - transform.offsetY) / oldScale;


        transform.offsetX = mouseX - newScale * worldX;
        transform.offsetY = mouseY - newScale * worldY;
        transform.scale = newScale;

        ctx.setTransform(transform.scale, 0, 0, transform.scale, transform.offsetX, transform.offsetY);
        clearCanvas(existingShapes, canvas, ctx, transform);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("wheel", handleWheel);

    return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
        canvas.removeEventListener("wheel", handleWheel);
        socket.onmessage = null;
    };
}

function clearCanvas(
    existingShapes: Shape[],
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    transform: Transform
): void {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(transform.scale, 0, 0, transform.scale, transform.offsetX, transform.offsetY);

    existingShapes.forEach((shape) => {
        ctx.strokeStyle = shape.color || "#FFFFFF";
        ctx.fillStyle = shape.color || "#FFFFFF";
        if (shape.type === "rectangle") {
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === "pencil") {
            ctx.beginPath();
            shape.points.forEach((point, index) => {
                index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
        } else if (shape.type === "text") {
            ctx.font = "16px Arial";
            ctx.fillText(shape.text, shape.x, shape.y);
        } else if (shape.type === "circle") {
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
    });
}

async function getExistingShapes(roomId: number): Promise<{ shapes: Shape[] }> {
    console.log(`${HTTP_BACKEND_URL}/${roomId}`);
    const shapes = await axios.get(`${HTTP_BACKEND_URL}/api/v1/get-shapes/${roomId}`);
    return shapes.data;
}

export default initDraw;
