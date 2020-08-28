const Provider = require('./Provider')

module.exports = function(){
  const provider = new Provider()
  arguments.forEach(middleware=>{
    provider.useMiddleware(middleware)  
  })
  provider.useMiddleware(require('../title')) //解析标题
  return provider
}