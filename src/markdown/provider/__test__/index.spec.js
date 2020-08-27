const path = require('path')
const FileNode = require('../FileNode')
const fs = require('fs')

const testFile = 'test.md' //测试文件
const options = { // 公共参数
    resolvePath(filePath) {
        return path.join(__dirname, filePath)
    }
}

it('FileNode 路径测试', () => {
    expect(new FileNode(testFile, options).realPath)
        .toBe(path.join(__dirname, testFile))
})

it('FileNode 读取文件内容', () => {
    expect(new FileNode(testFile, options).body).toBe('# Test')
})

it('FileNode 文件修改测试', () => {

    const vFile = new FileNode(testFile, options)
    const body = '# Test'
    const newBody = '# Foobar'

    //修改前
    expect(vFile.hasChanged).toBe(false)
    expect(vFile.body).toBe(body)

    //修改测试
    fs.writeFileSync(vFile.realPath, newBody)
    expect(vFile.body).toBe(body) // 修改后，因为没有判断 hasChange，所以不会重新读取文件
    expect(vFile.hasChanged).toBe(true) // 监测到更新 
    expect(vFile.body).toBe(newBody) // 监测到更新 ，会自动读取文件内容
    expect(vFile.hasChanged).toBe(false) // 数据已经同步，再次监测不存在更新 

    //测试完修改回来
    fs.writeFileSync(vFile.realPath, body)
    expect(vFile.hasChanged).toBe(true) //同样会监测到更新
    expect(vFile.body).toBe(body) //内容也变回来了

})