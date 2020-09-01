it('autoNumber', () => {
    const autoNumber = require('../index')

    const md = `
# 标题
## 小标题
## 小标题
# 标题
## 小标题
    `
    expect(autoNumber(md)).toMatch(`
# 一、标题
## 1.小标题
## 2.小标题
# 二、标题
## 1.小标题`)
    


})