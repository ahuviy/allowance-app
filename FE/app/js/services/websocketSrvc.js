(function (angular) {
    angular
        .module('app')
        .service('websocketSrvc', service);

    service.$inject = [];

    function service() {
        var WS_ADDRESS = 'ws://localhost:8080';
        var socket = null;

        var EXPORTED_FUNCTIONS = {
            open: open.bind(this),               // open a websocket connection
            close: close.bind(this),             // close a websocket connection
            send: send.bind(this),               // send a msg to the server
            subscribe: subscribe.bind(this),     // subscribe to push messages
            unsubscribe: unsubscribe.bind(this), // unsubscribe from push messages
        };
        Object.assign(this, EXPORTED_FUNCTIONS);


        function open() {
            if (socket) {
                console.warn('Did not open a new websocket: existing websocket must be closed before opening a new one');
                return;
            }
            socket = new WebSocket(WS_ADDRESS);
            socket.onmessage = event => console.log(parseJson(event.data));
            socket.onopen = () => subscribe('ahuviTest');
            socket.onclose = () => socket = null;
        }

        function close() {
            if (socket) {
                unsubscribe('ahuviTest');
                socket.close();
            }
        }

        function send(obj) {
            if (!socket) {
                console.warn('no open websocket to send to');
                return;
            }
            socket.send(JSON.stringify(obj));
        }

        function subscribe(topic) {
            send({
                command: 'REGISTER_TO_TOPIC',
                topic: topic
            });
        }

        function unsubscribe(topic) {
            send({
                command: 'UNREGISTER_FROM_TOPIC',
                topic: topic
            });
        }

        function parseJson(data) {
            try {
                return JSON.parse(data);
            } catch (err) {
                return data;
            }
        }
    }
})(angular);