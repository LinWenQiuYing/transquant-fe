const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/tqcode/192.168.100.111/8893/", {
      target: "http://172.18.192.78:8089",
      changeOrigin: true,
      secure: false,
      ws: true,
    })
  );
  // 16环境：   172.16.120.16     /mnt/disk1/transquant2_nginx/html
  // 17环境：   172.16.120.17     /mnt/disk1/transquant2_nginx/html
  // 78环境：   172.18.192.78     /mnt/disk1/transquant3_nginx/html
  // 81环境     172.18.192.81    /mnt/disk2/transquant4_nginx/html

  // 测试环境：  172.16.120.15     /mnt/disk1/transquant3_nginx/html
  // 中金环境：  172.18.192.67    /mnt/disk1/transquant1_nginx/html
  // dev环境：  172.18.192.79    /mnt/disk1/transquant2_nginx/html

  app.use(
    createProxyMiddleware("/tqlab", {
      // target: "http://172.16.120.15:8089",
      // target: "http://172.16.120.17:8089",
      // target: "http://172.18.192.81:18081",
      // target: "http://172.18.192.78:8089",
      target: "http://172.18.192.74:8089",
      // target: "http://172.18.192.76:18081",
      changeOrigin: true,
      secure: false,
    })
  );

  // 用户、团队、部门等模块代理服务
  app.use(
    createProxyMiddleware("/tquser", {
      // target: "http://172.16.120.15:8089",
      // target: "http://172.16.120.17:8089",
      // target: "http://172.18.192.78:8089",
      target: "http://172.18.192.74:8089",
      // target: "http://172.18.192.76:18086",
      changeOrigin: true,
      secure: false,
    })
  );
  // scheduler
  app.use(
    createProxyMiddleware("/tqdata", {
      // target: "http://172.16.120.15:8089",
      // target: "http://172.16.120.17:8089",
      // target: "http://172.18.192.78:8089",
      target: "http://172.18.192.74:8089",
      changeOrigin: true,
      secure: false,
    })
  );

  app.use(
    createProxyMiddleware("/tcserver", {
      target: "http://172.18.128.115:18088/", // nginx服务器
      changeOrigin: true,
      secure: false,
    })
  );
};
