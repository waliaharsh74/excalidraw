import { HTTP_BACKEND_URL } from "../config";
import { Shape } from "../types";
import axios from "axios";



async function initDraw(canvas: HTMLCanvasElement, shape: string, roomId: number, socket: WebSocket) {
    const { shapes } = await getExistingShapes(roomId)
    console.log("shapes", shapes);
    const existingShapes: Shape[] = shapes



    const ctx = canvas.getContext("2d")
    if (!ctx) return


    socket.onmessage = (event) => {
        
        const { type, ShapeType, ...left } = JSON.parse(event.data);
        console.log("object",event.data);

        if (type == "shape") {
            const toPush = {
                type: ShapeType,
                ...left
            }
            console.log("tpush",toPush);
            existingShapes.push(toPush)
          
            clearCanvas(existingShapes, canvas, ctx);
        }
    }
    clearCanvas(existingShapes, canvas, ctx)

    let clicked = false;
    let startX = 0;
    let startY = 0;

    let currentPencilPoints: { x: number, y: number }[] = [];


    canvas.addEventListener("mousedown", (e) => {
        clicked = true
        startX = e.offsetX
        startY = e.offsetY
        if (shape === "pencil") {
            currentPencilPoints = [{ x: startX, y: startY }];
        } else if (shape === "rectangle ") {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
        }



    })
    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            if (shape == "rectangle") {
                const width = e.clientX - startX;
                const height = e.clientY - startY;
                clearCanvas(existingShapes, canvas, ctx)

                ctx.strokeStyle = "rgba(255, 255, 255)"
                ctx.strokeRect(startX, startY, width, height);
            }
            if (shape == "pencil") {
                const endX = e.offsetX;
                const endY = e.offsetY;
                clearCanvas(existingShapes, canvas, ctx);
                currentPencilPoints.push({ x: endX, y: endY });
                ctx.strokeStyle = "rgba(255, 255, 255)";
                ctx.beginPath();
                currentPencilPoints.forEach((point, index) => {
                    if (index === 0) {
                        ctx.moveTo(point.x, point.y);
                    } else {
                        ctx.lineTo(point.x, point.y);
                    }
                });
               
                ctx.stroke();
            }



            // ctx.strokeRect(startX, startY, width, height);

        }
    })
    canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        if (shape == "rectangle") {

            existingShapes.push({
                type: "rectangle",
                x: startX,
                y: startY,
                width,
                height
            })
            const msg = JSON.stringify({
                type: "shape",
                shapeType: "rectangle",
                x: startX,
                y: startY,
                width,
                height,
                roomId
            })
            console.log(msg);
            socket.send(msg)
        }
        else if (shape == "pencil") {

            existingShapes.push({
                type: "pencil",
                points: currentPencilPoints
            });
        }




    })



}
function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes?.map((shape) => {
        if (shape.type === "rectangle") {
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
        if (shape.type === "pencil") {
            ctx.strokeStyle = "rgba(255, 255, 255)";
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
    })

}
async function getExistingShapes(roomId: number) {
    console.log(`${HTTP_BACKEND_URL}/${roomId}`);
    const shapes = await axios.get(`${HTTP_BACKEND_URL}/api/v1/get-shapes/${roomId}`)
    return shapes.data
}


export default initDraw 