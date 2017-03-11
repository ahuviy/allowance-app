class WebsocketService {
    constructor() {
        this.ONE_DAY_IN_MILLISECONDS = 86400000;
        this.ONE_WEEK_IN_MILLISECONDS = 604800000;
        this.topics = {};
        this.server = require('nodejs-websocket')
            .createServer(conn => {
                console.log('Established new connection.');
                conn.on('text', str => this.onText(str, conn));
                conn.on('close', (code, reason) => this.onClose(code, reason, conn));
                conn.on('error', err => this.onError(err, conn));
            })
            .listen(8080);

        setInterval(this.remOldKeysFromTopics, this.ONE_DAY_IN_MILLISECONDS);
    }

    onText(str, connection) {
        const msg = this.parseJson(str);
        if (!msg || typeof msg !== 'object') {
            console.log('received unrecognized command');
            return;
        }
        switch (msg.command) {
            case 'BROADCAST':
                this.broadcast(msg.payload, msg.topic);
                break;
            case 'ADD_METADATA':
                this.server.connections.map(conn => {
                    if (conn.key === connection.key) {
                        conn.metadata = Object.assign({}, conn.metadata, msg.payload);
                        console.log('added metadata:', conn.metadata);
                    }
                });
                break;
            case 'REGISTER_TO_TOPIC':
                this.registerToTopic(msg.topic, connection.key);
                break;
            case 'UNREGISTER_FROM_TOPIC':
                this.unregisterFromTopic(msg.topic, connection.key);
                break;
            default:
                console.log('received unrecognized command');
        }
    }

    onClose(code, reason, conn) {
        console.log(`Connection ${conn.key} closed.`);
    }

    onError(err, conn) {
        switch (err.code) {
            case 'ECONNRESET':
                console.log('Client terminated the connection by closing the browser window');
                break;
            default:
                console.log('Connection error:', err);
        }
    }

    registerToTopic(topic, key) {
        if (!topic || !key) {
            return;
        }
        if (!this.topics[topic]) {
            this.topics[topic] = {};
        }
        this.topics[topic][key] = Date.parse(Date());
    }

    unregisterFromTopic(topic, key) {
        if (!topic || !key || !this.topics[topic]) {
            return;
        }
        if (this.topics[topic][key]) {
            delete this.topics[topic][key];
        }
    }

    // Push a message to all connected clients or to a specific topic
    broadcast(msg, topic) {
        const msgString = JSON.stringify(msg);
        if (!topic) {
            this.server.connections.forEach(conn => conn.sendText(msgString));
        } else {
            const recepients = Object.keys(this.topics[topic]);
            this.server.connections
                .filter(conn => recepients.includes(conn.key))
                .forEach(conn => conn.sendText(msg));
        }
    }

    parseJson(data) {
        try {
            return JSON.parse(data);
        } catch (err) {
            return data;
        }
    }

    remOldKeysFromTopics() {
        const lastWeekTimestamp = Date.parse(Date()) - this.ONE_WEEK_IN_MILLISECONDS;
        for (let topic in this.topics) {
            for (let key in topic) {
                if (this.topics[topic][key] && this.topics[topic][key] < lastWeekTimestamp) {
                    delete this.topics[topic[key]];
                }
            }
        }
    }
}

module.exports = new WebsocketService();
