---
title: vue-amap的bug -Cannot read property 'Ac' of null
tags:
  - Vue
  - JS
---


## 问题产生的场景
  我们在项目中引入了`vue-amap`组件，我在每个标记点上绑定了点击事件，如下:
  ```js
    let markerAlarm = {
            position: [lon, lat],
            visible: true,
            draggable: false,
            name: name,
            animation: "AMAP_ANIMATION_BOUNCE", // 标记点动画效果
            icon: "/images/alarm.png",
            events: {
                init(o) {
                    self.markerRefs.push(o);
                },
                click: () => {
                    self.windows = {
                        enterprise_id: data[i].enterprise_id,
                        position: [lon, lat],
                        content: name,
                        visible: true,
                        size: 100,
                        events: {
                            close: () => {
                                self.windows.visible = false;
                            }
                        }
                    };
                    let crumbArray = [
                        {
                            url: "/move",
                            name: "移动执法"
                        },
                        {
                            url: "",
                            name: "企业详情"
                        }
                    ];
                    self.$router.push({
                        name: "enterpriseDetail",
                        query: {
                            enterpriseId: self.windows.enterprise_id,
                            crumbArray: crumbArray
                        }                                      
                    });
                    console.log(self.windows, "231423");
                }
            }
        };
  ```

<!-- more -->
  可以看到，我绑定了点击事件，每当点击图标的时候，就利用`vue-router`跳转到对应的路由下面。
  每次点击之后，正常跳转，但是在浏览器控制台报错如下:
  ```
   Uncaught TypeError: Cannot read property 'Ac' of null
  ```
## 解决办法
 给对应路由添加`keep-alive`属性。例如我的地图组件名称为`move`,那么在对应的路由文件处配置如下:
 ```js
 {
    path: '/move',
    component: Move,
    meta: {
        keepAlive: true // 标记列表页需要被缓存
    }
 }
 ```
 然后在`router-view`处判断是否有`keep-alive`属性即可:
 ```js
  <keep-alive>
    <router-view v-if="$route.meta.keepAlive"></router-view>
  </keep-alive>
  <router-view v-if="!$route.meta.keepAlive"></router-view>
 ```
 