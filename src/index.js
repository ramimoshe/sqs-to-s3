'use strict';

const HttpServer = require('./HttpServer');
const Consumer   = require('./Consumer');
const pjson      = require('../package.json');

/* resources on graceful shutdown
    1. https://www.ctl.io/developers/blog/post/gracefully-stopping-docker-containers/
    2. https://pm2.io/doc/en/runtime/best-practices/graceful-shutdown/
*/

let httpServer;
let consumer;

process.on('message', async (message) => {
    if (['shutdown', 'SIGTERM', 'SIGINT'].includes(message)) {
        await stop();
    }
});

['SIGTERM', 'SIGINT'].map(command => {
    process.on(command, async () => {
        await stop();
    });
});

async function stop() {
    console.info('stopping the http service ...');
    await httpServer.stop();
    console.info('service stopped successfully');
    console.info('stopping the consumer service ...');
    consumer.stop();
    console.info('service stopped successfully');
}

async function run() {
    httpServer = new HttpServer(pjson.name);
    await httpServer.start();
    console.info(`Started service on port 8000`);

    consumer = new Consumer();
    consumer.start();
}

run()
    .then(_ => console.info('service is running'))
    .catch(error => console.info('failed to start service', error));





