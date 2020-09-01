// 标题缩进
const prefixText = '　'

module.exports = async ({ provider, fileNode }, next) => {
  fileNode.prefix = ''
  let parentNode = fileNode.parent
  while (parentNode && parentNode != provider.root) {
    fileNode.prefix += prefixText
    parentNode = parentNode.parent
  }
  await next()
}