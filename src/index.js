const { createServer } = require('./devserver')
const { createMiddleware } = require('./menu')
const path = require('path')
const ssr = require('./ssr')
const fs = require('fs')
const provider = require('./markdown')

const KoaStatic = require('koa-static')
module.exports.startDev = (options = {
    theme: 'default',
    root: path.resolve('.'),
    port: 3000
}) => {
    const app = createServer({
        watchFolder: options.root
    })

    // 获取文件目录
    provider.resolvePath = filePath => path.resolve(options.root, './' + filePath)

    app.use(createMiddleware(options))

    // 静态服务
    // app.use(KoaStatic('./assets'))
    app.use(async (ctx, next) => {
        // console.log('ctx.url', ctx.url)
        if (ctx.url.startsWith('/assets')) {
            try {
                const buffer = fs.readFileSync(path.resolve(__dirname, './' + ctx.url))
                ctx.type = path.extname(ctx.url).slice(1);
                ctx.body = buffer
            } catch (e) {
                ctx.body = ''
            }

        } else {
            await next()
        }
    })

    app.use(async (ctx, next) => {
        // 忽略favicon
        if (ctx.url === '/favicon.ico') {
            ctx.body = ''
            return
        }
        await next()
    })

    app.use(async (ctx, next) => {
        await provider.patch(ctx.menu)
        const { request: { url, query } } = ctx
        const reqPath = url.split('?')[0]
        const reqFile = path.extname(reqPath) === '' ? reqPath + '/README.md' : reqPath

        ctx.body = await ssr.renderMarkdown({
            reqFile,
            provider,
            template: ssr.template,
            options
        })

        await next()
    })

    const port = options.port ? options.port : 3000
    app.start(port, () => {
        console.log('app start at ' + port)
    })
}
