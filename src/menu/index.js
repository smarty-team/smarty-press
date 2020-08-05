
const glob = require('glob')
const path = require('path')
function getFolder(scanPath) {
    return glob.sync(
        path.join(scanPath,'/**/*.md'),
        {
            absolute: false,

        }
    )
        .map(
            v => path.relative(scanPath, v)
        )
        .filter(v => !v.startsWith('node_modules'))
}
module.exports.getFolder = getFolder
module.exports.createMiddleware = (option) => async (ctx,next) => {
    ctx.menu = getFolder(option.root)
    await next()
}