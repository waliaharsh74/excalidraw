type Shape = {
    type: "rectangle",
    x: number,
    y: number,
    width: number,
    height: number
} | {
    type: "circle",
    x: number,
    y: number,
    radius: number,

}

function initDraw(canvas: HTMLCanvasElement) {
    const existingShapes: Shape[] = []


    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "rgba(0,0,0)"
    let clicked = false;
    let startX = 0;
    let startY = 0;


    // ctx?.strokeRect(25, 25, 100, 100)
    canvas.addEventListener("mousedown", (e) => {
        clicked = true
        startX = e.clientX
        startY = e.clientY


    })
    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {

            const width = e.clientX - startX;
            const height = e.clientY - startY;
            clearCanvas(existingShapes, canvas, ctx)

            // ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.strokeRect(startX, startY, width, height);

        }
    })
    canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;

        existingShapes.push({
            type: "rectangle",
            x: startX,
            y: startY,
            width,
            height
        })


    })

}
function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes.map((shape) => {
        if (shape.type === "rectangle") {
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
    })

}
export default initDraw