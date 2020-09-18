#!/usr/bin/env node
const program = require('commander')
program.version(require('../package').version)
const path = require('path')
const { promisify } = require('util')
const figlet = promisify(require('figlet'))
const clear = require('clear')
const { startDev } = require('../src/index')
const open = require("open")
const chalkAnimation = require('chalk-animation')
const build = require('./build')

program
    .command('start')
    .description('启动本地开发环境')
    .usage('[options] root-path')
    .option('-t, --theme [theme]', 'Markdown样式，可选 default、techo')
    .option('-p, --port [port]', '监听端口')
    .action(async (options) => {
        clear()
        console.log('')
        console.log('')

        const data = await figlet('Smart Press')
        chalkAnimation.rainbow(data).start()

        // 启动开发服务器
        startDev({
            theme: options.theme || 'default',
            port: options.port || 3000,
            root: path.resolve(options.args.length > 0 ? options.args[0] : '.')
        })

        // 打开浏览器
        open(`http://localhost:3000`);
    })

program
    .command('build')
    .description('编译页面文件(生成html)')
    .option('-t, --theme [theme]', 'Markdown样式，可选 default、techo')
    .option('-o, --output [output]', '输出目录')
    .action(async (options) => {
        console.log('')

        // 生成静态
        await build({
            theme: options.theme || 'default',
            root: path.resolve(options.args.length > 0 ? options.args[0] : '.'),
            output: path.resolve(options.output || 'dist')
        })

        process.exit()
    })

program
    .command('publish')
    .description('发布文件到服务器')
    .action(async () => {
        console.log('发布文件到服务器')
    })

program.parse(process.argv)