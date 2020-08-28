# 开发 SMARTY_PRESS 测试文件

如果涉及文件修改，请测试 test.md

## 关于文件

### 文件目录

请在 src/markdown/ 目录下新建文件夹，每个文件夹对应一个中间件

```
src
|-- markdown/ Markdown文件相关
|    |-- provider  Markdown Provider
|    |    |-- index.js  中间件在这里注册
|    |    |-- __test_files__  测试数据
|    |    |       |-- index.js  测试函数封装
|    |    |       |-- *.md、*/*.md  各种不规则的Markdown格式的文件测试
|    |-- title                  Title中间件
|    |    |-- title             Title中间件
|    |    |-- __test__          jest测试文件
  
```



## 插件开发说明

### 中间件代码

比如：获取标题中间件（ src/markdown/title/index.js ），代码如下：

```javascript
// src/markdown/title/index.js

module.exports = async ({ fileNode }, next) => {
  const match = /^#\s?([^#\n\r]*)/.exec(fileNode.body)
  fileNode.title = match ? match[1].trim() : fileNode.path
  await next()
}
```

### 注册markdown中间件

在 src/markdown/provider/index.js 中添加

```javascript
// src/markdown/provider/index.js
provider.useMiddleware(require('../title')) //解析标题
```

### jest 测试文件

为了避免测试文件过多，md测试文件请使用 `../../provider__test_files__` 中的文件

如果符合条件的测试文件不存在，可以直接在 `../../provider__test_files__` 中创建

需要的方法直接从 `../../provider/__test_files__/index.js` 引入，比如 解析 文件路径 的resolvePath

测试文件必须至少包含 单文件调用测试、注册中间件 方式测试两种方式，其中注册中间件方式必须包含：初始化、增加文件、删除文件、文件修改等场景的测试代码

下面是一个简单的测试例子：获取标题中间件 `src/markdown/title/__test__/index.spec.js`

```javascript
// src/markdown/title/__test__/index.spec.js

const {
    Provider,
    FileNode,
    resolvePath,
    testFile,
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
    await provider.patch(testFiles)
    expect(provider
        .fileNodes()
        .map(item => item.title)
        .join(', ')
    ).toBe("Test")

    // 增加文件
    testFiles.push('abc/123/README.md') // 有标题文件
    testFiles.push('abc/123/test.md') // 无标题文件
    await provider.patch(testFiles)
    expect(provider
        .fileNodes()
        .map(item => item.title)
        .join(', ')
    ).toBe("ABC_123_README, abc/123/test.md, Test")

    // 删除文件
    testFiles.pop()
    await provider.patch(testFiles)
    expect(provider
        .fileNodes()
        .map(item => item.title)
        .join(', ')
    ).toBe("ABC_123_README, Test")

    // 文件修改
    await updateTestFile('# Hello World\nFoo Bar!')
    await provider.patch(testFiles)
    expect(provider
        .fileNodes()
        .map(item => item.title)
        .join(', ')
    ).toBe("ABC_123_README, Hello World")

    // 文件复原
    await updateTestFile()
})


```

