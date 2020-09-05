module.exports = require('./provider')(
    require('./title'), // 解析标题
    require('./prefix'), // 标题缩进
    require('./breadcrumb'),   // 计算面包屑
    require('./autoNumber'),  // 自动生成序号
    require('./marked'),  // markdown转html
    require('./themes')   // 添加样式
)