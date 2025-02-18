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

} | {

    type: "pencil",
    points: { x: number, y: number }[]
}
export { type Shape }