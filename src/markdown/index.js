module.exports = require('./provider')(
    require('./title'), // 解析标题
    require('./prefix'), // 标题缩进
    require('./marked'),  // markdown转html
    require('./themes')   // 添加样式
)