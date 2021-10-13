const path = require("path");
const ssr = require("../src/ssr");
const fs = require("fs");
const { getFolder } = require("../src/menu");
const provider = require("../src/markdown");
const glob = require('glob')

// 替换 a href=**/README.md /index.html
const replaceKeyword = (body) => {
  return body.replace(/(<a.*?href\=)(.*?)(>.*?<\/a>)/g, (math, $1, $2, $3) => {
    return `${$1}${$2
      .replace("/README.", "/index.")
      .replace(".md", ".html")}${$3}`;
  });
};

const makeFiles = async (provider, options) => {
  // 获取所有源码文件
  const files = [];
  Object.keys(provider.nodes).forEach((nodeName) => {
    const node = provider.nodes[nodeName];
    if (node.isFileNode) {
      // 文件节点
      delete provider.nodes[node.path];
      node.path = node.path
        .replace("README.", "index.")
        .replace(".md", ".html");
      provider.nodes[node.path] = node;
      files.push(node.path);
    } else {
      // 目录节点，依次创建目录结构
      const folderPath = provider.distPath(node.path);
      !fs.existsSync(folderPath) && fs.mkdirSync(folderPath);
    }
  });

  // 根据文件记录，依次生成静态
  let reqFile = files.shift();

  while (reqFile) {
    // 判断是否存在自定义模板
    let template = path.resolve(options.root, "./template/App.vue");
    if (fs.existsSync(template)) {
    } else {
      template = ssr.template;
    }
    console.log("使用自定义模板:" + template);

    const body = await ssr.renderMarkdown({
      reqFile,
      provider,
      template,
      options,
    });
    fs.writeFileSync(
      provider.distPath(reqFile),
      `<!DOCTYPE html>${replaceKeyword(body)}`,
      {
        encoding: "utf-8",
      }
    );
    console.log(`  ${reqFile}`);
    reqFile = files.shift();
  }
};

/**
 * 目录拷贝
 * @param {*} from 源文件目录
 * @param {*} to 目标文件目录
 */
function copyDir(from, to) {
  // 目录不存在，则创建
  !fs.existsSync(to) && fs.mkdirSync(to);
  // 遍历拷贝
  fs.readdirSync(from).forEach((file) => {
    // 遍历目录
    const relativePath = `${from}/${file}`;
    const toFile = `${to + "/" + file}`;
    if (fs.lstatSync(relativePath).isDirectory()) {
      // 如果是目录，则继续遍历
      copyDir(relativePath, `${to + "/" + file}`);
    } else {
      // 复制资源文件
      console.log(` ${relativePath}`);
      fs.copyFileSync(relativePath, toFile);
    }
  });
}

/**
 * Assets文件拷贝
 * @param {*} sourcePath source文件位置
 * @param {*} param1
 */
function copyAssets(sourcePath, { assetsPath, distPath }) {
  // 复制src文件到dist
  const from = assetsPath(sourcePath);
  const to = distPath(sourcePath);
  console.log("复制assets", from, to);
  copyDir(from, to);

  // 复制markdown文件到dist
  const 

}

module.exports = async function (
  options = {
    theme: "default",
    root: path.resolve("."),
    output: path.resolve("dist"),
  }
) {
  console.log(
    [
      "生成静态文件：",
      `源码目录: ${options.root}`,
      `输出目录: ${options.output}`,
    ].join("\n  ")
  );

  // 分析源码

  provider.resolvePath = (filePath) => path.resolve(options.root, filePath);
  provider.distPath = (filePath) => path.resolve(options.output, filePath);
  provider.assetsPath = (filePath) =>
    path.resolve(__dirname, "../src/", filePath);

  await provider.patch(await getFolder(options.root));

  // 如果不存在输出目录，则创建
  !fs.existsSync(options.output) && fs.mkdirSync(options.output);

  // 复制 asssets 文件
  console.log("文件复制：");

  console.log("代码模板文件copy");

  // 复制源码仓库中的assets文件
  copyAssets("assets", provider);



  // 生成静态
  console.log("生成静态HTML文件:");
  await makeFiles(provider, options);

  console.log("生成完毕");
};
