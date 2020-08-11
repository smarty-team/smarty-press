
const http = require('http')
const Koa = require('koa')
const io = require('socket.io')
const watch = require('watch')
const ora = require('ora')
const { pathToFileURL } = require('url')
const path = require('path')
const clear = require('clear')
const createServer = (options = {
    watchFolder: '.'
}) => {
    const app = new Koa()
    const server = http.createServer(app.callback());
    var socket = io.listen(server);
    const process = ora('🚚Listen Dir : ' + path.resolve(options.watchFolder))
    socket.on('connection', function (client) {
        // console.log('网页监听....')
        clear()
        process.start()
        // clients.push(client)
    });

    watch.watchTree(options.watchFolder, f => {
        process.stop()
        console.log('reload...page')
        socket.emit('reload', f)
        process.start()
    })

    app.use(async (ctx, next) => {
        await next()
        
        if (ctx.type === ('text/html')) {
            ctx.body = `
            <!DOCTYPE html>
          <html>
          <body>
              ${ctx.body}
              <script src="https://cdn.bootcss.com/socket.io/2.2.0/socket.io.js"></script>
              <script>
              var socket = io();
              socket.on("reload", function(msg) {
                window.location.reload();
              });
              console.log('Live reload enabled.');
              </script>
          </body>
          </html>
          `
        }
    }
    )

    return {
        start: (port = 3000) => {
            server.listen(port, () => {
                console.log('Smarty Press Start At ' + port)
            })
        },
        use: (...args) => {
            app.use(...args)
        }
    }

}
module.exports.createServer = createServer