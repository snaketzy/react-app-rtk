/**
 * 新版react在package.json中的代理设置不再支持对象，官方推荐使用此插件。
 * 注：
 * 1. http-proxy-middleware最新版本要使用createProxyMiddleware方式创建。
 * 2. 文件名只能是setupProxy，否则无法请求。
 * 3. 如果通过node请求的是域名（比如: http://xxxxxx.com）而非ip地址，
 *    此时需要加上 changeOrigin: true  否则node无法请求。
 */
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/home-server",
    createProxyMiddleware({
      target: "https://presettlement.viphrm.com",
      changeOrigin: true
    })
  );
  app.use(
    "/permissionServer",
    createProxyMiddleware({
      target: "https://presettlement.viphrm.com",
      changeOrigin: true
    })
  );
  app.use(
    "/mossUserCenter",
    createProxyMiddleware({
      target: "http://premoss.viphrm.com",
      changeOrigin: true
    })
  );
  app.use(
    "/makerServer",
    createProxyMiddleware({
      target: "http://premoss.viphrm.com",
      changeOrigin: true
    })
  );
  //
  app.use(
    "/filemanager",
    createProxyMiddleware({
      target: "https://presettlement.viphrm.com",
      changeOrigin: true
    })
  );
  app.use(
    "/roster",
    createProxyMiddleware({
      target: "https://presettlement.viphrm.com",
      changeOrigin: true
    })
  );
  app.use(
    "/started",
    createProxyMiddleware({
      target: "https://presettlement.viphrm.com/api/customer",
      changeOrigin: true
    })
  );
  app.use(
    "/fee",
    createProxyMiddleware({
      target: "https://presettlement.viphrm.com",
      changeOrigin: true
    })
  );
};
