module.exports = require('./provider')(
    require('./title'), // 解析标题
    require('./marked'),  // markdown转html
    require('./styles')   // 添加样式
)