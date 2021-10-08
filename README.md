简体中文| [English](./README.en-US.md)
# Smart-Press
- 快速高效的 Markdown 网站制作工具
- 基于 Vue3.0 SSR 技术

## 钉钉交流群


## 起步

Manually
```bash
# install 
npm install smarty-press -g

# start to writing 
spress start

# build to html
spress build

```

## 使用

```bash
# 在项目文件夹中新建主页文件README.md,其它的md文件会当作它的次级目录,内容的编译使用markdown语法,并且是实时的

# 生成网页的目录数量与md文件的数量相对应,有几个目录就有几个md文件

# 目录的名称是对应文件的一级标题
```

## 开发

```js
# clone first
npm link
cd demo
spress start
```

```bash
yarn add vue@3.0.0

```

###  插件开发   

请[参阅插件开发文档。](https://github.com/su37josephxia/smarty-press/tree/master/src/markdown/provider/__test_files__/)


# 主题库

## MarkDown

http://zhongce.sina.com.cn/article/view/18867

## 菜单模板

* 默认：采用 AdminLTE 
* 开发中:
    * 菜单自由配置功能

## 文档

### 使用
* Step. 1 新建并进入文件夹
```bash
mkdir hello-smarty-press && cd hello-smarty-press
```

* Step. 2 使用你喜欢的包管理器进行初始化
```bash
yarn init
```

* Step. 3 本地安装`smarty-press` (**如果已经全局安装过了，可以跳过这一步**)
```bash
yarn add --dev smarty-press
```

* Step. 4 创建`README.md`文件
```bash
touch README.md
```

* Step. 5 写入文档内容
```markdown
# SmartyPress 入门
## 安装

## 使用
```

* Step. 6 在`package.json`中添加脚本 (**如果是全局安装，可以跳过这一步**)
```json
{
  "scripts": {
    "start": "spress start",
    "build": "spress build"
  }
}
```

* Step. 7 启动本地开发服务
```bash
yarn start
```
**如果是全局安装，则使用以下命令**
```bash
spress start
```

* Step. 8 构建文档
```bash
yarn build
```
**如果是全局安装，则使用以下命令**
```bash
spress build
```
