

import CanvasClient from "./components/CanvasClient"

export default function Canvas({ params }: {
    params: {

        roomId: number
    }

}) {
    const roomId = params.roomId

    return (
        <CanvasClient roomId={roomId} />
    )
}