---
title: Vue.$nextTick解析
tags:
  - vue
  - JS
---

## 说在前面
  
这篇博文全是干货,内容很长,但是值得收藏！！！

### 问题背景

   我最近在做一个自己的音乐Web App,期间遇到不少瓶颈,这次记录一下我困扰了将近一周的问题.我在一个组件内点击了播放按键,将这个点击事件派发到父组件,然后传入ID到player组件内,进行异步请求,获取到该首音乐的播放地址,然后通过vue.$ref去调用audio.play()方法,经过调试发现,在谷歌浏览器、火狐浏览器等都能正常播放,但是唯独苹果旗下的safari播放器不能播放.请看代码:
 <!-- more -->
dom部分：
    ```html
    <audio :src="songurl" ref="audio" @canplay="ready" @error="error" @timeupdate="updateTime"></audio>
    ```

这里的":src=songurl",我是在data里面初始化了一个’songurl’ :

    ```js
    data() {
                return {
                    songurl: '',
                    songReady: false,
                    currentTime: 0
                }
            },     
    ```
watch部分：

    ```js
    watch: {
                currentSong() {
                    var v = this;
                    v.getSongUrl(v.currentSong.id).then(() => {
                            v.$refs.audio.play();
                    })
                },
                playing(newPlaying) {
                    var v = this;
                    const audio = v.$refs.audio;
                    v.getSongUrl(v.currentSong.id).then(() => {
                        newPlaying ? audio.play() : audio.pause();
                    })

                }
            },
    ```
可以看到,我是先去调用了v.getSongUrl( ) 这个方法去获取歌曲URL,这个promise执行完成之后,然后再去播放歌曲.
以下为getSongUrl( ) 方法：
    ```js
    getSongUrl(id) {
                    var v = this;
                    return v.$axios.get('api/song/url', {
                        params: {
                            id: id
                        }
                    }).then(response => {
                        if (response.data.code === 200) {
                            v.songurl = response.data.data[0].url;
                            //console.log("地址：" + v.songurl);
                        }
                    }).catch(error => {
                        console.log(error);
                    });

                },
    ```

所以就是,我先去异步请求,然后将获取的url赋值给data里面的songurl,然后绑定到audio的src上面,然后再去调用audio.play. 但是safari就是不能播放.

### 问题探究

遇到问题,先进行思考,为什么谷歌浏览器等一众浏览器都能正常播放,唯独safari不能？是不是safari有什么特别之处？于是我去搜索了一番,一查还真是,请看：

![QQ20181118-141626@2x.png](https://i.loli.net/2018/11/18/5bf103da21030.png)

safari对播放做了限制,除非用户自己进行了交互操作,但是去调用`audio.play()`,而我在这里,是先进行了异步请求,才去执行了这个`audio.play()`,所以不能播放.说起来safari还真是尿性,为了防止用户损失流量,就做了这个限制,那有什么办法解决呢？请看：

![QQ20181118-142537@2x.png](https://i.loli.net/2018/11/18/5bf105f1cae71.png)

意思是说,官方还是没有解除这个限制.这里还说到,Apple 在 iOS 4.2.1 中修复了异步请求之后播放的功能,所以这种变通方法在 iOS 4.2.1 和后续版本中是不起作用的.终于找到问题所在,原来就是不能这样实现.所以我就必须重构自己的业务逻辑,不能在播放之前进行异步请求,于是我将获取歌曲URL的操作放置到另一个组件内,然后利用props传递到player组件里面来,简单来说我将异步请求放到前面去实现了.然而这样就能播放了吗？答案是还是不能!!!我懵逼了,我不是将异步请求放置到前面去实现了吗,为什么还是不能实现？于是我去搜索了一下,原来有一个`Vue.$nextTick`方法.那么这个方法的作用是什么？请看：
![QQ20181118-150210@2x.png](https://i.loli.net/2018/11/18/5bf10ec8e657b.png)
意思是说,我可能数据还没加载好,就去更新dom了,所以应该将更新dom的操作放置到`Vue.$nextTick`方法中,这样就可以保证将更新dom的操作放置到异步请求之后去实现了:
```js
 watch: {
            currentSong() {
                var v = this;
                v.$nextTick(() => {
                    v.$refs.audio.play();
                });
            },
            playing(newPlaying) {
                var v = this;
                const audio = v.$refs.audio;
                v.$nextTick(() => {
                    newPlaying ? audio.play() : audio.pause();
                });
            }
        },
```
然而这样做之后就能播放了吗？答案是还是不能！！为什么呢？

### 继续探究
那为什么加了`Vue.$nextTick`方法还是无法实现播放?我们应该去研究研究Vue的这个方法,但是在这之前,我们先来看看JS的运行机制:
来自阮一峰的[一篇文章](http://www.ruanyifeng.com/blog/2014/10/event-loop.html),大致分为以下几个步骤:
 1. 所有同步任务都在主线程上执行,形成一个执行栈（execution context stack）.
 2. 主线程之外,还存在一个"任务队列"（task queue）.只要异步任务有了运行结果,就在"任务队列"之中放置一个事件.
 3. 一旦"执行栈"中的所有同步任务执行完毕,系统就会读取"任务队列",看看里面有哪些事件.那些对应的异步任务,于是结束等待状态,进入执行栈,开始执行.
 4. 主线程不断重复上面的第三步.           





 主线程的执行过程就是一个 `tick`,而所有的异步结果都是通过 “任务队列” 来调度被调度. 消息队列中存放的是一个个的任务（task）. 规范中规定 task 分为两大类,分别是 `macro task` 和 `micro task`.在浏览器环境中,常见的 `macro task` 有 `setTimeout`、`MessageChannel`、`postMessage`、`setImmediate`；常见的 `micro task` 有 `MutationObsever` 和 `Promise.then`.


 回到Vue的`nextTick`,先生介绍一下这个方法的使用场景:
 vue将异步调用的方法其实是push到一个队列里面,然后内部调用一次nextTick,统一去更新dom,所以数据到DOM数据的变化要下一个tick才能完成.
 在2.5以上的版本中,它调度的优先顺序为:
 `setImmediate` -> `MessageChannel` -> `setTimeout`

### 对 audio 播放的影响

知道了调度顺序之后,那到底nextTick是如何影响adio的？经过我的测试,是`MessageChannel`影响了audio的播放.就是因为在2.5版本以上,`nextTick`优先使用`MessageChannel`,造成了audio不能播放.


### 解决方法

知道了什么原因,我们就可以解决问题了,那我们在这里跳过`MessageChannel`,不就行了吗.我直接将全局的`MessageChannel`禁用掉:
```js
function noop() {
}
window.MessageChannel = noop
window.setImmediate = noop
```
这样就跳过了MessageChannel,我再运行项目跑了一下,完美解决!!
 
