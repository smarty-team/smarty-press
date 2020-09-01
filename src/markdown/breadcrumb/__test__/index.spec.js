const {
    Provider,
    resolvePath,
    testFile,
    updateTestFile
} = require('../../provider/__test_files__')

const titleMiddleware = require('../../title')
const breadcrumbMiddleware = require('../index')

// 必须挂到 provider树，所以没法做但文件测试

it('注册中间件 方式测试', async () => {
    const provider = new Provider()
    const testFiles = ['README.md', testFile]
    provider.resolvePath = resolvePath

    provider.useMiddleware(titleMiddleware)
    provider.useMiddleware(breadcrumbMiddleware)


    // 预测结果：
    const warpper = html => `<li class="breadcrumb-item">${html}</li>`
    const breadcrumbLinkResult = {}
    breadcrumbLinkResult.readme = warpper('<a href="/">开发 SMARTY_PRESS 测试文件</a>')
    breadcrumbLinkResult.test = warpper('<a href="/test.md">Test</a>')
    breadcrumbLinkResult.xyzRoot = warpper('xyz') // 不存在 README.md，使用 treeNode 的路径
    breadcrumbLinkResult.xyzAd = warpper('<a href="/xyz/ad.md">广告页面</a>')

    // 初始化 
    await provider.patch(testFiles)
    expect(provider
        .fileNodes()
        .map(item => item.breadcrumb.html)
        .join(', ')
    ).toBe([
        breadcrumbLinkResult.readme,
        `${breadcrumbLinkResult.readme}${breadcrumbLinkResult.test}`
    ].join(', '))

    // 增加文件
    testFiles.push('xyz/ad.md') // 有标题文件
    await provider.patch(testFiles)
    expect(provider
        .fileNodes()
        .map(item => item.breadcrumb.html)
        .join(', ')
    ).toBe([
        breadcrumbLinkResult.readme,
        `${breadcrumbLinkResult.readme}${breadcrumbLinkResult.test}`,
        `${breadcrumbLinkResult.readme}${breadcrumbLinkResult.xyzRoot}${breadcrumbLinkResult.xyzAd}`
    ].join(', '))

    // 删除文件
    testFiles.pop()
    await provider.patch(testFiles)
    expect(provider
        .fileNodes()
        .map(item => item.breadcrumb.html)
        .join(', ')
    ).toBe([
        breadcrumbLinkResult.readme,
        `${breadcrumbLinkResult.readme}${breadcrumbLinkResult.test}`
    ].join(', '))

    // 文件修改
    await updateTestFile('# Hello World\nFoo Bar!')
    await provider.patch(testFiles)
    expect(provider
        .fileNodes()
        .map(item => item.breadcrumb.html)
        .join(', ')
    ).toBe([
        breadcrumbLinkResult.readme,
        `${breadcrumbLinkResult.readme}${warpper('<a href="/test.md">Hello World</a>')}`
    ].join(', '))

    // 文件复原
    await updateTestFile()
})
