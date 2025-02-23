import { WebSocketServer, WebSocket } from "ws";
import Jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config"
import { prismaClient } from "@repo/db"
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

    const existingUser = users.find((user) => user.userId === userId);
    if (existingUser) {
        existingUser.ws = socket;
    } else {
        users.push({
            ws: socket,
            userId,
            rooms: []
        });
    }

    socket.on("message", async (msg) => {
        try {



            let parsedData;
            if (typeof msg !== "string") {
                parsedData = JSON.parse(msg.toString());
            } else {
                parsedData = JSON.parse(msg);
            }

            if (parsedData.type === "join_room") {
                const roomId = parsedData.roomId.toString();

                const user = users.find((x) => x.userId == userId);
                if (!user) {
                    socket.close()
                    return
                }
                if (!user.rooms.includes(roomId)) user?.rooms.push(roomId)

            }

            if (parsedData.type === "leave_room") {
                const user = users.find((x) => x.ws);
                if (!user) {
                    socket.close()
                    return
                }
                user?.rooms.filter((x) => x == parsedData.room)
            }
            console.log("parsedData", parsedData);
            if (parsedData.type === "chat") {



                await prismaClient.chat.create({
                    data: {
                        roomId: parseInt(parsedData.roomId, 10),
                        message: parsedData.message,
                        userId

                    }
                })


                users.forEach(user => {

                    if (user.rooms && user.rooms.includes(parsedData.roomId)) {
                        if (user.ws && user.ws.readyState === WebSocket.OPEN) {
                            user.ws.send(JSON.stringify({
                                type: "chat",
                                message: parsedData.message,
                                roomId: parsedData.roomId
                            }));
                            console.log("Message sent to user:", user.userId);
                        } else {
                            console.log(`WebSocket not open for user ${user.userId}`);
                        }
                    } else {
                        console.log(`User ${user.userId} is not in room ${parsedData.roomId}`);
                    }
                });



            }
            if (parsedData.type === "shape") {

                console.log(parsedData);
                const { x, y, shapeType, type, roomId, ...left } = parsedData
                await prismaClient.shape.create({
                    data: {
                        roomId: parseInt(parsedData.roomId, 10),
                        x: parsedData.x,
                        y: parsedData.y,
                        height: parsedData.height,
                        width: parsedData.width,
                        type: parsedData.shapeType

                    }
                })


                users.forEach(user => {

                    if (user.rooms && user.rooms.includes(parsedData.roomId)) {
                        if (user.ws && user.ws.readyState === WebSocket.OPEN) {
                            user.ws.send(JSON.stringify({
                                type: "shape",
                                x: parsedData.x,
                                y: parsedData.y,
                                ShapeType: parsedData.shapeType,
                                roomId: parsedData.roomId,
                                ...left
                            }));
                            console.log("Message sent to user:", user.userId);
                        } else {
                            console.log(`WebSocket not open for user ${user.userId}`);
                        }
                    } else {
                        console.log(`User ${user.userId} is not in room ${parsedData.roomId}`);
                    }
                });



            }


        } catch (error) {
            console.log(error);
            // socket.close()
        }

    })
    socket.on("error", (err) => {
        console.log(err);
    }
    )
})