---
title: promise连续调用的问题
tags:
  - vue
  - JS
  - ES6
---

### 问题的背景     
  最近在做自己的项目的时候,遇到了一个问题.我在组件里面监听了一个对象的变化.一旦发生变化.先通过这个对象的ID去进行异步请求.获取到一个属性:URL(播放地址).然后将这个属性绑定到audio的src属性上.然后再去利用this.$refs获取dom调用radio.play方法.
  <!-- more -->
### 代码

  ```js
   currentSong() {
                var v = this;
                v.loadSongUrl(id);
                v.$nextTick(() => {
                    v.$refs.audio.play();
                });
            },
  ```
### 遇见的问题
  vue异步请求成功之后,还没绑定数据就立即去执行获取dom元素了.

### 示意流程
  正确:  currentSong变化 -> 进行异步请求 -> 绑定数据到dom -> 获取dom
  错误:(遇到的情况)  currentSong变化  -> 进行异步请求 -> 获取dom ->绑定数据到dom


### 问题分析
   为什么会有这样的情况出现？其实这里是连续的异步调用.在第一次进行异步请求URL之后.在同步队列中.我的异步请求完成之后会加入到‘任务队列’中.所以会马上去执行同步队列的任务.
### 解决方法

  ```js
  v.loadSongUrl(id).then(()=>{
      v.$nextTick(() => {
                    v.$refs.audio.play();
        });
  })
  ```
  同时必须给loadSongUrl添加return:
  ```js
   return v.$axios.get('api/song/url', {
          params: {
              id: songsIds
          }
      }).then(response => {
          //console.log(response.data.data);
          if (response.data.code === 200) {
              songUrlList = response.data.data;
              //console.log(songUrlList);
              v.manageSongList(list,songUrlList);
          }
      }).catch(error => {
          console.log(error);
      });
  ```

### 原理
  在ES6中.有封装promise.then()方法.这个方法保证多个异步请求按序进行.回调函数中会把上一个then中返回的值当做参数值供当前then方法调用.then方法执行完毕后需要返回一个新的值给下一个then调用（没有返回值默认使用undefined）.也就是说.每个then只可能使用前一个then的返回值.有了这个方法.就能保证去获取dom之前.先去绑定dom的效果.
