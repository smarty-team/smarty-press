const { createServer } = require('./devserver')
const { tranHtml } = require('./markdown')
const { createMiddleware } = require('./menu')
const path = require('path')
const ssr = require('./ssr')
const app = createServer()

module.exports.startDev = (options = {
    root: path.resolve('.'),
    port: 3000
}) => {
    app.use(createMiddleware(options))
    app.use(async (ctx, next) => {
        const { request: { url, query } } = ctx
        console.log('url:' + url, 'query type', query.type)

        ctx.type = "text/html"
        let markDownPath = url === '/' ? './README.md' : url
        markDownPath = options.root + markDownPath
        console.log('markDownPath:', markDownPath)
        const data = {
            menu: ctx.menu,
            markdown: tranHtml(markDownPath)
        }
        ctx.body = await ssr.createRender(path.resolve(__dirname, './template/App.vue'))(data)
        await next()
    })
    const port = options.port ? options.port : 3000
    app.start(port )
}




