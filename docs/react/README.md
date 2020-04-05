---
title: React基础知识
---

# React 基础知识

1. 组件采用 ES6 class 的写法:

```js
import React, {Component} from 'react';
class Children extends Component{
    constructor(props){
        super(props); //调用父类的构造函数，固定写法,继承父组件属性
        this.state = {
            value:'',
            list:[]
        }
    }
   render(){
       return ();
   }
}
```

2. 标签添加样式类名，不能用''class",要用"className"
3. 利用 props 继承父组件的属性（单向数据流）；
4. 利用 state 声明响应式变量；
5. React 事件的钩子命名采用小驼峰写法：onClick 、 onChange 等；
6. 要在 constructor 函数里面为事件绑定 this，写法：

```js
this.inputChange = this.inputChange.bind(this);
```

这种在组件里面可以直接使用：

```js
onChange={this.inputChange}；
```

如果不使用这种方式，则可以在声明函数时采用“箭头函数”的写法:

```js
inputChange = (e) => {
  this.setState({
    inputValue: e.target.value,
  });
};
```

7. 利用循环生成节点时，要记得为 item 设置'key'：

```js
<ul>
  {this.state.list.map((item, index) => {
    return (
      <li key={index + item} onClick={this.deleteItem.bind(this, index)}>
        {item}
      </li>
    );
  })}
</ul>
```

8. 在 React 里面不允许直接操作 state.例如要删除 state 里面一个数组的某一项，应该先拷贝一份要操作的那个数组，然后对拷贝的数组进行操作，操作完成之后，将 state 里面那个数组更新为操作之后的数组：

```js
let list = this.state.list; //先拷贝一份
list.splice(index, 1); //对拷贝这个数组进行操作
this.setState({
  list: list, //操作之后更新
});
```

也就是说不能像这样：

```js
this.state.list.splice(index, 1); //直接操作state
this.setState({
  list: this.state.list,
});
```

9. JSX 写注释的方法:

```js
{
  /*  这是注释 */
}
```

10. React 通过 preventDefault()来阻止默认行为：

```js
function handleClick(e) {
  e.preventDefault();
  console.log("The link was clicked.");
}
```

11. label 使用'for'属性，实现点击 label 即可启用输入框的光标，在 React 里面 for 要设置为'htmlFor'：

```js
<div>
  <label htmlFor="haha">增加选项：</label>
  <input
    id="haha"
    className="input"
    value={this.state.inputValue}
    onChange={this.inputChange.bind(this)}
  />
  <button onClick={this.addList.bind(this)}> 确定 </button>
</div>
```

12. React 父组件向子组件传值：属性名 = {变量}

```js
<Children content={item}></Children>
```

在子组件中使用:

```js
<div>{this.props.content}}</div>
```

13. 子组件调用父组件的方法，将父组件的方法作为参数传递过去：

```js
<XuanXiangKaItem
  key={index + item}
  content={item}
  index={index}
  deleteItem={this.deleteItem.bind(this)}
/>
```

子组件调用:

```js
handleDelete(){
       console.log(this.props.index);
       this.props.deleteItem(this.props.index);
}
```

14. 在子组件里面，不能直接去修改 props 传递过来的值，因为 react 是单向数据流。如果要在子组件里面更改父组件的值，应当将父组件里面的方法通过 props 一起传递到子组件，然后在子组件里面调用父组件传递过来的方法。
15. 子组件里面校验父组件传递过来的值，使用 PropTypes 进行校验：

```js
import PropTypes from 'prop-types';
XuanXiangkaItem.propTypes= {  //写在class之后
    content:PropTypes.string.isRequired //isRequired表示这个参数必须传
    index:PropTypes.number,
    deleteItem:PropTypes.func
}
```

16. 指定 props 参数的默认值,使用 defaultProps：

```js
XuanXiangkaItem.defaultProps = {
  content: "默认值",
};
```

17.ref 的基本使用:
//在组件里面

```js
ref={(input)=>(this.input = input)}  //利用箭头函数来绑定

 在函数操作中使用:
 this.setState({
            // inputValue : e.target.value
            inputValue : this.input.value   //取代e.target.value
})
```

18. ref 和 setState 一起使用的一个坑:

```js
<ul ref={(ul) => (this.ul = ul)}>
  {this.state.list.map((item, index) => {
    return (
      <XuanXiangKaItem
        key={index + item}
        content={item}
        index={index}
        deleteItem={this.deleteItem.bind(this)}
      />
    );
  })}
</ul>
```

在调用 setState 之后打印 ul 数组的长度:

```js
addItem = () => {
  this.setState({
    list: [...this.state.list, this.state.inputValue],
    inputValue: "",
  });
  console.log(console.log(this.ul.querySelectorAll("div").length)); // 在这里调用
};
```

打印结果会少一个，因为 setState 是异步的，我们虚拟 Dom 还没更新就去调用 console.log 了。
解决方法,利用 setState 的回调函数:

```js
addItem = () => {
  this.setState(
    {
      list: [...this.state.list, this.state.inputValue],
      inputValue: "",
    },
    () => {
      //这里调用setState的回调
      console.log(this.ul.querySelectorAll("div").length);
    }
  );
};
```

适用场景：我们在进行了一些数据更新之后，我们想要立即拿到变化之后的虚拟 Dom，我们就应当用 setState 的回调函数。

19. React 的生命周期主要分为四大阶段:

```js
Initialization:初始化阶段。
Mounting: 挂载阶段。
Updation: 更新阶段。
Unmounting: 销毁阶段
```

![QQ20191106-101739@2x.png](https://i.loli.net/2019/11/06/35gkLpHwWbclRCn.png)

可以看出，render 函数是一个生命周期函数，当 props、state 变化时，都会自动进行调用.

constructor 不能称为是生命周期函数，他仅仅是 ES6 的语法，虽然它和生命周期函数的性质一样，但不能认为是生命周期函数。应该把它看成是 React 的 Initialization 阶段，定义属性（props）和状态(state)。

Mounting: 挂载阶段  
Mounting 阶段，即是挂载阶段，伴随着整个虚拟 Dom 的生成，这个周期里面有三个生命周期函数:

1. componentWillMount:在组件即将被挂载到页面的时刻执行，
2. render：页面 props 和 state 发生变化时执行，
3. componentDidMount:组件挂载(插入 dom 树中)完成之后执行。

需要注意的问题：componentWillMount 和 componentDidMount，这两个周期函数，只会在页面刷新时执行一次，但是 render 则不同，只要页面 props 和 state 发生变化时就会执行。所以我们可以将异步请求写在 componentWillMount 和 componentDidMount 钩子函数里面，但是在使用 RN 时，使用 componentWillMount 钩子会有冲突。所以建议在 componentDidMount 函数里作异步请求。

Updation: 更新阶段  
Updation 阶段主要是更新阶段，有两个部分组成，一个是 props 属性的改变，另一个是 state 状态的改变。

1. shouldComponentUpdate:它要求返回一个布尔类型的结果，必须有返回值，简单点说，就是返回 true，就同意组件更新;返回 false,就反对组件更新,
2. componentWillUpdate:在组件更新之前，但 shouldComponenUpdate 之后被执行。但是如果 shouldComponentUpdate 返回 false，这个函数就不会被执行了,
3. componentDidUpdate：组件更新完成之后执行。

Unmounting: 销毁阶段  
Unmounting 是指组件的销毁阶段

1. componentWillUnmount：组件从页面中删除的时候执行

还有一个特殊的生命周期函数：componentWillReceiveProps 函数。

componentWillReceiveProps:子组件接收到父组件传递过来的参数，父组件 render 函数重新被执行，这个生命周期就会被执行。

20. 可以利用生命周期函数的一些特性对程序的性能进行优化:
    例如父组件有个输入框，输入框的值传递 props 到子组件，引起子组件重新调用 render 函数，即是重新渲染，但是我们不希望我们输入时，子组件就在不停的调用 render，这样会引起性能损耗，我们只是希望当我们输入完成之后，子组件的 render 调用就行了，在这种情况下面，我们就可以利用生命周期来实现性能优化。我们监听子组件的更新周期，对传递的 props 进行前后比较:

```js
 shouldComponentUpdate(nextProps,nextState){
        if(nextProps.content !== this.props.content){
            return true
        }else{
            return false
        }
}//shouldComponentUpdate有两个参数：nextProps:变化后的属性;nextState:变化后的状态;
```

未完待续...

参考自 React 官网和技术胖博客
