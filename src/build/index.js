const { getFolder } = require('../menu')
const path = require('path')
const root = path.resolve('../../demo')
const { withTitles } = require('../markdown/title')
const { tranHtml } = require('../markdown')
const ssr = require('../ssr')
const fs = require('fs-extra')
const { listen } = require('socket.io')

const build = async root => {
    
    const output = root + '/dist/' 

    // 清空目录
    fs.emptyDirSync(output)

    // 复制assets文件
    fs.copySync(path.resolve('../assets'),output + '/assets')

    const list = getFolder(root)
    const resolvePath = filePath => path.resolve(root, './' + filePath)
    list.forEach(async markDownPath => {
        
        const htmlPath = output + markDownPath.replace('README.md','index.html').replace('.md', '.html')
        const data = {
            menu:  withTitles(list, resolvePath),
            markdown: tranHtml(resolvePath(markDownPath))
        }
        const body = await ssr.createRender(path.resolve(__dirname, '../template/App.vue'))(data)
        const html = `<!DOCTYPE html>
<html>
${body}
</html>
        `
        console.log('生成页面:' + htmlPath)
        fs.createFileSync(htmlPath)
        fs.writeFileSync(htmlPath, html)
    })
        

    // }
}
process.nextTick(async () => {
    await build(root)
})
