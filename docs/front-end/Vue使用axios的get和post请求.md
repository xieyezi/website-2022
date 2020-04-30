---
title: Vue使用axios的get和post请求
tags:
  - Vue
  - JS
---

### 安装axios

  [Axios](https://www.kancloud.cn/yunye/axios/234845) 是一个基于 promise 的 HTTP 库,可以用在浏览器和 node.js 中.
  - 从浏览器中创建 XMLHttpRequests
  - 从 node.js 创建 http 请求
  - 支持 Promise API
  <!-- more -->
  - 拦截请求和响应
  - 转换请求数据和响应数据
  - 取消请求
  - 自动转换 JSON 数据
  - 客户端支持防御 XSRF        


  我觉得在自动转换json数据这一点上深得我心.haha
  在vue.js中使用它之前须安装(这里只介绍npm安装):
  ```
  $ npm install axios
  ```
### 在vue项目中引入
  在vue项目中找到main.js,先引入:
  ```
  import axios from 'axios'
  ```
  再将其绑定到vue实例的原型对象上:
  ```
  Vue.prototype.$http = axios
  ```
### 在组件中执行get请求
  ```
  created(){
    this.$http.get("https://zhihu-daily.leanapp.cn/api/v1/last-stories")
    .then(res => {
      this.newsData = res.data.STORIES.stories;
      // console.log(res.data.STORIES.stories);
      console.log(this.newsData);
    })
    .catch(error => {
      console.log(error);
    });
  }
  ```
  在这里请求知乎日报接口,将接收的数据存放在名为newsData的数组里面
  ```
  data () {
   return {
     newsData:[]
   }
  },
  ```
  应用数据展示在前端页面
  ``` HTML
  <template>
    <div class="hello">
      <div class="news">
        <ul>
          <li v-for="news of newsData">
            <p>{{ news.title }}</p>
            <img :src="news.images[0]" alt="">
          </li>
        </ul>
      </div>
    </div>
  </template>
  ```
### 在组件中执行post请求
  ```
  created(){
    this.$http.post("https://www.apiopen.top/journalismApi")
    .then(res => {
      this.news = res.data;
      console.log(this.news.data.auto);
    })
    .catch(error => {
      console.log(error);
    })
  }
  ```
  在这里将接收的数据赋值给名为news的对象
  ```
  data(){
    return {
      news:''
    }
  },
  ```
  应用数据展示在前端页面
  ``` HTML
  <template lang="html">
    <div class="">
      <ul>
        <li v-for="item in news.data.auto">
           {{ item.title }}
           <br>
           <img :src="item.picInfo[0].url" alt="">
        </li>
      </ul>
    </div>
  </template>
  ```
