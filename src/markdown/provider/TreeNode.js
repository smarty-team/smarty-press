const IndexFile = 'README.md'

class TreeNode {
  constructor(path) {
    this.path = path
    this.children = []
    this.parent = null
  }

  // 添加节点
  addChild(child) {
    child.parent = this
    this.children.push(child)
    this.sort()
    return child
  }

  // 删除节点
  removeChild(child) {
    const index = this.children.indexOf(child)
    if (index != -1) {
      this.children.splice(index, 1)
    }
  }

  // 排序
  sort() {
    this.children.sort((aNode, bNode) => {
      const aFileName = this.getFileName(aNode)
      const bFileName = this.getFileName(bNode)
      if (aFileName == IndexFile) {
        //README.md放在最前面
        return -1
      } else if (bFileName == IndexFile) {
        return 1
      } else {
        return aFileName.localeCompare(bFileName)
      }
    });
  }

  // 获取不包含路径(/)的文件名
  getFileName(fileNode) {
    return fileNode.path.replace(this.path, '').replace(/(\/|\\)/g, '').split(/(\/|\\)/g)[0]
  }
}

module.exports = TreeNode
