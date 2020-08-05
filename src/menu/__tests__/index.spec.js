test ('menu getMdList',() => {
    const {getFolder} = require('../index')
    expect(getFolder(__dirname)).toContain(
        'test.md'
    )
})