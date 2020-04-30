---
title: Vue过渡与动画
tags:
  - Vue
  - JS
---

### 过渡

  Vue 在插入、更新或者移除 DOM 时,提供多种不同方式的应用过渡效果.
  包括以下工具：
  - 在 CSS 过渡和动画中自动应用 class
  - 可以配合使用第三方 CSS 动画库，如 Animate.css
    <!-- more -->
  - 在过渡钩子函数中使用 JavaScript 直接操作 DOM
  - 可以配合使用第三方 JavaScript 动画库，如 Velocity.js    


  注： 后面两种工具涉及到太多js的操作，一般来说很消耗内存，故不太多使用.    

### 单元素/组件的过渡

  Vue封装了transition的封装组件,可以为任何元素和组件添加进入/离开过渡
  - 条件渲染(v-if)
  - 条件展示(v-show)
  - 动态组件
  - 组件根节点     


  使用方法：
  template部分：
  ``` HTML
  <template lang="html">
   <div class="">
       <button type="button" name="button" v-on:click="showHide">过渡</button>
       <transition name="fade">
         <p v-show="show">哈哈</p>
       </transition>
   </div>
  </template>
  ```
  script部分：
  ``` JavaScript
  <script>
    export default {
      name:"anim",
      data(){
        return {
          show:true
        }
      },
      methods:{
        showHide(){
          this.show=!this.show;
        }
      }
    }
  </script>
  ```
  style部分：
  ``` CSS
  .fade-enter{
  opacity: 0;
  }
  .fade-enter-active{
    transition: opacity .5s;
  }
  .fade-enter-to{
    opacity: 1;
  }
  .fade-leave-enter{
    opacity: 1;
  }
  .fade-leave-active{
    transition: opacity .5s;
  }
  .fade-leave-to{
    opacity: 0;
  }
  ```
  总结：将元素放置在transition标签下,为transition标签赋值一个name属性,然后在样式表里面实现动画.
  形如：
  ``` JavaScript
   <transition name="my transition">
  ```

### 过渡的类名

  当插入或删除包含在 transition 组件中的元素时,Vue 将会自动嗅探目标元素是否应用了 CSS 过渡或动画,如果是,在恰当的时机添加/删除 CSS 类名.
  在进入/离开的过渡中,有6个class切换：
  - v-enter:定义进入过渡的开始状态
  - v-enter-active:执行过程中
  - v-enter-to:结束动画
  - v-leave:定义离开过渡的开始状态
  - v-leave-active:离开过程
  - v-leave-to:离开结束     


  ![过渡](http://wx4.sinaimg.cn/mw690/89296167gy1fujeqr2duhj20xc0godfv.jpg "过渡")

  过渡总共有6个状态,进入有3个,退出有3个.
  在使用时6个都应使用,形如：
  ``` CSS
  .fade-enter{
  opacity: 0;
  }
  .fade-enter-active{
    transition: opacity .5s;
  }
  .fade-enter-to{
    opacity: 1;
  }
  .fade-leave-enter{
    opacity: 1;
  }
  .fade-leave-active{
    transition: opacity .5s;
  }
  .fade-leave-to{
    opacity: 0;
  }
  ```
### css动画

  CSS 动画用法同 CSS 过渡，区别是在动画中 v-enter 类名在节点插入 DOM 后不会立即删除，而是在 animationend 事件触发时删除。
  在使用动画时,通常只需要控制enter-active和leave-active两个过程即可.
  例如：
  template部分：
  ``` HTML
  <template lang="html">
   <div class="">
       <button type="button" name="button" v-on:click="showHideAnim">动画</button>
       <transition name="hello">
         <p v-show="showAnim">嘿嘿</p>
       </transition>
   </div>
  </template>
  ```
  script部分：
  ``` JavaScript
  <script>
    export default {
      name:"anim",
      data(){
        return {
          show:true
        }
      },
      methods:{
        showHideAnim(){
          this.showAnim=!this.showAnim;
        }
      }
    }
  </script>
  ```
  style部分：
  ``` CSS
  .hello-enter-active{
    animation: bounce-in 1s ease;
  }
  .hello-leave-active{
    animation: bounce-in 1s ease reverse;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }
  ```
### 引入第三方css动画库

  可以在index.html引入外部css动画库,如[Animate](https://daneden.github.io/animate.css/).
  ``` HTML
   <link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">
  ```
  然后在组件中可以直接使用：
  ``` HTML
  <transition name="custom-classes-transition" enter-active-class="animated tada" leave-active-class="animated bounceOutRight">
        <p v-show="libs">呵呵</p>
  </transition>
  ```
