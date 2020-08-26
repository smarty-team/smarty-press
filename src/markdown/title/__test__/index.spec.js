const path = require('path')
const { withTitle, withTitles } = require('../index')

function resolvePath(filePath) {
    return path.join(__dirname, filePath)
}

it('markdown 单文件标题测试', () => {
    expect(withTitle('README.md', resolvePath).name)
        .toBe('会了吧')
})

it('markdown 多文件标题测试', () => {
    const list = [
        'README.md',
        'help/README.md',
        'help/1.md'
    ]
    expect(withTitles(list, resolvePath).map(item => item.name).join('; '))
        .toBe('会了吧; 会了吧使用教程; 会了吧 怎么下载')
})

it('markdown 多文件标题测试排序', () => {
    const list = [
        'help/1.md',
        'help/README.md',
        'README.md'
    ]
    expect(withTitles(list, resolvePath)
        .map(item => item.name)
        .join('; '))
        .toBe('会了吧; 会了吧使用教程; 会了吧 怎么下载')
})

it('markdown 单文件标题 根目录 缩进测试', () => {
    expect(withTitle('README.md', resolvePath).prefix)
        .toBe('')
})


it('markdown 单文件标题 二级目录 缩进测试', () => {
    expect(withTitle('help/README.md', resolvePath).prefix)
        .toBe('　')
})


it('markdown 多文件标题 缩进测试', () => {
    const list = [
        'README.md',
        'help/README.md',
        'help/1.md'
    ]
    expect(withTitles(list, resolvePath)
        .map(item => item.prefix)
        .join('; '))
        .toBe('; 　; 　')
})
