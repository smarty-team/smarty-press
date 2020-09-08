const { createServer } = require('./devserver')
const { tranHtml } = require('./markdown')
const { createMiddleware } = require('./menu')
const path = require('path')
const ssr = require('./ssr')
const app = createServer()
const fs = require('fs')
const provider = require('./markdown')

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
        const skin = query.skin || '默认皮肤'
        const reqPath = url.split('?')[0]
        const reqFile = path.extname(reqPath) === '' ? reqPath + '/README.md' : reqPath
        const data = {
            menu: provider.toArray(fileNode => ({
                path: fileNode.path,
                name: fileNode.title,
                prefix: fileNode.prefix || ''
            })),
            markdown: provider.getItem(reqFile, fileNode => {
                if (!fileNode) {
                    return `<h1>文件不存在: ${reqFile}</h1>`
                }
                return [
                    // 面包屑也可以通过 fileNode.breadcrumb.toHtml(treeNode, indexFileNode) 方式获取更加复杂的样式
                    `<nav aria-label="breadcrumb"><ol class="breadcrumb">${fileNode.breadcrumb.html}</ol></nav>`,
                    // 解析后的 html
                    fileNode.html,
                    // 样式代码
                    fileNode.getTheme(skin).html
                ].join('')
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
