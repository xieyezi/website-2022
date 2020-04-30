---
title: Vue cli3+Hubuilder将项目打包为App
tags:
  - Vue
  - Hubuilder
---
### 前言
   现在跨平台的开发越发的火了起来。前端能做到的事情也越来越多，App再也不用完全依靠安卓原生开发了。现在开发app的方式都是内核是前端开发，然后再给项目套一个安卓的外壳，即可实现app的开发。
### Vue开发app如何打包？
   现在最新的脚手架为Vue-cli3,构建出来的项目结构十分明了简单。配置文件只需一个Vue.config.js即可搞定。<!-- more -->
    先到Vue.config.js里面添加：
    
    ``` JS
        module.exports = {
        // 选项...,
        baseUrl: './',
        devServer: {
            port: 8080, // 端口号
            host: 'localhost',
            https: false, // https:{type:Boolean}
            open: true, //配置自动启动浏览器
            // proxy: 'http://localhost:4000' // 配置跨域处理,只有一个代理
            proxy: {
                '/api': {
                    target: '',//后端接口地址
                    ws: true,
                    changeOrigin: true,//是否允许跨域
                    pathRewrite: {
                        '^/api': ''   //直接用'api/接口名'进行请求.
                    }
                }
            }  // 配置多个代理
        },
    };
    ```

   将`baseUrl`改为`'./'`
   然后用webpack将项目打包为dist文件.

   ![QQ20190226-174159@2x.png](https://i.loli.net/2019/02/26/5c750a692d307.png)

   打开Huilder
   点击打开目录
   找到刚刚的dist文件夹，取好项目名称。

   ![QQ20190226-174216@2x.png](https://i.loli.net/2019/02/26/5c750a8d8b32d.png)

   右点击项目，将项目转换为App

   ![QQ20190226-174241@2x.png](https://i.loli.net/2019/02/26/5c750e8683040.png)

   然后进行mainfest文件配置，制作app图标和启动页
   点击进行云打包进行打包

   ![QQ20190226-174303@2x.png](https://i.loli.net/2019/02/26/5c750ee452841.png)

   然后下载打包好之后的.apk文件即可。


