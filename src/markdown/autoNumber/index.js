const cheerio = require('cheerio')
const h1 = [
    '零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五',
]



module.exports = markdown => {
    const ary = markdown.split('\n')
    const number = {
        h1: 0,
        h2: 0
    }
    const ret = ary.map((v, i) => {
        if (v.startsWith('# ')) {
            // h2清零
            number.h2 = 0

            return v.replace('# ', `# ${h1[++number.h1]}、`)
        }

        if (v.startsWith('## ')) {
            return v.replace('## ', `## ${++number.h2}.`)
        }
    })

    return ret.join('\n')
}

