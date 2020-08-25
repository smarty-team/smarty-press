const fs = require('fs');

// 批量获取标题
function withTitles(paths, resolvePath) {
  return paths.map(path => withTitle(path, resolvePath))
}

// 获取单个markdown文件标题
function withTitle(path, resolvePath) {
  const match = /^#\s?([^#]*)/.exec(
    fs.readFileSync(resolvePath(path), {
      encoding: 'utf-8'
    }))
  return {
    path,
    name: match ? match[1] : path
  }
}

module.exports = {
  withTitle,
  withTitles
}