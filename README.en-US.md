English | [简体中文](./README.md)
# Smart-Press
- Fast and efficient Markdown website making tool
- Based on Vue3.0 SSR technology
## Weixin

![qrcode](assets/qrcode-2216750.JPG)


## Getting Started
Manually
```bash
# install 
npm install smarty-press -g

# start to writing 
spress start

# build to html
spress build

```


## Development

```js
# clone first
npm link
cd demo
spress start
```

```bash
yarn add vue@3.0.0

```
### Plugin Development
see[dedicated section in docs.](https://github.com/su37josephxia/smarty-press/tree/master/src/markdown/provider/__test_files__/)

# Subject library

## MarkDown

http://zhongce.sina.com.cn/article/view/18867

## The menu template

* default： AdminLTE 
* todo:
    *  Menu free configuration function

## Documentation

### Usage
* Step. 1 Create and change into a new directory.
```bash
mkdir hello-smarty-press && cd hello-smarty-press
```

* Step. 2 Initialize with your preferred package manager.
```bash
yarn init
```

* Step. 3 Install `smarty-press` locally (**if you already install by global, can skip this step**)
```bash
yarn add --dev smarty-press
```

* Step. 4 create `README.md` file
```bash
touch README.md
```

* Step. 5 write content to `README.md`
```markdown
# How to use SmartyPress
## Install

## Usage
```

* Step. 6 Add some scripts to package.json (**if install by global，you can skip this step**)
```json
{
  "scripts": {
    "start": "spress start",
    "build": "spress build"
  }
}
```

* Step. 7 start local server
```bash
yarn start
```
**if install by global，you should use the following command**
```bash
spress start
```

* Step. 8 building The Docs
```bash
yarn build
```
**if install by global，you should use the following command**
```bash
spress build
```
