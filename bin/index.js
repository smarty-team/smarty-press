#!/usr/bin/env node
const program = require('commander')
program.version(require('../package').version)
const path = require('path')
const {promisify} = require('util')
const figlet = promisify(require('figlet'))
const clear = require('clear')
const chalk = require('chalk')
const log = content => console.log(chalk.green(content))
const {startDev} = require('../src/index')
const open = require("open")

program
    .command('start')
    .description('启动本地开发环境')
    .action(async () => {
        clear()
        const data = await figlet('Smart Press')
        log(data)

        // 启动开发服务器
        startDev({
            root : path.resolve('.')
        })

        // 打开浏览器
        open(`http://localhost:3000`);
    })


program
    .command('build')
    .description('编译页面文件(生成html)')
    .action(async () => {
        console.log('编译静态文件')
    })
program
    .command('publish')
    .description('发布文件到服务器')
    .action(async () => {
        console.log('发布文件到服务器')
    })

program.parse(process.argv)