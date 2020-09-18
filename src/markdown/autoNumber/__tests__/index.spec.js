const { FileNode, next } = require('../../provider/__test_files__')
const autoNumberMiddleware = require('../index')

const options = {
  resolvePath: filePath => require('path').join(__dirname, filePath)
}

it('测试##/###自动添加序号', async () => {
  const fileNode = new FileNode('convertBefore.md', options)
  const afterNode = new FileNode('convertAfter.md', options)
  await autoNumberMiddleware({ fileNode }, next)
  expect(fileNode.body).toBe(afterNode.body)
})

it('测试##/###文章目录', async () => {
  const fileNode = new FileNode('convertBefore.md', options)
  await autoNumberMiddleware({ fileNode }, next)

  expect(fileNode.catalogs.length).toBe(3)
  expect(fileNode.catalogs[0].title).toBe('一、标题一')
  expect(fileNode.catalogs[0].hash).toBe('## 一、标题一')
  expect(fileNode.catalogs[0].children.length).toBe(3)
  expect(fileNode.catalogs[0].children[1].title).toBe('2. 小标题二')
  expect(fileNode.catalogs[0].children[1].hash).toBe('### 2. 小标题二')
  expect(fileNode.catalogs[1].title).toBe('二、标题二')
})

