import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws, request) {
    const url = request.url
    if (!url) {
        return
    }
    const queryParam = new URLSearchParams(url.split('?')[1]);
    const token = queryParam.get('token')
    ws.on('error', console.error);

    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });

    ws.send('something');
});