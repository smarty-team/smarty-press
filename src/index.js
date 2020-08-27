const { createServer } = require('./devserver')
const { tranHtml } = require('./markdown')
const { createMiddleware } = require('./menu')
const path = require('path')
const ssr = require('./ssr')
const app = createServer()
const fs = require('fs')
const provider = require('./markdown/provider')

const KoaStatic = require('koa-static')

module.exports.startDev = (options = {
    root: path.resolve('.'),
    port: 3000
}) => {

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
        const reqFile = path.extname(url) === '' ? url + '/README.md' : url
        const data = {
            menu: provider.toArray(fileNode => ({
                path: fileNode.path,
                title: fileNode.title || fileNode.path,
                prefix: fileNode.prefix || ''
            })),
            markdown: provider.getItem(reqFile, fileNode => {
                return fileNode ? tranHtml(fileNode.body) : Object.keys(provider.nodes).join('\n') + '文件不存在:' + reqFile + '\n' + provider.resolvePath(reqFile)
            })
        }
        ctx.body = await ssr.createRender(path.resolve(__dirname, './template/App.vue'))(data)
        await next()
    })

    const port = options.port ? options.port : 3000
    app.start(port, () => {
        console.log('app start at ' + port)
    })
}




