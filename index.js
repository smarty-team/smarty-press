const { createServer } = require('./devserver')
const { tranHtml } = require('./markdown')
const {createMiddleware} = require('./menu')
const path = require('path')
const ssr = require('./ssr')
const app = createServer()
app.use(createMiddleware(__dirname))
app.use(async (ctx, next) => {
    console.log('gggg')
    const { request: { url, query } } = ctx
    console.log('url:' + url, 'query type', query.type)

    ctx.type = "text/html"
    const markDownPath = url === '/' ? './README.md' : url
    console.log('markDownPath:', markDownPath)
    const data = {
        menu: ctx.menu,
        markdown: tranHtml(path.resolve(__dirname, './' + markDownPath))
    }
    ctx.body = await ssr.createRender(path.resolve(__dirname, './template/App.vue'))(data)
    await next()
})
app.start(3000)