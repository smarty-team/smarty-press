const fs = require('fs')

const README_FILE = 'README.md'


// 批量获取标题
function withTitles(paths, resolvePath) {

  // 路径排序，README.md 放最前面
  paths.sort((a, b) => {
    if (a == README_FILE || b == README_FILE) {
      //README.md放在最前面
      return a == README_FILE ? -1 : 1
    } else if (a.indexOf(README_FILE) > 0 && b.startsWith(a.substr(0, a.indexOf(README_FILE)))) {
      //路径 a 中存在 README.md，并且路径前面相等
      return -1
    } else if (b.indexOf(README_FILE) > 0 && a.startsWith(b.substr(0, b.indexOf(README_FILE)))) {
      //路径 b 中存在 README.md，并且路径前面相等
      return 1
    } else {
      return a.localeCompare(b)
    }
  });

  // 排序后分析标题
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
    name: match ? match[1].trim() : path,
    prefix: path.split('/').map(item => '').join('　')
  }
}

module.exports = {
  withTitle,
  withTitles
}