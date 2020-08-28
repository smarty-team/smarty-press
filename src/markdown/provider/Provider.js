const path = require('path')
const FileNode = require('./FileNode')
const TreeNode = require('./TreeNode')

class Provider {

    constructor() {
        this.root = new TreeNode('') // 从这里开始可以得到所有子节点
        this.nodes = { // 缓存下，方便 遍历执行 中间件
            [this.treeKey('')]: this.root
        }
        this.middlewares = []
        this.resolvePath = (filePath) => path.join(__dirname, filePath)
    }

    toArray(formatNode, parentNode) {
        const datas = []
        const _nodes = parentNode || this.root
        _nodes.children.forEach(childNode => {
            if (childNode.isFileNode) {
                datas.push(formatNode(childNode))
            } else if (childNode.children && childNode.children.length > 0) {
                this.toArray(formatNode, childNode).forEach(item => datas.push(item))
            }
        })
        return datas
    }

    getItem(reqFile, formatNode) {
        const filePath = this.formatFilePath(reqFile)
        return formatNode(filePath in this.nodes ? this.nodes[filePath] : null)
    }

    formatFilePath(filePath) {
        const tempPath = filePath.replace(/\/\//g, '\\')
        return tempPath.substr(0, 1) == '/' ?
            tempPath.substr(1) :
            tempPath
    }

    // patch
    async patch(filePaths) {
        const treeFlags = this.treeKey('')
        const newFiles = {}
        filePaths.forEach(filePath => {
            newFiles[this.formatFilePath(filePath)] = null
        })
        Object.keys(this.nodes)
            .filter(filePath => filePath.indexOf(treeFlags) == -1)
            .forEach(async (filePath) => {
                if (filePath in newFiles) {
                    await this.updateFile(filePath) //文件存在，更新
                    delete newFiles[filePath]
                } else {
                    await this.removeFile(filePath) //如果新文件不存在，删除
                }
            })
        Object.keys(newFiles).forEach(async (filePath) => {
            await this.addFile(filePath)
        })
    }

    // 获取tree节点key
    // 1、不能和 FileName的path重名
    // 2、方便和 .md文件 区分
    // 3、不能影响排序
    treeKey(path) {
        return `${path}/?`
    }

    //获取父节点
    getParent(filePath) {
        const filePaths = filePath.split(/\\|\//)
        filePaths.pop()
        const parentPath = filePaths.join('/')
        if (!(this.treeKey(parentPath) in this.nodes)) {
            this.nodes[this.treeKey(parentPath)] = this.getParent(parentPath).addChild(new TreeNode(parentPath))
        }
        return this.nodes[this.treeKey(parentPath)]
    }

    // 添加 文件
    //!<TreeNode: {/:}> 
    //   |- <FileNode {README.md}>
    //!  |- <TreeNode: {AAA/:}>
    //   |     |- <FileNode: {AAA/README.md}>
    //   |     |- <FileNode: {AAA/1.md}>
    async addFile(filePath) {
        if (!(filePath in this.nodes)) {
            const fileNode = this.nodes[filePath] = new FileNode(filePath, {
                resolvePath: this.resolvePath
            })
            this.getParent(filePath).addChild(fileNode)
            await this.applyMiddleware(fileNode, 'add')
        }
    }

    // 删除 vFile
    async removeFile(filePath) {
        if (filePath in this.nodes) {
            const fileNode = this.nodes[filePath]
            fileNode.parent.removeChild(fileNode)
            delete this.nodes[filePath]
        }
    }

    //更新 vFile
    async updateFile(filePath) {
        const fileNode = this.nodes[filePath]
        if (fileNode.hasChanged) {
            await this.applyMiddleware(fileNode, 'update')
        }
    }

    // 增加 中间件
    useMiddleware(middleware) {
        this.middlewares.push(middleware)
    }

    // 批量对 vFile 执行中间件
    async applyMiddleware(fileNode) {
        fileNode.init()
        const _middlewares = [...this.middlewares]
        const next = async () => {
            if (_middlewares.length > 0) {
                return await _middlewares.shift()({
                    provider: this,
                    fileNode
                }, next)
            }
        }
        return await next()
    }
}

module.exports = Provider