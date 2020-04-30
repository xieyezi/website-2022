---
title: Vue-cli 3.0解决跨域问题
tags:
  - Vue
  - JS
---

### 为什么要跨域？

  Vue.js真的是一个很好的前端框架.它很好地实现了前后端分离.但是在前后端分离的项目中,一般都会涉及到跨域请求的问题,那么什么是跨域？跨域指浏览器不允许当前页面所在的源去请求另一个源的数据.源指的是协议、端口、域名.只要这3个中有一个不同的就是跨域.  <!-- more -->

### Vue-cli 3.0怎么解决跨域问题？

  搞前端的朋友应该都知道,Vue官方在今年8月份左右更新了vue-cli(从2.0->3.0).脚手架的更新,使得vue项目的目录结构变得越来越简单,大量节省了程序员花在配置文件上的时间,在以前无法在项目初始化时自动初始化VueX,更新之后就可以了,甚至还支持Vue GUI,即是可以通过图形化界面新建Vue项目.那么说了这么多,我们到底怎么在3.0的版本上解决跨域问题呢？我去官网的文档上查看,官方文档至此还没完全翻译完全,以我这三脚猫的英语,实在难啃,不过还是解决了问题.
  在项目根目录创建vue.config.js文件,然后到这个文件添加:
  ``` JS
  // vue.config.js
  module.exports = {
    // 选项...
    baseUrl: '/',
    devServer: {
          port: 8080, // 端口号
          host: 'localhost',
          https: false, // https:{type:Boolean}
          open: true, //配置自动启动浏览器
          // proxy: 'http://localhost:4000' // 配置跨域处理,只有一个代理
          proxy: {
              '/api': {
                  target: 'url',//后端接口地址
                  ws: true,
                  changeOrigin: true//是否允许跨域
              }
          }  // 配置多个代理
    }
  }
  ```
  有了这段代码可刺激了,你就可以实现跨域请求到后台数据:
  ``` JS
  v.$axios.post('/api/index', {

     },{

     }).then((response) => {
       if(response.data.meta.code===200){
         console.log(response.data);
       }else{
         alert('系统异常')
       }
     })
  ```
  你就可以跨域项目源地址,到后台接口调数据,从而实现跨域.
