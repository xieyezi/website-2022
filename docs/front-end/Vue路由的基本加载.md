---
title: 路由的基本加载
tags:
  - Vue
  - JS
---

### Vue Router
  Vue Router 是 Vue.js 官方的路由管理器。它和 Vue.js 的核心深度集成，让构建单页面应用变得易如反掌。包含的功能有：
  - 嵌套的路由/视图表
  - 模块化的、基于组件的路由配置
  - 路由参数、查询、通配符
  - 基于 Vue.js 过渡系统的视图过渡效果
  <!-- more -->
  - 细粒度的导航控制
  - 带有自动激活的 CSS class 的链接
  - HTML5 历史模式或 hash 模式，在 IE9 中自动降级
  - 自定义的滚动条行为     

### 使用方法
  1.安装
  ```
  npm install vue-router
  ```
  2.引用
  ```
  import VueRouter from 'vue-router'
  Vue.use(VueRouter)
  ```
  3.配置路由文件(新建router文件夹,新建index.js文件)
  ```
  import Vue from 'vue'
  import VueRouter from "vue-router"
  import HelloWorld from '../components/HelloWorld'
  import Xie from '../components/xieyezi'

  Vue.use(VueRouter)

  export default new VueRouter({
    routes:[
      {
        path:"/",
        component:HelloWorld
      },
      {
        path:"/xieyezi",
        component:Xie
      }
    ]
  })
  ```
  4.注册路由(在main.js中注册)
  ```
  new Vue({
    el: '#app',
    components: { App },
    router,
    template: '<App/>'
  })
  此处的router即为注册了路由
  ```
  5.跳转(导航)
  ``` HTML
  <ul>
      <li>
        <router-link :to="urlData.HelloWorld">HelloWorld</router-link>
      </li>
      <li>
        <router-link :to="urlData.xieyezi">xieyezi</router-link>
      </li>
  </ul>
  ```
