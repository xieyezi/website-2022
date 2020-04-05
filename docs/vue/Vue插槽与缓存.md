---
title: Vue插槽与缓存
tags:
  - Vue
  - JS
---

### 插槽
  利用插槽,父组件可以向子组件里面注入内容.
  注：插槽的视图部分的样式由父组件决定,子组件决定数据.也就是说是子组件给父组件传递数据.
  插槽的类型有：
  - 单个插槽的使用
  父组件：
  ``` HTML
  <Child>
    <p>我是插槽</p>
  </Child>
  ```
  <!-- more -->
  子组件：
  ``` HTML
  <slot>
  //这里会显示“我是插槽”
  </slot>
  ```

  - 具名插槽的使用
  父组件：
  ``` HTML
  <Child>
    <p slot="s1">我是插槽1</p>
  </Child>
  ```
  子组件：
  ``` HTML
  <slot name="s1">
  //这里会显示“我是插槽1”
  </slot>
  ```
  - 作用域插槽的使用(数据传递)
  子组件传递
  ``` HTML
  <slot name="s2" text="我是数据传递"></slot>
  //此处传递的是text
  ```
  父组件展示子组件传来的数据
  ``` HTML
  <p slot-scope="props" slot="s2">
         {{ props.text }}
  </p>
  //此处props可以为其他名字，它只是一个key值
  ```

### 动态组件
  ``` HTML
   <component v-bind:is="currentView"></component>
  ```
### 缓存(keep alive)
  - 用法：
  ``` HTML
  <keep-alive>
    <component v-bind:is="currentTabComponent"></component>
  </keep-alive>
  ```
  - 什么时候情况下使用缓存？   

  如果需要实时更新,则不设置缓存,否则可以使用缓存.
