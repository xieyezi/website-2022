---
title: Vue组件
tags:
  - Vue
  - JS
---

### Vue组件
  组件是Vue.js最核心的功能之一,组件可以扩展HTML元素,封装可重用的代码.
  所以的组件都是Vue的一个实例.
  一个单组件分为三部分：
  - template(HTML部分)
  - script(逻辑部分)
  - style(样式部分)   

  <!-- more -->
  注意：
  1.template里面只能有一个根组件：
  ``` HTML
    <template>
      <div>
        我是根组件
      </div>
    <template/>
  ```


  2.style的scoped属性：样式只在当前组件内生效

### 子父级组件
  顾名思义,一个组件包含了另一个组件,就形成了子父级组件的关系.
  1.在父组件导入子组件的方法：
  - 先为子组件起名并导入文件位置
  ```
  import Son from "子组件文件位置"
  ```
  - 创建components将子组件注入
  ```
  {
    Son
  }
  ```
  2.子父级组件之间的交互：
  父组件要给子组件下发数据,子组件要告诉父组件发生了什么事情,所以需要通信.他们之间的通信总结为props向下传递,事件(Event)向上传递.即是父组件通过props给子组件下发数据,子组件通过事件给父组件发送消息.
  - 父组件给子组件下发数据：
  1.父组件发送
  ```
   <Son v-bind:title="msg"/>
  ```
  2.子组件引用(在data同级目录下声明props)
  ```
   props:["title"]
  ```
### props数据传递检测
  - 检测传入值数据类型
  ```
  props:{
    title:String,(即是说传入的title应该为String类型)
    num:Number,
  }
  ```
  - 当然传入值可以是多种数据类型
  ```
  props:{
    title:[String,Number],(即是说传入的title可以为String类型或者Number类型)
    num:Number,
  }
  ```
  - 指定传入值必选项
  ```
  props:{
    title:{
      type:String,
      required:true
    }
  }
  ```
  - 指定传入值默认值
  ```
  props:{
    num:{
      type:Number,
      default:5
    }
  }
  ```
  - 传入值可以为一个对象
  ```
  props:{
    myobj:{
      type:Object,
      default:function(){
        return {
          name:"未知",
          age:10
        }
      }
    }
  }
  ```
