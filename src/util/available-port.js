/**
 * 检测端口号
 * @param { number } port 端口号
 * @returns Promise<number | Error>
 */
function listenPort(port) {
  if (port < 0 || port > 65535) {
    throw new RangeError("Invalid port");
  }
  return new Promise((resolve) => {
    const service = require("net").createServer().listen(port);
    service.on("listening", (client) => {
      service.close();
      resolve(port);
    });

    service.on("error", (err) => {
      if (err.code == "EADDRINUSE") {
        resolve(err);
      }
    });
  });
}

/**
 * 获取一个可用的端口号
 * @param { number } port 端口号
 * @param { () => void } callback 回调函数
 */
async function getAvailablePora(port, callback) {
  let avaliable = port;
  let isAvailable = await listenPort(port);
  if (isAvailable instanceof Error) {
    port++;
    avaliable = getAvailablePora(port, callback);
  } else {
    callback(port);
  }
  return avaliable;
}

module.exports = getAvailablePora;
