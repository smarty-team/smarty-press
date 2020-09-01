const marked = require('marked')

// Markdown 转 HTML
module.exports = async ({ fileNode }, next) => {
  fileNode.html = marked(fileNode.body)
  await next()
}
