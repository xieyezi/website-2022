---
title: Vue多个组件映射到同一个组件,页面不刷新？
tags:
  - git
  - GitHub
---

### 问题

在做项目的过程中,有这么一个场景：多个组件通过配置路由,都跳转到同一个组件,他们之间的区别就是,传入的参数不同.请看`router`对象：

```js
  userCenterLike: {
                      name: 'user-center',
                      params: {
                          index: 0
                      }
                  },
  userCenterHistory: {
                      name: 'user-center',
                      params: {
                          index: 1
                      }
                  }

```


<!-- more -->

仅仅只是传入的index的值不同.但是在查看效果的过程中我发现：目标组件'user-center'始终只渲染一次,也就是说,第二次访问到同一路由的时候,Vue那些生命周期的钩子已经没有用了,根本无法通过`this.$route.params.index`来获取参数.

### 解决方法

Vue的官网已经给出了详细解释：

>>提醒一下,当使用路由参数时,例如从 `/user/foo` 导航到 `/user/bar`,原来的组件实例会被复用.因为两个路由都渲染同个组件,比起销毁再创建,复用则显得更加高效.不过,这也意味着组件的生命周期钩子不会再被调用



也就是说,一开始Vue就是这样设计的,为了节省每次都要重建页面的内存开销,所以就复用.那么如何解决呢？

在这里,我们可以通过监听路由的变化来获取参数并进行操作,在`watch`钩子里面：

```js
'$route'(to,from){
                if (this.$route.params.index !== 'undefined') {
                    console.log(this.$route.params.index);
                }
 }
```

这样就可以在路由变化的同时,将我们的参数传入,实现页面的数据刷新.
