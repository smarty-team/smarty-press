const { FileNode, next } = require('../../provider/__test_files__')
const autoNumberMiddleware = require('../index')

it('测试##/###自动添加序号', async () => {
  const fileNode = new FileNode('convertBefore.md', {
    resolvePath: filePath => require('path').join(__dirname, filePath),
  })
  const afterNode = new FileNode('convertAfter.md', {
    resolvePath: filePath => require('path').join(__dirname, filePath),
  })
  await autoNumberMiddleware({ fileNode }, next)
  expect(fileNode.body).toBe(afterNode.body)
})
