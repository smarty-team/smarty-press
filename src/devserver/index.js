
const http = require('http')
const Koa = require('koa')
const io = require('socket.io')
const watch = require('watch')
const path = require('path')
const ProgressBar = require('ascii-progress');
const ansi = require('ansi')
const cursor = ansi(process.stdout)

const createServer = (options = {
    watchFolder: '.'
}) => {
    const app = new Koa()
    const server = http.createServer(app.callback());
    var socket = io.listen(server);

    socket.on('connection', function () {
        // console.log('网页监听....')
    });

    watch.watchTree(options.watchFolder, f => {
        cursor.goto(0, 10)
        cursor.yellow().horizontalAbsolute(0).eraseLine().write('🚀 Reloading the page...')
        cursor.reset()
        cursor.green().goto(0, 11)

        const bar = new ProgressBar({
            schema: ':bar :percent :elapseds :etas',
            blank: '░',
            filled: '█',
            total: 5,
        });

        const iv = setInterval(function () {
            bar.tick();
            if (bar.completed) {
                clearInterval(iv);
            }
        }, 10);

        socket.emit('reload', f)
    })

    app.use(async (ctx, next) => {
        await next()

        if (ctx.type === ('text/html')) {
            ctx.body = `
            <!DOCTYPE html>
          <html>
            <script src="https://cdn.bootcss.com/socket.io/2.2.0/socket.io.js"></script>
                <script>
                var socket = io();
                socket.on("reload", function(msg) {
                    window.location.reload();
                });
                console.log('Live reload enabled.');
            </script>
              ${ctx.body}
          </html>
          `
        }
    }
    )

    return {
        start: (port = 3000) => {
            server.listen(port, () => {
                console.log('Smarty Press Start At ' + port)
                console.log('🚚Listen Dir : ' + path.resolve(options.watchFolder))
            })
        },
        use: (...args) => {
            app.use(...args)
        }
    }

}
module.exports.createServer = createServer