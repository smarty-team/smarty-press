const {
    Provider,
    FileNode,
    resolvePath,
    testFile,
    options,
    next,
    updateTestFile
} = require('../../provider/__test_files__')
const prefixMiddleware = require('../index')
const prefixText = '　'

// 必须挂到 provider树，所以没法做但文件测试

it('注册中间件 方式测试', async () => {
    const provider = new Provider()
    const testFiles = [testFile]
    provider.resolvePath = resolvePath

    provider.useMiddleware(prefixMiddleware)

    // 初始化
    await provider.patch(testFiles)
    expect(provider
        .fileNodes()
        .map(item => item.prefix)
        .join(', ')
    ).toBe("")

    // 增加文件
    testFiles.push('abc/123/README.md') // 无标题文件
    testFiles.push('xyz/ad.md') // 有标题文件
    await provider.patch(testFiles)
    expect(provider
        .fileNodes()
        .map(item => item.prefix)
        .join(', ')
    ).toBe(`${prefixText}${prefixText}, , ${prefixText}`)

    // 删除文件
    testFiles.pop()
    await provider.patch(testFiles)
    expect(provider
        .fileNodes()
        .map(item => item.prefix)
        .join(', ')
    ).toBe(`${prefixText}${prefixText}, `)

    // 文件修改
    await updateTestFile('# Hello World\nFoo Bar!')
    await provider.patch(testFiles)
    expect(provider
        .fileNodes()
        .map(item => item.prefix)
        .join(', ')
    ).toBe(`${prefixText}${prefixText}, `)

    // 文件复原
    await updateTestFile()
})
