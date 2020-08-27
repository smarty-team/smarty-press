const fs = require('fs')

const { FileNode, Provider, options, resolvePath, testFile, testBody, openFileAsText } = require('../../provider/__test_files__')

it('FileNode 路径测试', () => {
    expect(new FileNode(testFile, options).realPath)
        .toBe(resolvePath(testFile))
})

it('FileNode 读取文件内容', () => {
    expect(new FileNode(testFile, options).body).toBe(testBody)
})

it('FileNode 文件修改测试', () => {

    const vFile = new FileNode(testFile, options)
    const newBody = '# Foobar'

    // 修改前
    expect(vFile.hasChanged).toBe(false)
    expect(vFile.body).toBe(testBody)

    // 修改测试
    fs.writeFileSync(vFile.realPath, newBody)
    expect(vFile.body).toBe(testBody) // 修改后，因为没有判断 hasChange，所以不会重新读取文件
    expect(vFile.hasChanged).toBe(true) // 监测到更新 
    expect(vFile.body).toBe(newBody) // 监测到更新 ，会自动读取文件内容
    expect(vFile.hasChanged).toBe(false) // 数据已经同步，再次监测不存在更新 

    // 测试完修改回来
    fs.writeFileSync(vFile.realPath, testBody)
    expect(vFile.hasChanged).toBe(true) //同样会监测到更新
    expect(vFile.body).toBe(testBody) //内容也变回来了

})

it('Provider 获取父节点（TreeNode）', () => {
    const provider = new Provider()

    // 没父节点的父节点不存在时，会自动创建
    const treeNode1 = provider.getParent('abc/456/README.md')
    const treeNode2 = provider.getParent('abc/123/README.md')

    // 测试README.md排序，同级 README.md 排在最前面
    provider.getParent('abc/README.md/README排在最前')

    // 从子节点查找父级
    expect(treeNode1.path).toBe('abc/456')
    expect(treeNode1.parent.path).toBe('abc')
    expect(treeNode1.parent.parent.path).toBe('')
    expect(treeNode2.path).toBe('abc/123')

    // 从根节点向下查找
    expect(provider.root.path).toBe('')
    expect(provider.root.children.length).toBe(1)
    expect(provider.root.children[0].path).toBe('abc')
    expect(provider.root.children[0].children.length).toBe(3)

    // 同级别treeNode会按文件名排序：需要abc/123、abc/456在后，和插入顺序无关
    expect(provider.root.children[0].children[0].path).toBe('abc/README.md')
    expect(provider.root.children[0].children[1].path).toBe('abc/123')
    expect(provider.root.children[0].children[2].path).toBe('abc/456')
})

it('Provider 获取父节点（TreeNode）', () => {
    const provider = new Provider()

    // 没父节点的父节点不存在时，会自动创建
    const treeNode1 = provider.getParent('abc/456/README.md')
    const treeNode2 = provider.getParent('abc/123/README.md')

    // 测试README.md排序，同级 README.md 排在最前面
    provider.getParent('abc/README.md/README排在最前')

    // 从子节点查找父级
    expect(treeNode1.path).toBe('abc/456')
    expect(treeNode1.parent.path).toBe('abc')
    expect(treeNode1.parent.parent.path).toBe('')
    expect(treeNode2.path).toBe('abc/123')

    // 从根节点向下查找
    expect(provider.root.path).toBe('')
    expect(provider.root.children.length).toBe(1)
    expect(provider.root.children[0].path).toBe('abc')
    expect(provider.root.children[0].children.length).toBe(3)

    // 同级别treeNode会按文件名排序：需要abc/123、abc/456在后，和插入顺序无关
    expect(provider.root.children[0].children[0].path).toBe('abc/README.md')
    expect(provider.root.children[0].children[1].path).toBe('abc/123')
    expect(provider.root.children[0].children[2].path).toBe('abc/456')
})

it('Provider 添加文件', async () => {
    const provider = new Provider()
    provider.resolvePath = resolvePath

    // 根节点添加文件
    await provider.addFile(testFile)
    const vFile1 = provider.nodes[testFile]
    expect(vFile1.path).toBe(testFile)
    expect(vFile1.body).toBe(testBody)

    // 子节点添加节点
    await provider.addFile('abc/456/README.md')
    const vFile2 = provider.nodes['abc/456/README.md']
    expect(vFile2.path).toBe('abc/456/README.md')
    expect(vFile2.body).toBe(openFileAsText('abc/456/README.md'))

    // 从根节点向下查找
    await provider.addFile('abc/123/README.md')
    const vFile3 = provider.root // [abc/, test.md]
        .children[0] // [abc/123/, abc/456/]
        .children[0] // [abc/123/README.md]
        .children[0]
    expect(vFile3.body).toBe(openFileAsText('abc/123/README.md'))

    // 自动排序测试
    expect(vFile1 === provider.root.children[1]).toBe(true) // [abc/, test.md]
    expect(vFile2.parent === vFile3.parent.parent.children[1]).toBe(true) // [abc/123/, abc/456/]
})

it('Provider 删除文件', async () => {
    const provider = new Provider()
    provider.resolvePath = resolvePath

    // 先添加测试文件
    await provider.addFile(testFile)
    await provider.addFile('abc/123/README.md')
    await provider.addFile('abc/456/README.md')
    expect(provider.getNodeFiles()).toBe(`abc/123/README.md, abc/456/README.md, ${testFile}`)

    // 删除文件
    await provider.removeFile('abc/123/README.md')
    expect(provider.getNodeFiles()).toBe(`abc/456/README.md, ${testFile}`)
})

it('Provider 修改文件', async () => {
    const provider = new Provider()
    provider.resolvePath = resolvePath

    // 添加测试文件
    await provider.addFile(testFile)
    const vFile = provider.nodes[testFile]
    expect(vFile.body).toBe(testBody)

    // 修改文件
    fs.writeFileSync(vFile.realPath, '来点广告， vscode插件 会了吧 非常好用')
    await provider.updateFile(testFile)
    expect(vFile.body).toBe('来点广告， vscode插件 会了吧 非常好用')

    // 恢复原样
    fs.writeFileSync(vFile.realPath, testBody)

})

it('Provider Patcher vFileNode测试', async () => {
    const provider = new Provider()
    provider.resolvePath = resolvePath

    // 数据从 glob.sync 传入，每次文件改动，会传入所有路径
    const testFiles = [testFile]

    // 初始化测试文件
    await provider.patch(testFiles)
    expect(provider.getNodeFiles()).toBe(testFile)

    // 模拟用户新建文件
    testFiles.push('abc/456/README.md')
    testFiles.push('abc/123/README.md')
    await provider.patch(testFiles)
    expect(provider.getNodeFiles()).toBe(`abc/123/README.md, abc/456/README.md, ${testFile}`)

    // 模拟用户删除文件
    testFiles.pop()
    await provider.patch(testFiles)
    expect(provider.getNodeFiles()).toBe(`abc/456/README.md, ${testFile}`)

    // 修改文件
    const vFile = provider.nodes[testFile]
    const newBody = '测试文件陌生单词太多，试试 会了吧！'
    expect(vFile.body).toBe(testBody) // vFile文件内容
    fs.writeFileSync(vFile.realPath, newBody)
    expect(vFile.body).toBe(testBody) // patch前，没有调用 updateFile，所以内容不变
    await provider.patch(testFiles)
    expect(vFile.body).toBe(newBody) //patch后，内容被更新

    // 恢复原样
    fs.writeFileSync(vFile.realPath, testBody)
    expect(vFile.body).toBe(newBody) // 和上面一样，patch前，内容不变
    await provider.patch(testFiles)
    expect(vFile.body).toBe(testBody) // patch后，内容恢复
})