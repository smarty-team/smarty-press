const path = require('path')
const ssr = require('../src/ssr')
const fs = require('fs')
const { getFolder } = require('../src/menu')
const provider = require('../src/markdown')

const makeFiles = async (provider, options) => {

  // 获取所有源码文件
  const files = []
  Object.keys(provider.nodes).forEach(nodeName => {
    const node = provider.nodes[nodeName]
    if (node.isFileNode) {
      // 文件节点
      delete provider.nodes[node.path]
      node.path = node.path.replace('README.', 'index.').replace('.md', '.html')
      provider.nodes[node.path] = node
      files.push(node.path)
    } else {
      // 目录节点，依次创建目录结构
      const folderPath = provider.distPath(node.path)
      !fs.existsSync(folderPath) && fs.mkdirSync(folderPath)
    }
  })

  // 根据文件记录，依次生成静态
  let reqFile = files.shift()
  while (reqFile) {
    const body = await ssr.renderMarkdown({
      reqFile,
      provider,
      template: ssr.template,
      options
    })
    fs.writeFileSync(provider.distPath(reqFile), body, {
      encoding: 'utf-8'
    })
    reqFile = files.shift()
  }
}

module.exports = async function (options = {
  theme: 'default',
  root: path.resolve('.'),
  output: path.resolve('dist')
}) {

  console.log(`编译静态文件
源码目录: ${options.root}
输出目录: ${options.output}`)


  // 分析源码
  provider.resolvePath = filePath => path.resolve(options.root, './' + filePath)
  provider.distPath = filePath => path.resolve(options.output, './' + filePath)
  await provider.patch(await getFolder(options.root))

  // todo 复制 asssets 文件

  // 生成静态
  await makeFiles(provider, options)

  console.log('生成完毕')
}