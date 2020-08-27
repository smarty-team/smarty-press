const path = require('path')
const fs = require('fs')
const FileNode = require('../FileNode')
const Provider = require('../Provider')

// 修改 Provider 原型，增加 获取当前 Nodes 节点中的文件 的功能
Provider.prototype.getNodeFiles = function () {
  const treeFlags = Provider.prototype.treeKey('')
  return Object.keys(this.nodes)
    .filter(filePath => filePath.indexOf(treeFlags) == -1)
    .sort((a, b) => a.localeCompare(b))
    .join(', ')
}

// 解析路径
const resolvePath = (filePath) => {
  return path.join(__dirname, filePath)
}

// 读取测试文件内容
const openFileAsText = (filePath) => {
  return fs.readFileSync(resolvePath(filePath), {
    encoding: 'utf-8'
  })
}

// 测试文件
const testFile = 'test.md'

// 测试文件内容
const testBody = '# Test'

// 恢复test.md内容，防止之前被测试脚本改成其他内容
fs.writeFileSync(resolvePath(testFile), testBody)

// 公共参数
const options = {
  resolvePath
}

// 导出测试用的公共数据，欢迎补充
module.exports = {
  FileNode,
  Provider,
  options,
  resolvePath: options.resolvePath,
  testFile,
  testBody,
  openFileAsText
}