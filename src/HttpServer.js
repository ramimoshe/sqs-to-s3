'use strict';

const config = require('config');
const Router = require('koa-router');
const Koa    = require('koa');


class HttpServer {
    constructor() {
    }

    async start() {
        const app    = new Koa();
        const router = new Router({ prefix: config.server.pathPrefix ? `/${config.server.pathPrefix}` : undefined });
        router.get('/health', this._healthRoute);
        app.use(router.routes());
        this.server = app.listen(config.server.port);

        return this;
    }

    async stop() {
        if (this.server && this.server.close) {
            await this.server.close();
        }

        return this;
    }

    async _healthRoute(ctx) {
        ctx.body   = {
            message: 'up'
        };
        ctx.status = 200;
    }

}

module.exports = HttpServer;