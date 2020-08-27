const fs = require('fs')
const path = require('path')

class FileNode {

  constructor(_path, options) {
    this.resolvePath = options && options.resolvePath ?
      options.resolvePath : (filePath) => path.join(__dirname, filePath)
    this.path = _path
    this.children = []
    this.parent = null
    this.init()
  }

  // 是否存在更新
  get hasChanged() {
    if (this.getLastModified() != this.lastModified) {
      this.init()
      return true
    }
    return false
  }

  // 完整路径
  get realPath() {
    return this.resolvePath(this.path)
  }

  // 数据初始化
  init() {
    this.body = this.getFileBody()
    this.lastModified = this.getLastModified()
  }

  // 获取文件更新日期
  getLastModified() {
    return fs.statSync(this.realPath).mtime.getTime()
  }

  // 获取文件内容
  getFileBody() {
    return fs.readFileSync(this.realPath, {
      encoding: 'utf-8'
    })
  }

}

module.exports = FileNode
