const {
    Provider,
    FileNode,
    resolvePath,
    testFile,
    options,
    next,
    updateTestFile,
    testBody,
    openFileAsText
} = require('../../provider/__test_files__')
const marked = require('marked')
const markedMiddleware = require('../index')

it('测试 marked', () => {
    expect(marked(testBody).trim()).toBe('<h1 id="test">Test</h1>')
})

it('markdown transfrer 单文件', async () => {
    const testHtml = marked(testBody)
    const fileNode = new FileNode(testFile, options)
    await markedMiddleware({
        fileNode
    }, next)
    expect(fileNode.html).toBe(testHtml)
})

it('markdown transfrer middleware', async () => {
    const testHtml = marked(testBody)
    const provider = new Provider()
    const testFiles = [testFile]
    provider.resolvePath = resolvePath

    provider.useMiddleware(markedMiddleware)

    // 初始化
    await provider.patch(testFiles)
    expect(provider
        .fileNodes()
        .map(item => item.html)
        .join(', ')
    ).toBe(testHtml)

    // 增加文件
    testFiles.push('abc/123/README.md')
    await provider.patch(testFiles)
    expect(provider
        .fileNodes()
        .map(item => item.html)
        .join('')
    ).toBe([
        marked(openFileAsText('abc/123/README.md')),
        testHtml
    ].join(''))

    // 删除文件
    testFiles.pop()
    await provider.patch(testFiles)
    expect(provider
        .fileNodes()
        .map(item => item.html)
        .join(', ')
    ).toBe(testHtml)

    // 文件修改
    await updateTestFile('# Hello World\nFoo Bar!')
    await provider.patch(testFiles)
    expect(provider
        .fileNodes()
        .map(item => item.html)
        .join(', ')
    ).toBe(marked(openFileAsText(testFile)))

    // 文件复原
    await updateTestFile()

})

it('测试 markdown，包含菜单', async () => {
    const testHtml = marked(testBody)
    const fileNode = new FileNode(testFile, options)

    //添加测试数据
    fileNode.catalogs = [
        {
            title: '一、标题',
            hash: '## 一、标题',
            children: [{
                title: '1. 二级标题',
                hash: '### 1. 二级标题',
            }, {
                title: '2. 二级标题',
                hash: '### 2. 二级标题',
            }]
        }, {
            title: '二、标题',
            hash: '## 二、标题',
            children: [{
                title: '1. 二级标题',
                hash: '### 1. 二级标题',
            }, {
                title: '2. 不存在重名',
                hash: '### 2. 不存在重名',
            }]
        }, {
            title: '三、标题',
            hash: '## 三、标题',
            children: [{
                title: '1. 二级标题',
                hash: '### 1. 二级标题',
            }]
        }
    ]

    await markedMiddleware({
        fileNode
    }, next)

    // 顶级标题测试
    expect(fileNode.catalogs[0].hash).toBe('一、标题')
    expect(fileNode.catalogs[1].hash).toBe('二、标题')

    // 二级标题测试
    expect(fileNode.catalogs[0].children[0].hash).toBe('1-二级标题')
    expect(fileNode.catalogs[0].children[1].hash).toBe('2-二级标题')

    // 二级标题重名测试
    expect(fileNode.catalogs[1].children[0].hash).toBe('1-二级标题-1')
    expect(fileNode.catalogs[1].children[1].hash).toBe('2-不存在重名')
    expect(fileNode.catalogs[2].children[0].hash).toBe('1-二级标题-2')
})
