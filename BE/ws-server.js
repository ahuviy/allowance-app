const PUSH_INTERVAL_TIME_IN_MILLISECONDS = 5000;
let pushInterval = null;

const ws = require('nodejs-websocket');
const server = ws.createServer(onConnect).listen(8080);


// Callback after establishing a new client connection
function onConnect(conn) {
    console.log('Established new connection.');
    conn.on('text', onText);
    conn.on('close', onClose);
    conn.on('error', onError);
}

function onText(str) {
    const msg = parseJson(str);
    if (typeof msg === 'string') {
        switch (msg) {
            case 'start pushing':
                startPushing();
                break;
            case 'stop pushing':
                stopPushing();
                break;
            default:
                console.log('received unrecognized command');
        }
    } else {
        console.log('received unrecognized command');
    }
}

function onClose(code, reason) {
    console.log('Connection closed.');
}

function onError(err) {
    switch (err.code) {
        case 'ECONNRESET':
            console.log('Client terminated the connection by closing the browser window');
            break;
        default:
            console.log('Connection error:', err);
    }
}

function startPushing() {
    if (!pushInterval) {
        pushInterval = setInterval(() => {
            broadcast(server, `push-${Math.ceil(Math.random() * 100)}`);
        }, PUSH_INTERVAL_TIME_IN_MILLISECONDS);
    }
}

function stopPushing() {
    if (pushInterval) {
        clearInterval(pushInterval);
    }
}

// Push a message to all connected clients
function broadcast(server, msg) {
    server.connections.forEach(conn => conn.sendText(msg));
}

function parseJson(data) {
    try {
        return JSON.parse(data);
    } catch (err) {
        return data;
    }
}
