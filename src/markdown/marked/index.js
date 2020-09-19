const marked = require('marked')

let indexData = {}

// Markdown 转 HTML
module.exports = async ({ fileNode }, next) => {
  
  // 菜单处理
  if (fileNode.catalogs instanceof Array) {
    catelogs = {}
    setCatelogs(fileNode.catalogs)
  }

  // HTML处理
  fileNode.html = marked(fileNode.body)

  await next()
}

function setCatelogs(catelogs) {
  catelogs.forEach(item => {
    if (item.hash.indexOf('#') == 0) {
      const matched = marked(item.hash).match(/<h\d\sid="([^"]*)/)
      if (matched) {
        item.hash = matched[1]
        let index = indexData[item.hash] || 0
        indexData[item.hash] = ++index
        if (index > 1) {
          item.hash += '-' + (index - 1)
        }
      }
    }
    item.children && setCatelogs(item.children)
  })
}