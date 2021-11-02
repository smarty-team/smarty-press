module.exports = async ({ fileNode }, next) => {
  const { body, list } = analysisTitle(fileNode.body)
  fileNode.catalogs = list
  fileNode.body = body
  await next()
}

function analysisTitle(body) {
  const arr = body.split('\n')
  const isHeadingReg = /^#+\x20/

  let numbers = {}
  let previousLevel = 1
  let contentsData = {
    list: [],
    last: null
  }
  
  const ret = arr.map((line, index, lines) => {
    if (!isHeadingReg.test(line)) {
      return line
    }

    let level = getHeadingLevel(line);
    if (level === 1) {
      return line
    }

    const diff = level - previousLevel;
    
    if (diff > 1) {
      level -= diff - 1
    }
    
    const levelKey = `h${level}`
    
    if (diff < 0) {
      Object.keys(numbers)
        .filter(key => Number(key.split('')[1]) > level)
        .forEach(key => {
            numbers[key] = 0
        })
    }
    if (typeof numbers[levelKey] === 'undefined') {
      numbers[levelKey] = 0
    }
    
    numbers[levelKey] += 1
    
    const serialNumber = level === 2
      ? customChieseNumber(numbers[levelKey]) + '、'
      : numbers[levelKey] + '. '
    line = line.replace(isHeadingReg, `${'#'.repeat(level)} ${serialNumber}`)
    
    if (level === 2) {
        contentsData.list.push(createCatalogNode(line))
        contentsData.last = contentsData.list[contentsData.list.length - 1].children
    } else {
        contentsData.last.push(createCatalogNode(line))
    }

    previousLevel = level

    return line
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

function getHeadingLevel(line) {
  const head = line.split(' ')
  return head[0].length
}