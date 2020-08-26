const path = require('path')

function resolvePath(filePath) {
    return path.join(__dirname, filePath)
}

it('markdown 单文件测试', () => {
    const { withTitle } = require('../index')

    expect(withTitle('README.md', resolvePath).name)
        .toBe('会了吧')
})

it('markdown 多文件测试', () => {
    const { withTitles } = require('../index')
    const list = [
        'README.md',
        'help/README.md',
        'help/1.md'
    ]
    expect(withTitles(list, resolvePath).map(item => item.name).join('; '))
        .toBe('会了吧; 会了吧使用教程; 会了吧 怎么下载')
})
