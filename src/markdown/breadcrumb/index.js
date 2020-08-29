// 计算面包屑

module.exports = async ({ fileNode }, next) => {
  const breadcrumb = fileNode.breadcrumb = {
    nodes: [fileNode], //父子关系，
    toHtml: toHtml, //传入 格式化函数，返回结果
    get html() { //如果使用默认方法，可以直接使用 .html 方式调用
      return this.toHtml()
    }
  }
  let parentNode = fileNode.parent
  while (parentNode) {
    // parentNode 为 TreeNode 节点
    breadcrumb.nodes.unshift(parentNode)
    parentNode = parentNode.parent
  }
  if (fileNode.path.indexOf('README.md') != -1) {
    breadcrumb.nodes.pop()
  }
  await next()
}

function toHtml(formatNode, separator) {
  const formatFunc = formatNode || formatDefault
  return this.nodes.map(treeNode => {
    return formatFunc(
      treeNode.isFileNode ?
        null : // 最后一个节点为 fileNode，不存在 treeNode
        treeNode, // 其他节点 为 treeNode 节点
      treeNode.isFileNode ?
        treeNode : // 如果节点是 fileNode，直接传入
        treeNode.children.length > 0 && treeNode.getFileName(treeNode.children[0]) == 'README.md' ?
          treeNode.children[0] : // 如果 当前 treeNode 节点存在子节点，并且第一个为 README.md，传入
          null
    )
  }).join(separator || '')
}

// 默认格式画
function formatDefault(treeNode, indexFileNode) {
  let itemHtml = ''
  if (indexFileNode) {
    // treeNode存在 首页( README.md)，显示链接
    itemHtml = `<a href="/${indexFileNode.path.replace('README.md', '')}">${indexFileNode.title || indexFileNode.path}</a>`
  } else {
    // treeNode 无首页，只显示 路径文本
    itemHtml = treeNode.path
  }
  return `<li class="breadcrumb-item">${itemHtml}</li>`
}