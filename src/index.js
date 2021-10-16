const { createServer } = require("./devserver");
const { createMiddleware } = require("./menu");
const path = require("path");
const ssr = require("./ssr");
const fs = require("fs");
const provider = require("./markdown");
const availablePort = require("./util/available-port");

module.exports.startDev = async (
  options = {
    theme: "default",
    root: path.resolve("."),
    port: 3000,
  },
  callback = (port) => {}
) => {
  const app = createServer({
    watchFolder: options.root,
  });

  // 获取文件目录
  provider.resolvePath = (filePath) =>
    path.resolve(options.root, "./" + filePath);

  app.use(createMiddleware(options));

  // 静态服务
  // app.use(KoaStatic('./assets'))
  app.use(async (ctx, next) => {
    if (ctx.url.indexOf("/assets") > -1) {
      try {
        // 判断是否存在此文件
        let assetsPath = path.resolve(__dirname, "./" + ctx.url)
        if(!fs.existsSync(assetsPath)) {
            assetsPath = path.resolve(options.root, "./" + ctx.url)
        }
        const buffer = fs.readFileSync(assetsPath);
        
        ctx.type = path.extname(ctx.url).slice(1);
        ctx.body = buffer;
      } catch (e) {
        ctx.body = "";
      }
    } else {
      await next();
    }
  });

  app.use(async (ctx, next) => {
    // 忽略favicon
    if (ctx.url === "/favicon.ico") {
      ctx.body = "";
      return;
    }
    await next();
  });

  app.use(async (ctx, next) => {
    await provider.patch(ctx.menu);
    const {
      request: { url, query },
    } = ctx;
    const reqPath = url.split("?")[0];

    // 判断是否存在自定义模板
    let template = path.resolve(options.root, "./template/App.vue");
    if (fs.existsSync(template)) {
    } else {
      template = ssr.template;
    }
    // console.log('使用自定义模板:'+template)

    // markdown文件位置
    const reqFile =
      path.extname(reqPath) === "" ? reqPath + "/README.md" : reqPath;

    ctx.body = await ssr.renderMarkdown({
      reqFile,
      provider,
      template,
      options,
    });

    await next();
  });

  // 端口号被占用时,获取一个可用的端口号
  const port = await availablePort(options.port || 3000, callback);

  app.start(port, () => {
    console.log("app start at " + port);
  });
};
