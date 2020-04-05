---
title: Vue组件库iView的使用
tags:
  - CSS
  - HTML
  - Vue
---

### 前言

  最近接手了公司的一个项目,因为刚来公司,所以对公司的业务内容不够熟悉,做起来实在是很累.其实说白了就是自己的功力不够.很多不了解我的人都认为我很厉害,其实我什么都不会(emmmm).所以才应该从现在开始才应该多多积累,有什么小的东西就应该记录下来.有一句话说得很不错：每一天的小努力*365=巨大的飞跃！
  <!-- more -->
### css如何设置div滚动显示？

  ```
  min-height:250px;
  overflow-y:auto;
  max-height:300px;
  ```
  例如
  ``` HTML
  <div class="parent">
    <div class="滚动显示的区域" style="min-height:250px;overflow-y:auto;max-height:300px;">
      😂😂😂
    </div>
  </div>
  ```
  上面的例子很简单,其实最主要的属性设置是"overflow-y:auto",其余两条css样式其实就是设置了子div的高度,如果只设置这一条属性的话,滚动的区域就是父div的g高度,意思是,一旦你滑动屏幕,超出了父div的高度,你的子div就会出现滚动条,从而实现滚动显示.

### Vue组件库iView的使用

   同学们,我个人强烈安利这个组件库,按照官网的说法来说,[iView](https://www.iviewui.com/docs/guide/introduce) 是一套基于 Vue.js 的开源 UI 组件库,主要服务于 PC 界面的中后台产品.可能熟悉Vue的朋友们都知道饿了么组件库（[Element](http://element-cn.eleme.io/#/zh-CN)）,其实就我来看,其实饿了么组件库相对于iView过于繁琐,为什么这么说呢？因为饿了么总是会写很多内联样式,这对于我们后期的维护和优化来说简直是个巨大的工程,无异于重写界面;其次,要知道,Vue的核心思想就是组件化,一个单页面应该具有独立的样式,饿了么这样的做法简直天理难容😂.而iView组件库则很好的优化了这一方面,而且这个组件库更加Vue.（ps：我曾经听过一个笑话,说A同学帮B同学看代码,最后得出了结论,A同学认为B同学写的代码一点也不Vue.....）.另外,因为它比较方便,所以对开发者的要求变高了,要想基本使用,需要基本了解以下知识：
   - Vue组件
   - 单文件组件
   - props 传递数据
   - slot 内容分发
   - events $emit @click 事件      


   我也只是初步学习阶段,说了这么多,我来简单说一下,这个组件库的用法.
   1. 安装         



   ```
   npm install iview --save
   ```
   不知道同学们至今为止,有没有把node、npm、webpack、Vue-cli安装好,如果没有,那赶紧去！
   2. 引用      


   在项目的入口文件main.js下
   ``` JS
   import iView from 'iview';
   import 'iview/dist/styles/iview.css';
   Vue.use(iView);
   ```
   然后其组件的使用自己去看官方文档

### 说在最后

  现在是北京时间9月28日凌晨00:20,在乏累中写完这篇文章,和大家分享学习.祝大家晚安,明天又将是精彩的一天!
