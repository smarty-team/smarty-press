const Vue = require('vue') // vue@next
const serverRenderer = require('@vue/server-renderer')
const compilerSsr = require('@vue/compiler-ssr')
const compilerSfc = require('@vue/compiler-sfc')
const fs = require('fs')
const path = require('path')

const createRender = path => {
   
    const { descriptor } = compilerSfc.parse(fs.readFileSync(path, 'utf-8'))
    const render = compilerSsr.compile(descriptor.template.content).code
    return async (data) => {
        const app = Vue.createApp({
            ssrRender: new Function('require', render)(require), // 写法二
            data: () => data
        })
        return serverRenderer.renderToString(app)
    }
}

const renderMarkdown = async ({ reqFile, template, provider, options }) => {
    const skin = options.theme || '默认皮肤'
    const data = {
        menu: provider.toArray(fileNode => ({
            path: fileNode.path,
            name: fileNode.title,
            prefix: fileNode.prefix || ''
        })),
        skinPath: '', //样式
        breadcrumb: null, //面包屑导航
        catalogs: [], //目录
        markdown: '' //正文
    }
    await provider.getItem(reqFile, fileNode => {
        if (!fileNode) {
            data.markdown = `<h1>文件不存在: ${reqFile}</h1>`
        } else {
            // 面包屑也可以通过 fileNode.breadcrumb.toHtml(treeNode, indexFileNode) 方式获取更加复杂的样式
            data.breadcrumb = fileNode.breadcrumb.html
            data.catalogs = fileNode.catalogs
            data.skinPath = fileNode.getTheme(skin).path  // 样式代码
            data.markdown = [
                fileNode.html, // 解析后的 html
            ].join('')
        }
    });
    return await createRender(template)(data)
}

module.exports = {
    createRender,
    renderMarkdown,
    template: path.resolve(__dirname, '../template/App.vue')
}