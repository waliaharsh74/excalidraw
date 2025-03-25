import { WebSocketServer, WebSocket } from "ws";
import 'dotenv/config'
import Jwt from "jsonwebtoken";
import { prismaClient } from "@repo/db"
const JWT_SECRET: string = process.env.JWT_SECRET || "";
const port=process.env.PORT 
console.log(port);
const wss = new WebSocketServer({ port: typeof port === "string" ? parseInt(port) : port });
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
                const { shapeType, type, roomId, color, ...shapeData } = parsedData
                const shapePayload: any = {
                    roomId: parseInt(roomId, 10),
                    type: shapeType,
                    color: color || "#FFFFFF", 
                };

                switch (shapeType) {
                    case "rectangle":
                        shapePayload.x = shapeData.x;
                        shapePayload.y = shapeData.y;
                        shapePayload.width = shapeData.width;
                        shapePayload.height = shapeData.height;
                        break;
                    case "circle":
                        shapePayload.x = shapeData.x;
                        shapePayload.y = shapeData.y;
                        shapePayload.radius = shapeData.radius;
                        break;
                    case "pencil":
                        shapePayload.points = shapeData.points; 
                        break;
                    case "text":
                        shapePayload.x = shapeData.x;
                        shapePayload.y = shapeData.y;
                        shapePayload.text = shapeData.text;
                        break;
                    default:
                        console.error("Unknown shape type:", shapeType);
                        return;
                }

                const shapeSaved=await prismaClient.shape.create({
                    data: shapePayload,
                });
               


                users.forEach(user => {

                    if (user.rooms && user.rooms.includes(parsedData.roomId )) {
                        if (user.ws && user.ws.readyState === WebSocket.OPEN) {
                            user.ws.send(JSON.stringify({
                                shapeId: shapeSaved.shapeId,
                                type: "shape",
                                ShapeType: parsedData.shapeType,
                                roomId: parsedData.roomId,
                                color,
                                ...shapeData
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
            // incomplete
            if (parsedData.type === "deleteShape") {

                // console.log(parsedData);
                // const { shapeId, roomId,  } = parsedData
               


                // await prismaClient.shape.delete({
                //     where:{
                //         shapeId,
                //         roomId
                //     }
                // });
               


                // users.forEach(user => {

                //     if (user.rooms && user.rooms.includes(parsedData.roomId )) {
                //         if (user.ws && user.ws.readyState === WebSocket.OPEN) {
                //             user.ws.send(JSON.stringify({
                //                 type: "shape",
                //                 ShapeType: parsedData.shapeType,
                //                 roomId: parsedData.roomId,
                //                 color,
                //                 ...shapeData
                //             }));
                //             console.log("Message sent to user:", user.userId);
                //         } else {
                //             console.log(`WebSocket not open for user ${user.userId}`);
                //         }
                //     } else {
                //         console.log(`User ${user.userId} is not in room ${parsedData.roomId}`);
                //     }
                // });



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