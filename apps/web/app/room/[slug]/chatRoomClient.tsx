"use client"

import { useEffect, useState } from "react"
import { useSocket } from "../../hooks/useSocket"

export function ChatRoomClient({
    messages,
    roomId
}: {
    messages: { message: string }[],
    roomId: string
}) {

    const [chat, setChats] = useState(messages)
    const [currentMsg, setCurrentMsg] = useState('')
    const { socket, loading } = useSocket()
    const handleSend = () => {
        if (!currentMsg) {
            alert("write something to send")
            return
        }
        const toSend = JSON.stringify({
            type: "chat",
            roomId: roomId.toString(),
            message: currentMsg
        })
        console.log(toSend);
        socket?.send(toSend)

        setCurrentMsg("")
    }
    useEffect(() => {
        if (socket && !loading) {
            console.log(socket);
            socket.send(JSON.stringify({
                type: "join_room",
                roomId
            }))
            socket.onmessage = (event) => {
                alert("message")
                console.log(event.data);
                const parsedData = JSON.parse(event.data)
                if (parsedData.type == 'chat') {
                    setChats((c) => [...c, { message: parsedData.message }])
                }
            }
        }
    }, [socket, loading, roomId])
    return (
        <div>
            <h1>All messages</h1>

            {chat.length > 0 && chat.map((msg, key) => {
                return (
                    <div key={key}>
                        {msg?.message}
                    </div>
                )
            })}
            <input type="text" value={currentMsg} onChange={(e) => setCurrentMsg(e.target.value)} name="" id="" />
            <button onClick={handleSend}>send</button>
        </div>

    )
}