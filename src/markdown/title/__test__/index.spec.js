const {
    Provider,
    FileNode,
    resolvePath,
    testFile,
    testBody,
    options,
    next,
    updateTestFile
} = require('../../provider/__test_files__')
const titleMiddleware = require('../index')

it('单文件 直接调用测试', async () => {
    const fileNode = new FileNode(testFile, options)
    await titleMiddleware({
        fileNode
    }, next)
    expect(fileNode.title)
        .toBe('Test')
})

it('单文件 无标题测试', async () => {
    const fileNode = new FileNode('abc/123/test.md', options)
    await titleMiddleware({
        fileNode
    }, next)
    expect(fileNode.title)
        .toBe('abc/123/test.md')
})

it('注册中间件 方式测试', async () => {
    const provider = new Provider()
    const testFiles = [testFile]
    provider.resolvePath = resolvePath

    provider.useMiddleware(titleMiddleware)

    // 初始化
    provider.patch(testFiles)
    expect(provider
        .fileNodes()
        .map(item => item.title)
        .join(', ')
    ).toBe("Test")

    // 增加文件
    testFiles.push('abc/123/README.md') // 有标题文件
    testFiles.push('abc/123/test.md') // 无标题文件
    provider.patch(testFiles)
    expect(provider
        .fileNodes()
        .map(item => item.title)
        .join(', ')
    ).toBe("ABC_123_README, abc/123/test.md, Test")

    // 删除文件
    testFiles.pop()
    provider.patch(testFiles)
    expect(provider
        .fileNodes()
        .map(item => item.title)
        .join(', ')
    ).toBe("ABC_123_README, Test")

    // 文件修改
    updateTestFile('# Hello World\nFoo Bar!')
    provider.patch(testFiles)
    expect(provider
        .fileNodes()
        .map(item => item.title)
        .join(', ')
    ).toBe("ABC_123_README, Hello World")

    // 文件复原
    updateTestFile()
})
