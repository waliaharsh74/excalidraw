import { WebSocketServer, WebSocket } from "ws";
import Jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config"
const wss = new WebSocketServer({ port: 8080 });
const sockets: WebSocket[] = []
interface User {
    ws: WebSocket,
    rooms: String[],
    userId: String

}
const users: User[] = []
const checkUser = (token: string) => {
    try {
        const isVerified = Jwt.verify(token, JWT_SECRET);

        if (typeof isVerified === 'string') {
            return null
        }

        if (!isVerified || !isVerified.userId) return null

        return isVerified.userId
    } catch (error) {
        console.log(error);

    }

}

wss.on("connection", (socket, request) => {
    sockets.push(socket)
    const url = request.url;
    if (!url) {
        return
    }
    const queryParms = new URLSearchParams(url.split('?')[1])
    const token = queryParms.get('token') || ""

    const userId = checkUser(token);

    if (!userId) {
        socket.close()
        return
    }

    users.push({
        ws: socket,
        userId,
        rooms: []
    })

    socket.on("message", (msg) => {
        try {


            // if (typeof msg !== 'string') return
            let parsedData;
            if (typeof msg !== "string") {
                parsedData = JSON.parse(msg.toString());
            } else {
                parsedData = JSON.parse(msg);
            }

            if (parsedData.type === "join_room") {

                const user = users.find((x) => x.ws);
                if (!user) {
                    socket.close()
                    return
                }
                user?.rooms.push(parsedData.roomId)
                console.log(users);
            }

            if (parsedData.type === "leave_room") {
                const user = users.find((x) => x.ws);
                if (!user) {
                    socket.close()
                    return
                }
                user?.rooms.filter((x) => x == parsedData.room)
            }

            if (parsedData.type === "chat") {
                console.log("chat");
                const filteredUsers = users.filter((user) => user.rooms.includes(parsedData.roomId))
                filteredUsers.map((user) => user.ws.send(parsedData.message))
            }


        } catch (error) {
            console.log(error);
            socket.close()
        }

    })
    socket.on("error", (err) => {
        console.log(err);
    }
    )
})