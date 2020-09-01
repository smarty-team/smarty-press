// 提取Markdown标题
module.exports = async ({ fileNode }, next) => {
  const match = /^#\s?([^#\n\r]*)/.exec(fileNode.body)
  fileNode.title = match ? match[1].trim() : fileNode.path
  await next()
}