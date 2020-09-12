const path = require('path')
const fs = require('fs')
const FileNode = require('../FileNode')
const Provider = require('../Provider')

// 返回 FileNodes 的键
Provider.prototype.fileNodeKeys = function () {
  const treeFlags = Provider.prototype.treeKey('')
  return Object.keys(this.nodes)
    .filter(filePath => filePath.indexOf(treeFlags) == -1)
    .sort((a, b) => a.localeCompare(b))
}

// 获取 FileNodes 实例
Provider.prototype.fileNodes = function () {
  return this.fileNodeKeys().map(filePath => this.nodes[filePath])
}

// 获取当前 Nodes 节点中的文件 的功能
Provider.prototype.getNodeFiles = function () {
  return this.fileNodeKeys().join(', ')
}

// 解析路径
const resolvePath = (filePath) => {
  return path.join(__dirname, filePath)
}

// 读取测试文件内容
const openFileAsText = (filePath) => {
  return fs.readFileSync(resolvePath(filePath), {
    encoding: 'utf-8'
  }).replace('\r\n', '\n')
}

// 测试文件
const testFile = 'test.md'

// 测试文件内容
const testBody = '# Test'

// 异步写入文件
const updateTestFile = (text) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(updateTestFileSync(text))
    }, 1)
  })
}

// 同步写入文件
const updateTestFileSync = (text) => {
  fs.writeFileSync(resolvePath(testFile), text || testBody)
}

// 恢复test.md内容，防止之前被测试脚本改成其他内容
updateTestFileSync()

// 公共参数
const options = {
  resolvePath
}

// 中间件结束
const next = () => { }

// 导出测试用的公共数据，欢迎补充
module.exports = {
  FileNode,
  Provider,
  options,
  resolvePath: options.resolvePath,
  testFile,
  testBody,
  openFileAsText,
  updateTestFile,
  next
}