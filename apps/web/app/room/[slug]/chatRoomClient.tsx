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
            const messageHandler = (event: MessageEvent) => {
                const parsedData = JSON.parse(event.data)
                if (parsedData.type === 'chat') {
                    setChats((prevChats) => [...prevChats, { message: parsedData.message }])
                }
            }
            socket.addEventListener("message", messageHandler)
            return () => {
                socket.removeEventListener("message", messageHandler)
                socket.send(JSON.stringify({
                    type: "leave_room",
                    roomId
                }))
            }

        }

        return () => {
            if (socket) {
                socket.close()
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