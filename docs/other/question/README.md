---
title: better-scroll插件初始化后没有效果?
tags:
  - Vue
  - JS
---

# better-scroll 插件初始化后没有效果?

### 说在前面

最近做开发,用到了一个很著名的 Vue 插件-[better-scroll](https://ustbhuangyi.github.io/better-scroll/#/).这个插件主要是用来解移动端各种滚动页面的需求.我在项目中想要一个页面的滚动效果,引入了这个插件之后,按照作者的方法进行了初始化,但是仍然无法实现.经过我不断的谷歌,终于找到了解决的办法.下面我来介绍一下这个插件的具体的用法.

   <!-- more -->

### 安装及其引入

```js
npm install better-scroll --save
```

在所需组件引入:

```js
import BScroll from "better-scroll";
```

### 插件的理解

其实这个插件实现滚动原理很简单.我们先来看一下这个这个插件的 html 结构:

```html
<div class="wrapper">
  <ul class="content">
    <li>...</li>
    <li>...</li>
    ...
  </ul>
  <!-- 这里可以放一些其它的 DOM，但不会影响滚动 -->
</div>
```

上面的代码中 better-scroll 是作用在外层 wrapper 容器上的,滚动的部分是 content 元素.意思就是说,content 会在 wrapper 上实现滚动.为什么 content 就能滚动呢?,我们来看下面一张图片(截自官网):

![Github需求](http://static.galileo.xiaojukeji.com/static/tms/shield/scroll-4.png "GitHub需求")

也就是说,当 content 的内容的高度超过 wapper 高度的时候,会出现滚动效果,也就是当我们的视口展示不下内容的时候,会通过滚动条的方式让用户滚动屏幕看到剩余的内容.但是这里要注意的是,better-scroll 只处理容器（wrapper）的第一个子元素（content）的滚动,其它的元素都会被忽略.
比如下面这样的代码:

```html
   <div class="wrapper">
     <div class="other>
     </div>
     <ul class="content">
      <li>...</li>
      <li>...</li>
      ...
     </ul>
  </div>
```

在上面的代码中,在 warpper 中实现滚动效果是 ul 吗?当然不是,这里会滚动 other.我们来看看源码:

```js
// this.scroller就是滚动的内容，this.wrapper是容器
this.scroller = this.wrapper.children[0];
```

可以看出来,只有 warpper 的第一个孩子才会实现滚动效果.所以我们应该把需要滚动的内容都放置在一个容器里面,作为 warpper 的第一个孩子.

### 插件的初始化

注:这里我只介绍在 vue 中的情况.
template:

```html
<div class="wrapper" ref="wrapper">
  <ul class="content">
    <li>...</li>
    <li>...</li>
    ...
  </ul>
</div>
```

js:
我们在 methods 中封装一个 initNormal 方法:

```js
 initNormal(){
    if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.wrapper, {
            click: true,
            probeType: 3
        });
        //console.log(this.scroll);
    } else {
        this.scroll.refresh();
    };
 }
```

那么我们应该在什么时候调用这个方法进行初始化呢?
通常的做法是你的异步请求都完成以后,才进行对 better-scroll 的初始化.如果不这样做的话,better-scroll 无法正确取到 content 的高度.从而无法实现滚动.

```js
v.$axios
  .get("api/toplist/artist")
  .then(response => {
    //console.log(response.datalist.artists);
    if (response.data.code === 200) {
      this.singerList = response.data.list.artists;
      //数据加载完成，可以进行初始化了
      this.$nextTick(() => {
        this.initNormal();
      });
    }
  })
  .catch(error => {
    console.log(error);
  });
```

上面的代码中,调用了`$nextTick`方法,就是为了确保将 bettre-scroll 的初始化放置在异步请求完成之后.
接下来还有最重要的一步,我也是卡在这一步.上面我已经说过了,只有 wapper 的高度小于 content 高度的时候,才会出现滚动效果,那意味着我们必须给 wapper 和 content 设置高度.其实 content 的高度我们不需要管.因为在初始化的时候,better-scroll 会自动将高度计算出.那么我们需要对 wapper 设置高度,但是问题是,在移动端,用户用手滑动屏幕,我们如何能得知他滑动的高度,从而给 warpprt 赋值呢?其实很简单,用 css 样式就可以实现:

```css
.wrapper {
  height: 100%;
  overflow: hidden;
}
```

然后重新启动项目,就能实现想要的滚动效果.就是这样简单的两行代码,居然困扰我这么久,然而我当时还想着跟随滚动去计算高度,醉了.
