const express = require('express')
const app = express()
const Vue = require('vue') // vue@next
const serverRenderer = require('@vue/server-renderer')
const compilerSsr = require('@vue/compiler-ssr')
const compilerSfc = require('@vue/compiler-sfc')
const fs = require('fs')
app.get('/', async function (req, res) {
    const { descriptor } = compilerSfc.parse(fs.readFileSync(__dirname + '/HelloWorld.vue', 'utf-8'))
    // console.log(descriptor.template.content)
    // console.log(descriptor.script.content)

    const data = () => ({
        count :0,
        msg: 'hello ssr'
    })

    const render = compilerSsr.compile(descriptor.template.content).code

    let vapp = Vue.createApp({
        // template: descriptor.template.content, // 写法一
        ssrRender: new Function('require',render)(require), // 写法二
        data
    })
    let html = await serverRenderer.renderToString(vapp)
    // html = ''
    html = `

        <div id="app"><button @click="count++">count is: {{ count }}</button></div>
        <script crossorigin="anonymous" integrity="sha384-By3cPqxThh0caEqh+N/Mz0GCmPpeAL1RGv5y/BcbLfgV0zdY77mQhL+SCZrKsp9m"
  src="https://lib.baomitu.com/vue/3.0.0-beta.24/vue.global.js"></script>
        <script> 
            let vm = Vue.createApp({
                name: 'HelloWorld',
                props: {
                  msg: String
                },
                data() {
                  return {
                    count: 5
                  }
                }
              }).mount( '#app',true)
              console.log('end')
        </script>
              
    `

    
    res.end(html)
})

app.listen(9093, () => {
    console.log('listen 9093')
}) 
