import { WebSocketServer, WebSocket } from "ws";
import Jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config"
const wss = new WebSocketServer({ port: 8080 });
const sockets: WebSocket[] = []
const checkUser = (token: string) => {

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
    const isverified = Jwt.verify(token, JWT_SECRET)

    socket.on("message", (msg, isBinary) => {

        try {

            sockets.map((s) => {
                if (s != socket) {
                    s.send(msg.toString())
                }
            })
        } catch (error) {
            console.log(error);
        }

    })
    socket.on("error", (err) => {
        console.log(err);
    }
    )
})