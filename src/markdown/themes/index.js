const fs = require('fs')
const path = require('path')

const styles = {} // 样式

const themes = [ // 皮肤列表
  { name: '默认样式', file: 'mark.css' },
  { name: 'techo', file: 'techo.css' },
]

// 样式常驻内存，只在第一次读取
// TODO: 修改CSS后，重新读取样式并显示
themes.forEach(theme => addTheme(theme))

// Markdown 转 HTML
module.exports = async ({ fileNode }, next) => {
  //只有不存在的时候才添加属性
  if (!fileNode.themes) {
    fileNode.themes = themes
    fileNode.getTheme = (name) => {
      return styles[name in styles ? name : themes[0].name]
    }
  }
  await next()
}

function addTheme(theme) {
  const css = fs.readFileSync(path.join(__dirname, theme.file), {
    encoding: 'utf-8'
  })
  styles[theme.name] = {
    ...theme,
    css: css,
    html: `<style name="${theme.name}">${css}</style>`
  }
}