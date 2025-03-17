import { HTTP_BACKEND_URL } from "../config";
import { Shape } from "../types";
import axios from "axios";



async function initDraw(canvas: HTMLCanvasElement, shape: string, roomId: number, socket: WebSocket, color: string = "#FFFFFF") {
    const { shapes } = await getExistingShapes(roomId);
    const existingShapes: Shape[] = shapes;

    const ctx = canvas.getContext("2d");
    if (!ctx) return () => { };

    // WebSocket message handler
    const handleSocketMessage = (event: MessageEvent) => {
        const { type, ShapeType, color: shapeColor, ...shapeData } = JSON.parse(event.data);
        if (type === "shape") {
            existingShapes.push({ type: ShapeType, color: shapeColor, ...shapeData });
            clearCanvas(existingShapes, canvas, ctx);
        }
    };
    socket.onmessage = handleSocketMessage;

    clearCanvas(existingShapes, canvas, ctx);

    let clicked = false;
    let startX = 0;
    let startY = 0;
    let currentPencilPoints: { x: number; y: number }[] = [];

    const handleMouseDown = (e: MouseEvent) => {
        clicked = true;
        startX = e.offsetX;
        startY = e.offsetY;
        if (shape === "pencil") {
            currentPencilPoints = [{ x: startX, y: startY }];
        } else if (shape === "text") {
            const text = prompt("Enter text:");
            if (text) {
                existingShapes.push({ type: "text", x: startX, y: startY, text, color });
                socket.send(JSON.stringify({ type: "shape", shapeType: "text", x: startX, y: startY, text, roomId, color }));
                clearCanvas(existingShapes, canvas, ctx);
            }
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!clicked) return;
        if (shape === "rectangle") {
            const width = e.offsetX - startX;
            const height = e.offsetY - startY;
            clearCanvas(existingShapes, canvas, ctx);
            ctx.strokeStyle = color;
            ctx.strokeRect(startX, startY, width, height);
        } else if (shape === "pencil") {
            currentPencilPoints.push({ x: e.offsetX, y: e.offsetY });
            clearCanvas(existingShapes, canvas, ctx);
            ctx.strokeStyle = color;
            ctx.beginPath();
            currentPencilPoints.forEach((point, index) => {
                index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
        } else if (shape === "circle") {
            const radius = Math.hypot(e.offsetX - startX, e.offsetY - startY);
            clearCanvas(existingShapes, canvas, ctx);
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.arc(startX, startY, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (!clicked) return;
        clicked = false;
        const width = e.offsetX - startX;
        const height = e.offsetY - startY;

        if (shape === "rectangle") {
            existingShapes.push({ type: "rectangle", x: startX, y: startY, width, height, color });
            socket.send(JSON.stringify({ type: "shape", shapeType: "rectangle", x: startX, y: startY, width, height, roomId, color }));
        } else if (shape === "pencil") {
            existingShapes.push({ type: "pencil", points: [...currentPencilPoints], color });
            socket.send(JSON.stringify({ type: "shape", shapeType: "pencil", points: currentPencilPoints, color, roomId }));
            currentPencilPoints = [];
        } else if (shape === "circle") {
            const radius = Math.hypot(e.offsetX - startX, e.offsetY - startY);
            existingShapes.push({ type: "circle", x: startX, y: startY, radius, color });
            socket.send(JSON.stringify({ type: "shape", shapeType: "circle", x: startX, y: startY, radius, roomId, color }));
        }
        clearCanvas(existingShapes, canvas, ctx);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
        socket.onmessage = null;
    };
}
function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes?.map((shape) => {
        ctx.strokeStyle = shape.color || "#FFFFFF";
        ctx.fillStyle = shape.color || "#FFFFFF";
        if (shape.type === "rectangle") {
            
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
        else if (shape.type === "pencil") {
            // ctx.strokeStyle = "rgba(255, 255, 255)";
            ctx.beginPath();
            shape.points.forEach((point, index) => {
                if (index === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            });
            ctx.stroke();
        }
        else if (shape.type === "text") {
            ctx.font = "16px Arial";
            ctx.fillText(shape.text, shape.x, shape.y);
        }
        else if (shape.type === "circle") {
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
    })

}
async function getExistingShapes(roomId: number) {
    console.log(`${HTTP_BACKEND_URL}/${roomId}`);
    const shapes = await axios.get(`${HTTP_BACKEND_URL}/api/v1/get-shapes/${roomId}`)
    return shapes.data
}


export default initDraw 