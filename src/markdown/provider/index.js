const Provider = require('./Provider')

const provider = new Provider() // Markdown Provider

provider.useMiddleware(require('../title')) //解析标题

module.exports = provider