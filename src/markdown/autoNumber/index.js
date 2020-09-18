module.exports = async ({ fileNode }, next) => {
  const { body, list } = analysisTitle(fileNode.body)
  fileNode.catalogs = list
  fileNode.body = body
  await next()
}

function analysisTitle(body) {
  const arr = body.split('\n')
  let number = {
    h1: 0,
    h2: 0,
  }
  let beforTag = ''
  let contentsData = {
    list: [],
    last: null
  }
  const ret = arr.map(v => {
    if (v.startsWith('## ')) {
      number.h1 += 1
      let serialNumber = customChieseNumber(number.h1)
      v = v.replace('## ', `## ${serialNumber}、`)
      beforTag = '##'

      // 保存目录
      contentsData.list.push(createCatalogNode(v))
      contentsData.last = contentsData.list[contentsData.list.length - 1].children
    } else if (v.startsWith('### ')) {
      if (beforTag === '###') {
        number.h2 += 1
      } else {
        number.h2 = 1
      }
      v = v.replace('### ', `### ${number.h2}. `)
      beforTag = '###'
      contentsData.last.push(createCatalogNode(v)) // 保存目录
    }
    return v
  })
  return {
    list: contentsData.list,
    body: ret.join('\n')
  }
}

function customChieseNumber(number) {
  if (number > 999) {
    throw new Error('Numbers less than 1000 are supported')
  }
  const base = {
    0: '零',
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
    7: '七',
    8: '八',
    9: '九',
  }
  // 将数字转为数字字符串
  let numString = number.toString()

  // 解析10一下的序号
  if (number < 10) {
    switch (number.length) {
      case 2:
        return `零${base[Number(number)]}`
      case 3:
        return `千${base[Number(number)]}`
      default:
        return base[Number(number)]
    }
  }
  // 解析10到20的序号
  if (number >= 10 && number < 20) {
    return ('十' + base[numString[1]]).replace(/(.*)零$/, '$1')
  }
  // 解析20到100的序号
  if (number >= 20 && number < 100) {
    return numString
      .split('')
      .map(v => customChieseNumber(v))
      .join('十')
      .replace(/(.*)零$/, '$1')
  }
  // 解析100到1000的序号
  if (number >= 100 && number < 1000) {
    let prefix = customChieseNumber(numString.substr(0, 1)) + '百'
    let suffix =
      numString.substr(1) == 0
        ? ''
        : numString.substr(1) >= 10 && numString.substr(1) < 20
          ? '一' + customChieseNumber(numString.substr(1))
          : customChieseNumber(numString.substr(1))
    return prefix + suffix
  }
}

function createCatalogNode(title) {
  return {
    title: title.replace(/#/g, '').trim(),
    children: [],
    hash: title
  }
}