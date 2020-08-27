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
      if (aNode.path.indexOf(IndexFile) != -1) {
        //README.md放在最前面
        return -1
      } else if (bNode.path.indexOf(IndexFile) != -1) {
        return 1
      } else {
        return aNode.path.localeCompare(bNode.path)
      }
    });
  }
}

module.exports = TreeNode
