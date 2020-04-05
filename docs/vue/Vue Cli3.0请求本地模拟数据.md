---
title: Vue-cli 3.0请求本地模拟数据
tags:
  - Vue
  - JS
---

### 升级的前后

  很多时候,我们在一个项目的开发阶段,需要用到本地的模拟数据.在3.0以前的版本,在项目的根目录下有一个webpack.dev.conf.js文件可以提供给开发者进行配置,但是现在升级之后,3.0的版本目录结构比以前精简很多,没有了这个文件,那么在这个版本我们怎么请求本地的模拟数据呢？
  <!-- more -->

### 请求本地模拟数据

  1. 将模拟数据源文件放置到根目录下(data.json)   


  ![data.json](http://wx2.sinaimg.cn/mw690/89296167gy1fw423ia7kej20xu0w00z6.jpg "文件位置")


  2. 在根目录下新建vue.config.js文件,并添加如下代码:    




  ``` js
  // vue.config.js
    const express = require('express') //引入express框架
    const app = express() //实例化对象
    var appData = require('./data.json') //引入存放数据的json
    var seller = appData.seller;//取出数据
    var goods = appData.goods;
    var ratings = appData.ratings;
    var apiRoutes = express.Router(); //引入路由
    app.use('/api',apiRoutes)
    module.exports = {
      // 选项...
      devServer: {
      //模拟数据开始
          before(app) {
              app.get('/api/seller', (req, res) => {
                  res.json({
                      // 这里是你的json内容
                      errno: 0,
                      data: seller
                  })
              }),
              app.get('/api/goods', (req, res) => {
                  res.json({
                      // 这里是你的json内容
                      errno: 0,
                      data: goods
                  })
              }),
              app.get('/api/ratings', (req, res) => {
                  res.json({
                      // 这里是你的json内容
                      errno: 0,
                      data: ratings
                  })
              })
          }
      }
    }

  ```
  从上面的代码可以看出,我们便可以通过'/api/seller'这个接口请求到本地的模拟数据
  3. 取出数据         


  在任意一个组件内,利用axios进行请求:
  ```js
  created(){
    this.$axios.get("/api/seller")
    .then(res => {
      console.log(res.data);
    })
    .catch(error => {
      console.log(error);
    });
  }
  ```
  我们就可以拿到本地的模拟数据了:
  ![data.json](http://wx2.sinaimg.cn/mw690/89296167gy1fw41qkqekwj20uy0uqwlr.jpg "文件位置")
