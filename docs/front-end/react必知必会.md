---
title: react 必知必会
---

# react 必知必会

> 这里是简介

## 组件通信

### props

适用于父子组件通信

#### 父组件->子组件

父组件将需要传递的参数通过`key={xxx}`方式传递至子组件，子组件通过`this.props.key`获取参数.

```tsx
import React from 'react'
import Son from './son'
class Father extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }
  state = {
    info: '父组件',
  }
  handleChange = (e) => {
    this.setState({
      info: e.target.value,
    })
  }
  render() {
    return (
      <div>
        <input
          type='text'
          value={this.state.info}
          onChange={this.handleChange}
        />
        <Son info={this.state.info} />
      </div>
    )
  }
}
export default Father

// 子组件
import React from 'react'
interface IProps {
  info?: string
}
class Son extends React.Component<IProps> {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        <p>{this.props.info}</p>
      </div>
    )
  }
}
export default Son
```

#### 子组件->父组件

利用 props callback 通信，父组件传递一个 callback 到子组件，当事件触发时将参数放置到 callback 带回给父组件.

```tsx
// 父组件
import React from 'react'
import Son from './son'
class Father extends React.Component {
  constructor(props) {
    super(props)
    this.callback = this.callback.bind(this)
  }
  state = {
    info: '',
  }
  callback = (value) => {
    // 此处的value便是子组件带回
    this.setState({
      info: value,
    })
  }
  render() {
    return (
      <div>
        <p>{this.state.info}</p>
        <Son callback={this.callback} />
      </div>
    )
  }
}
export default Father

// 子组件
import React from 'react'
interface IProps {
  callback: (string) => void
}
class Son extends React.Component<IProps> {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange = (e) => {
    // 在此处将参数带回
    this.props.callback(e.target.value)
  }
  render() {
    return (
      <div>
        <input type='text' onChange={this.handleChange} />
      </div>
    )
  }
}
export default Son
```

### Context

适用于跨层级组件之间通信

```tsx
// context.js
import React from 'react'
const { Consumer, Provider } = React.createContext(null) //创建 context 并暴露Consumer和Provide
export { Consumer, Provider }

// 父组件
import React from 'react'
import Son from './son'
import { Provider } from './context'
class Father extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    info: 'info from father',
  }
  render() {
    return (
      <Provider value={this.state.info}>
        <div>
          <p>{this.state.info}</p>
          <Son />
        </div>
      </Provider>
    )
  }
}
export default Father

// 子组件
import React from 'react'
import GrandSon from './grandson'
import { Consumer } from './context'
class Son extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <Consumer>
        {(info) => (
          // 通过Consumer直接获取父组件的值
          <div>
            <p>父组件的值:{info}</p>
            <GrandSon />
          </div>
        )}
      </Consumer>
    )
  }
}
export default Son

// 孙子组件
import React from 'react'
import { Consumer } from './context'
class GrandSon extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <Consumer>
        {(info) => (
          // 通过 Consumer 中可以直接获取组父组件的值
          <div>
            <p>组父组件的值:{info}</p>
          </div>
        )}
      </Consumer>
    )
  }
}
export default GrandSon
```

特别注意

> 如果需要消费多个 Context,则 React 需要使每一个 consumer 组件的 context 在组件树中成为一个单独的节点。

```tsx
// provider
...
  <Context1.Provider value={this.state.info}>
    <Context2.Provider value={this.state.theme}>
      <div>
        <p>{this.state.info}</p>
        <p>{this.state.theme}</p>
        <Son />
      </div>
    </Context2.Provider>
  </Context1.Provider>

 // consumer
 ...
 <Context1.Consumer>
    {(info: string) => (
      // 通过Consumer直接获取父组件的值
      <Context2.Consumer>
        {(theme: string) => (
          <div>
            <p>父组件info的值:{info}</p>
            <p>父组件theme的值:{theme}</p>
          </div>
        )}
      </Context2.Consumer>
    )}
  </Context1.Consumer>
```

> 很多优秀的 React 组件的核心功能都通过 Context 来实现的，比如 react-redux 和 react-router 等，所以掌握 Context 是必须的。

### OnRef

OnRef 的原理很简单，本质上就是通过 props 将子组件的组件实例（也是我们常说的 this）当作参数，通过回调传到父组件，然后在父组件就可以拿到子组件的实例，拿到了它的实例就可以调用它的方法（~~为所欲为~~）了。

```tsx
// 父组件
import React from 'react'
import Son from './son'
import { Button } from 'antd'

class Father extends React.Component {
  child: any
  constructor(props) {
    super(props)
  }
  sonRef = (ref) => {
    this.child = ref // 在这里拿到子组件的实例
  }
  clearSonInput = () => {
    this.child.clearInput()
  }
  render() {
    return (
      <div>
        <Son onRef={this.sonRef} />
        <Button type='primary' onClick={this.clearSonInput}>
          清空子组件的input
        </Button>
      </div>
    )
  }
}
export default Father

// 子组件
import React from 'react'
import { Button } from 'antd'

interface IProps {
  onRef: any
}

class Son extends React.Component<IProps> {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    this.props.onRef(this) // 在这将子组件的实例传递给父组件this.props.onRef()方法
  }
  state = {
    info: 'son',
  }
  handleChange = (e) => {
    this.setState({
      info: e.target.value,
    })
  }
  clearInput = () => {
    this.setState({
      info: '',
    })
  }
  render() {
    return (
      <div>
        <div>{this.state.info}</div>
        <input type='text' onChange={this.handleChange} />
      </div>
    )
  }
}
export default Son
```

### ref

`ref`是`react`提供给我们的一个属性,通过它，我们可以访问 `DOM` 节点或者组件.

```tsx
// 父组件
import React from 'react'
import Son from './son'
import { Button } from 'antd'

class Father extends React.Component {
  son: any
  constructor(props) {
    super(props)
    this.son = React.createRef() // 在此处创建ref
  }
  clearSonInput = () => {
    const { current } = this.son // 注意，这里必须通过 this.son.current拿到子组件的实例
    current.clearInput()
  }
  render() {
    return (
      <div>
        <Son ref={this.son} />
        <Button type='primary' onClick={this.clearSonInput}>
          清空子组件的input
        </Button>
      </div>
    )
  }
}
export default Father

// 子组件
import React from 'react'
import { Button } from 'antd'

class Son extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    info: 'son',
  }
  handleChange = (e) => {
    this.setState({
      info: e.target.value,
    })
  }
  clearInput = () => {
    this.setState({
      info: '',
    })
  }
  render() {
    return (
      <div>
        <div>{this.state.info}</div>
        <input type='text' onChange={this.handleChange} />
      </div>
    )
  }
}
export default Son
```

> 值得注意的是，我们必须通过 `this.childRef.current`才能拿到子组件的实例。  
> 使用 ref 常见的场景有管理焦点，文本选择或媒体播放、触发强制动画、集成第三方 DOM 库等。

### 第三方工具

#### events(发布订阅)

这种方式适用于没有任何嵌套关系的组件通信。其原理就是使用事件订阅。即是一个发布者，一个或者多个订阅者。
使用之前需要先安装:

```
yarn install events
```

```tsx
// event.ts
import { EventEmitter } from 'events'
export default new EventEmitter()

// 发布者 通过emit事件触发方法，发布订阅消息给订阅者
import React from 'react'
import Son1 from './son1'
import Son2 from './son2'
import { Button } from 'antd'
import emitter from './event'

class Father extends React.Component {
  son: any
  constructor(props) {
    super(props)
  }
  handleClick = () => {
    //emit事件触发方法,通过事件名称找对应的事件处理函数info，将事件处理函数作为参数传入
    emitter.emit('info', '我是来自father的 info')
  }
  render() {
    return (
      <div>
        <Button type='primary' onClick={this.handleClick}>
          点击按钮发布事件
        </Button>
        <Son1 />
        <Son2 />
      </div>
    )
  }
}
export default Father

// 订阅者1
// 通过emitter.addListener(事件名称,函数名)方法，进行事件监听(订阅)。
// 通过emitter.removeListener(事件名称,函数名)方法 ，进行事件销毁(取消订阅)

import React from 'react'
import { Button } from 'antd'
import emitter from './event'

class Son1 extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    info: '',
  }
  componentDidMount() {
    // 在组件挂载完成后开始监听
    emitter.addListener('info', (info) => {
      this.setState({
        info: 'Son1收到消息--' + info,
      })
    })
  }

  componentWillUnmount() {
    // 组件销毁前移除事件监听
    emitter.removeListener('info', (info) => {
      this.setState({
        info: 'Son1即将移除事件监听--' + info,
      })
    })
  }
  render() {
    return (
      <div>
        <div>{this.state.info}</div>
      </div>
    )
  }
}
export default Son1

// 订阅者2
import React from 'react'
import { Button } from 'antd'
import emitter from './event'

class Son2 extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    info: '',
  }
  componentDidMount() {
    // 在组件挂载完成后开始监听
    emitter.addListener('info', (info) => {
      this.setState({
        info: 'Son2收到消息--' + info,
      })
    })
  }

  componentWillUnmount() {
    // 组件销毁前移除事件监听
    emitter.removeListener('info', (info) => {
      this.setState({
        info: 'Son2即将移除事件监听--' + info,
      })
    })
  }
  render() {
    return (
      <div>
        <div>{this.state.info}</div>
      </div>
    )
  }
}
export default Son2
```

## 路由

随着前端工程的复杂度越来越高，所以路由管理在现在的前端工程中，也是一个值得注意的点，`vue`提供了`vue-router`来管理路由。相似的，`react`则提供了`react-router`来管理路由。

### `react-router`

`react-router` 包含 `3` 个，分别为`react-router`、`react-router-dom` 和 `react-router-native`。

`react-router`提供最基本的路由功能，但是实际使用的时候我们不会直接安装 `react-router`，而是根据应用运行的环境来选择安装 `react-router-dom`和`react-router-native`。因为`react-router-dom` 和 `react-router-native` 都依赖 `react-router`，所以在安装时，`react-router` 也会⾃自动安装。

其中`react-router-dom` 在浏览器器中使⽤，而`react-router-native`在 `react-native` 中使用。

在 react-router 里面，一共有 3 种基础组件，他们分别是

- 路由组件(router components) 比如 `<BrowserRouter>` 和 `<HashRouter>`
- 路由匹配组件(route matchers components) 比如 `<Route>` 和 `<Switch>`
- 导航组件(navigation components) 比如 `<Link>`, `<NavLink>`, 和 `<Redirect>`

### 路由组件

对于 web 项目，react-roruter-dom 提供了 `<BrowserRouter>` 和 `<HashRouter>`两个路由组件。

- `BrowserRouter`：浏览器的路由方式，也就是使用 `HTML5` 提供的 [`history API`](https://developer.mozilla.org/zh-CN/docs/Web/API/History) ( pushState , replaceState 和 popstate 事件) 来保持 `UI` 和 `url` 的同步。这种方式在`react`开发中是经常使用的路由方式，但是在打包后，打开会发现访问不了页面，所以需要通过配置 `nginx` 解决或者后台配置代理。
- `HashRouter`：在路径前加入#号成为一个哈希值，`Hash` 模式的好处是，再也不会因为我们刷新而找不到我们的对应路径，但是链接上面会有`#/`。在`vue`开发中，经常使用这种方式。

要使用路由组件，我们只需要确保它是在根组件使用，我们应该将`<App />`包裹在路由组件下面：

```tsx
import { BrowserRouter } from 'react-router-dom';
...
<BrowserRouter>
    <App />
</BrowserRouter>
...
```

### 匹配组件

有两种路由匹配组件：`<Route>` 和 `<Switch>`

这两个路由匹配组件通常在一起使用，在`<Switch>`里面包裹多个`<Route>`，然后它会逐步去比对每个`<Route>`的`path`属性 和浏览器当前`location`的`pathname`是否一致，如果一致则返回内容，否则返回`null`。

```tsx
<Switch>
  <Route exact path='/' component={Home} />
  {/* 如果当前的URL是`/about`,即 location = { pathname: '/about' } ,那么About组件就应该被渲染，其余的Route就会被忽略 */
  <Route path='/about' component={About} />
  <Route path='/contact' component={Contact} />
</Switch>
```

值得注意 ⚠️ 的是： `<Route path={xxx}>` 只会匹配 `URL`的开头，而不是整个 URL。简单的来说就是它不是精确匹配 ，例如`<Route path ='/'>` 和`<Route path ='/about'>` 它永远都只能匹配到`<Route path ='/'>`,他们开头都有'/'。  
在这里我们有两种解决方法：

- 将此`<Route path='/'>`放在`<Switch>`的最后一个位置
- 另一种解决方案是添加'exact' 实现精确匹配： `<Route exact='/'>`

所以`<Switch>`组件只会 `render` 第一个匹配到的路由，像上面我们说的，如果没有设置 `path`，则一定会匹配，我们可以用来实现 404 的功能:

```tsx
<Switch>
  <Route exact path='/' component={Home} />
  <Route path='/about' component={About} />
  <Route path='/contact' component={Contact} />
  {/* 当上面的组件都没有匹配到的时候, 404页面 就会被 render */}
  <Route render={() => <div> 404页面 </div>} />
</Switch>
```

### 导航组件

导航组件有`<Link>`, `<NavLink>`, 和 `<Redirect>`。

当我们使用`<Link>`的时候，在 html 页面会被渲染为一个`a`标签:

```tsx
<Link to='/'>Home</Link>
// <a href='/'>Home</a>
```

`<NavLink>`是一种特殊的`<Link>` ，当`<NavLink>`中的地址和浏览器地址匹配成功的时候，会添加一个 style 样式，如下：

```tsx
<NavLink to='/about' activeClassName='active'>
  About
</NavLink>
```

在 html 页面当中，它会被渲染为:

```tsx
<a href='/about' className='active'>
  React
</a>
```

但是有时你可能想要强制跳转到某个页面，比如未登录不能进入首页，这个时候你可以使用`<Redirect>`

```tsx
<Redirect to='/login' />
```

## 生命周期(新旧对比)

### 旧版生命周期

旧版生命周期 指的是 React 16.3 及其之前的版本。

![image](https://i.loli.net/2020/05/13/qxlU1hO2zeYKBiJ.png)

```tsx
import React, { Component } from 'react'

export default class LifeCycle extends Component {
    //// props = {age:10,name:'计数器'}
  static defaultProps = {
      name:'计数器'
  }
  constructor(props){
      //Must call super constructor in derived class before accessing 'this' or returning from derived constructor
    super();//this.props = props;
    this.state = {number:0,users:[]};//初始化默认的状态对象
    console.log('1. constructor 初始化 props and state');

  }
  //componentWillMount在渲染过程中可能会执行多次
  componentWillMount(){
    console.log('2. componentWillMount 组件将要挂载');
    //localStorage.get('userss');
  }
  //componentDidMount在渲染过程中永远只有执行一次
  //一般是在componentDidMount执行副作用，进行异步操作
  componentDidMount(){
    console.log('4. componentDidMount 组件挂载完成');
    fetch('https://api.github.com/users').then(res=>res.json()).then(users=>{
        console.log(users);
        this.setState({users});
    });
  }
  shouldComponentUpdate(nextProps,nextState){
    console.log('Counter',nextProps,nextState);
    console.log('5. shouldComponentUpdate 询问组件是否需要更新');
    return true;
  }
  componentWillUpdate(nextProps, nextState){
    console.log('6. componentWillUpdate 组件将要更新');
  }
  componentDidUpdate(prevProps, prevState)){
    console.log('7. componentDidUpdate 组件更新完毕');
  }
  add = ()=>{
      this.setState({number:this.state.number});
  };
  render() {
    console.log('3.render渲染，也就是挂载')
    return (
      <div style={{border:'5px solid red',padding:'5px'}}>
        <p>{this.props.name}:{this.state.number}</p>
        <button onClick={this.add}>+</button>
        <ul>
            {
                this.state.users.map(user=>(<li>{user.login}</li>))
            }
        </ul>
        {this.state.number%2==0&&<SubCounter number={this.state.number}/>}
      </div>
    )
  }
}
class SubCounter extends Component{
    constructor(props){
        super(props);
        this.state = {number:0};
    }
    componentWillUnmount(){
        console.log('SubCounter componentWillUnmount');
    }
    //调用此方法的时候会把新的属性对象和新的状态对象传过来
    shouldComponentUpdate(nextProps,nextState){
        console.log('SubCounter',nextProps,nextState);
        if(nextProps.number%3==0){
            return true;
        }else{
            return false;
        }
    }
    //componentWillReceiveProp 组件收到新的属性对象
    componentWillReceiveProps(){
      console.log('SubCounter 1.componentWillReceiveProps')
    }
    render(){
        console.log('SubCounter  2.render')
        return(
            <div style={{border:'5px solid green'}}>
                <p>{this.props.number}</p>
            </div>
        )
    }
}
```

> react 父子组件的渲染顺序遵循`洋葱模型`

### 新版生命周期

![react-16.4.png](https://i.loli.net/2020/05/28/J9iDekbThNFI1Gc.png)

### static getDerivedStateFromProps

- `static getDerivedStateFromProps(nextProps,prevState)`：接收父组件传递过来的 `props` 和组件之前的状态，返回一个对象来更新 `state` 或者返回 `null` 来表示接收到的 `props` 没有变化，不需要更新 state.
- 该生命周期钩子的作用： 将父组件传递过来的 props 映射 到子组件的 `state` 上面，这样组件内部就不用再通过 `this.props.xxx` 获取属性值了，统一通过 `this.state.xxx` 获取。映射就相当于拷贝了一份父组件传过来的 `props` ，作为子组件自己的状态。注意：子组件通过 `setState` 更新自身状态时，不会改变父组件的 `props`
- 配合 `componentDidUpdate`，可以覆盖 `componentWillReceiveProps` 的所有用法
- 该生命周期钩子触发的时机：

1. 在 React 16.3.0 版本中：在组件实例化、接收到新的 `props` 时会被调用
2. 在 React 16.4.0 版本中：在组件实例化、接收到新的 `props` 、组件状态更新时会被调用

```
	// 根据新的属性对象派生状态对象
  // nextProps——新的属性对象 prevState——旧的状态对象
  static getDerivedStateFromProps(nextprops, state) {
    console.log('props',nextprops);
    // 返回一个对象来更新 state 或者返回 null 来表示接收到的 props 不需要更新 state
    if (nextprops.age !== state.age) {
      console.log("更新吧");
      return {
        onChangeParent:nextprops.onChangeParent,
        age: nextprops.age,
        // 注意：这里不需要把组件自身的状态也放进来
        // num:state.num
      };
    }
    return null;
  }
```

### getSnapshotBeforeUpdate

- `getSnapshotBeforeUpdate(prevProps`, `prevState`)：接收父组件传递过来的 `props` 和组件之前的状态，此生命周期钩子必须有返回值，返回值将作为第三个参数传递给 `componentDidUpdate`。必须和 `componentDidUpdate` 一起使用，否则会报错
- 该生命周期钩子触发的时机 ：被调用于 `render` 之后、更新 `DOM` 和 `refs` 之前
- 该生命周期钩子的作用： 它能让你在组件更新 `DOM` 和 `refs` 之前，从 `DOM` 中捕获一些信息（例如滚动位置）
- 配合 `componentDidUpdate`, 可以覆盖 `componentWillUpdate` 的所有用法
- demo：每次组件更新时，都去获取之前的滚动位置，让组件保持在之前的滚动位置
-

```
 getSnapshotBeforeUpdate() {
    // 返回更新内容的高度 300px
    return this.wrapper.current.scrollHeight;
  }
componentDidUpdate(prevProps, prevState, prevScrollHeight) {
    this.wrapper.current.scrollTop =
      this.wrapper.current.scrollTop +
      (this.wrapper.current.scrollHeight - prevScrollHeight);
  }
```

### 版本迁移

- `componentWillMount`，`componentWillReceiveProps`，`componentWillUpdate` 这三个生命周期因为经常会被误解和滥用，所以被称为 不安全（不是指安全性，而是表示使用这些生命周期的代码，有可能在未来的 `React` 版本中存在缺陷，可能会影响未来的异步渲染） 的生命周期。
- React 16.3 版本：为不安全的生命周期引入别名 `UNSAFE_componentWillMount`，`UNSAFE_componentWillReceiveProps` 和 `UNSAFE_componentWillUpdate`。（旧的生命周期名称和新的别名都可以在此版本中使用）
- React 16.3 之后的版本：为 `componentWillMount`，`componentWillReceiveProps` 和 `componentWillUpdate` 启用弃用警告。（旧的生命周期名称和新的别名都可以在此版本中使用，但旧名称会记录 DEV 模式警告）。

## 状态管理

前端工程的复杂度越来越高，状态管理也是一个很重要的点。在 react 生态中，现在最火的状态管理方案就是`redux`。

### redux

我们都知道，react 是单向的数据流，数据几乎都是通过 props 依次从上往下传:
![react-porps.gif](https://i.loli.net/2020/05/25/EbvnGP2CflwQOoc.gif)

> 图片来自 [When do I know I’m ready for Redux?](https://medium.com/dailyjs/when-do-i-know-im-ready-for-redux-f34da253c85f)

一个组件的状态有两种方式改变：

- 来自父组件的 props 改变了，那么这个组件也会重新渲染
- 自身有 state，自身的 state 可以通过`this.setstate`方法改变

现在假如我们组件树的层级比较深，有很多子组件需要共享状态，那么我们只能通过状态提升来改变状态，将状态提升到顶级父组件改变，当顶级父组件的状态改变了，那么旗下的所有子节点都会重新渲染：

![state-change.gif](https://i.loli.net/2020/05/25/Po9KNkScQt1EwFR.gif)

当出现这种情况当时候，你就该使用`redux`了。那么使用`redux`之后，就会变成这样：

![redux-state.gif](https://i.loli.net/2020/05/25/hQO2eZsGdLa6gRq.gif)

以上 gif 动图很生动的展示了 redux 解决的问题，下面我们来介绍一下 redux 相关的知识点：

#### Store

在 redux 里面，只有一个`Store`，整个应用需要管理的数据都在这个`Store`里面。这个`Store`我们不能直接去改变，我们只能通过返回一个新的`Store`去更改它。`redux`提供了一个`createStore`来创建`state`

```ts
import { createStore } from 'redux'
const store = createStore(reducer)
```

#### action

这个 `action` 指的是视图层发起的一个操作，告诉`Store` 我们需要改变。比如用户点击了按钮，我们就要去请求列表，列表的数据就会变更。每个 `action` 必须有一个 `type` 属性，这表示 `action` 的名称，然后还可以有一个 `payload` 属性，这个属性可以带一些参数，用作 `Store` 变更时参考：

```ts
const action = {
  type: 'ADD_ITEM',
  payload: 'new item', // 可选属性
}
```

上面这个例子就定义了一个名为`ADD_ITEM`的`Action`，它还携带了一个`payload`的参数。
`Redux` 可以用 `Action Creator` 批量来生成一些 `Action`。

#### reducer

在上面我们定义了一个`Action`,但是`Action`不会自己主动发出变更操作到`Store`，所以这里我们需要一个叫`dispatch`的东西，它专门用来发出`action`，不过还好，这个`dispatch`不需要我们自己定义和实现，`redux`已经帮我们写好了，在`redux`里面，`store.dispatch()`是 `View`发出 `Action` 的唯一方法。

```ts
store.dispatch({
  type: 'ADD_ITEM',
  payload: 'new item', // 可选属性
})
```

当 `dispatch` 发起了一个 `action` 之后，会到达 `reducer`，那么这个 `reducer` 用来干什么呢？顾名思义，这个`reducer`就是用来计算新的`store`的，`reducer`接收两个参数：当前的`state`和接收到的`action`，然后它经过计算，会返回一个新的`state`。(前面我们已经说过了，不能直接更改`state`，必须通过返回一个新的`state`来进行变更。)

```ts
const reducer = function(prevState, action) {
  ...
  return newState;
};
```

这个 `reducer` 是一个纯函数。纯函数的意思是说，对于相同的输入，只会有相同的输出，不会影响外部的值，也不会被外部的值所影响。纯函数属于函数式编程的概念，如果你想了解更多纯函数的概念，请看[这里
](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch3.html#%E8%BF%BD%E6%B1%82%E2%80%9C%E7%BA%AF%E2%80%9D%E7%9A%84%E7%90%86%E7%94%B1)

可以看到，我们在创建`store`的时候，我们在`createStore`里面传入了一个`reducer`参数，在这里，我们就是为了，每次`store.dispatch`发送一个新的`action`,`redux`都会自动调用`reducer`，返回新的`state`。

那么当项目特别大特别复杂的时候，`state` 肯定是非常大的一个对象，所以我们需要写很多个 `reducer`，那么在这里，我们就需要把 `reducer` 进行拆分。每个 `reducer` 只负责管理 `state` 的一部分数据。那么我们如何统一对这些 `reducer` 进行管理呢？`redux` 给我们提供了 `combineReducers` 方法，顾名思义，就是将所有的子 `reducer` 合成一个 `reducer`，方便我们管理。

```ts
import { combineReducers } from 'redux'
import listReducer from './listReducer/reducers'
import detailReducer from './detailReducer/reducers'
import aboutReducer from './aboutReducer/reducers'

const rootReducer = combineReducers({
  listReducer,
  detailReducer,
  aboutReducer,
})
export default rootReducer
```

#### 中间件

熟悉`koa`的朋友们，应该知道中间件的概念。中间件的意思就是，在某两个操作之间，我们需要进行某些操作。那么在 redux,我们为什么要引入中间件呢？到目前为止，我们来捋一下我们刚刚进行的步骤：

1. 创建 store

```ts
import { createStore } from 'redux'
const store = createStore(reducer)
```

2. 发出 action

```ts
store.dispatch({
  type: 'ADD_ITEM',
  payload: 'new item', // 可选属性
})
```

3. reducer 计算返回新的 state

```ts
const reducer = function(prevState, action) {
  ...
  return newState;
};
```

我们发现，我们这次发起的变更，都是同步操作，那么问题来了。假如我们`state`里面有一个列表：`list`，用户根据在`view`上面点击了一些筛选条件，发起请求，然后变更`state`里面`list`的值。在这里，有异步请求，但是我们变更 redux 的过程都是同步的，显然是不支持异步的，所以这里就用到中间件了。那么我们应该将异步请求放在以上哪个步骤去执行呢？显然第 1 步和第 3 步不可能，其中第 1 步只是在创建 `store`，第 3 步 `reducer` 是纯函数，根本不可能加入异步操作。所以我们很自然的想到，就是在 `store.dispatch` 的之后，到达`reducer`之前进行异步操作：

```ts
store.dispatch = function(prevAction) async{
  console.log("发请求啦");
  // 异步操作执行完成之后才派发action
  const list = await getList();
  // 把 list 放到action里面
  const newAction = {
    type: prevAction.type,
    payload:list
  }
  store.dispatch(newAction);
};
```

就是给`store.dispatch`再包裹一层，这就是中间件的原理。
redux 常见的中间件有`redux-thunx`、`redux-promise`、`redux-saga`。相关用法在这里不再赘述。
redux 应用中间件的方法：

```ts
import { applyMiddleware, createStore } from 'redux'
import myMiddleware from './myMiddleware'

const store = createStore(reducer, applyMiddleware(myMiddleware))
```

#### 通知变更

那么到这一步了，我们变更了 `state`，下一步是将变更通知给 `view` 了。在 redux 里面，提供了`store.subscribe(listener)`这个方法,这个方法传入一个`listener`,比如在 `react` 里面，`listener`可以是`this.setState(xxx)`,每当 `redux` 里面的`state`改变了，通过`store.subscribe(listener)`我们的页面也会重新渲染。意思是我们每个页面都得手动去`store.subscribe(listener)`，这也太麻烦了吧，对吧。

### `react-redux` 和 `redux`

为了解决上述的痛点问题，更好的将 `redux` 和 `react` 结合，官方给我们提供了`react-redux`这个包（可能你到现在脑子有点乱了，我刚开始也是）。那么现在，我们需要明确一个概念：`redux` 和 `react` 是两个八竿子不着的人。`redux` 只是一个状态管理框架，`react` 只是一个前端应用框架。`redux` 可以用于前端任何框架，例如 `vue`，甚至纯 `javaScript` 都可以。后来 `react-redux` 出现了，他把 `redux` 和 `react` 撮合在一起了，于是他们两强强联合，风云合璧，所向披靡，好了不扯了。说了这么多就是想说明 `react-redux` 这个包的作用。

在详细说明`react-redux`的作用之前，我们先介绍以下知识点：
`react-redux`将 react 组件划分为`容器组件`和`展示组件`，其中

- 展示组件：只是负责展示 UI，不涉及到逻辑的处理，数据来自父组件的`props`;
- 容器组件：负责逻辑、数据交互，将 state 里面的数据传递给`展示组件`进行 UI 呈现

容器组件是`react-redux`提供的，也就是说，我们只需要负责展示组件，`react-redux`负责状态管理。

我们知道，`redux`提供了一个大的`state`。这里我们需要面对两个问题，第一个问题，如何让我们`react`项目里面的所有组件都能够拿到`state`？；第二个，每当`state`变更之后，组件如何收到变更信息？

##### `Provider`

针对第一个问题，`react-redux`提供了`Provider`组件。用这个`Provider`包裹根组件，将`redux`导出的`state`，作为参数往下面传

```tsx
import React from "react";

import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store"; // 这个store由redux导出
···
<Provider store={store}>
  <App />
</Provider>;
···
return
```

这样所有的组件都能拿到`state`了。这个 Provider 组件原理就是通过`react`的`Context`来实现的，我们可以看看源码:

```tsx
....
const Context = context || ReactReduxContext;
return <Context.Provider value={contextValue}>{children}</Context.Provider>;
....
```

这里的`contextValue`就包裹了我们传入的`store`，很明显，它创建了 Context，通过`<Context.Provider value={contextValue}>{children}</Context.Provider>`这种方式将我们传入的`store`提供给了`react`所有组件。

##### `connect`

在上面我们知道怎么将 redux 暴露出来的 state 提供给 react 组件的，那么接下来，我们在某个子组件里面如何收到 state 的变更呢？`react-redux`给我们提供了`connect`方法。这个方法可以传入两个可选参数:`mapStateToProps`和`mapDispatchToProps`，然后会返回一个容器组件，这个组件可以自动监听 `state` 的变更，将 `state` 的值映射为组件的 `props` 参数，之后我们可以直接通过 `this.props` 取到 `state` 里面的值。

```tsx
const mapStateToProps = (state) => ({
  goodsList: state.goodsList,
  totalCount: state.totalCount,
});

export default connect(
  mapStateToProps, // 可选
// mapDispatchToProps, // 可选
(GoodsList);
```

`mapStateToProps`就是将 state 的值映射为组件的`props`，`mapDispatchToProps`就是将`store.dispatch`映射为`props`。如果我们不传`mapDispatchToProps`的话，`connect`会自动将 `dispatch` 注入到 `props` 里面，我们在组件里可以直接通过`this.props.dispatch`发起一个`action`给`reducer`。

### `connected-react-router` 和 `redux`

当我们在项目中同时用了`react-router` 和 `redux`的时候，我们可以把他们两个深度整合。我们想要在`store`里面拿到`router`，甚至可以操作`router`，还可以记录`router`的改变。例如我们把用户是否登录的状态存在`redux`里面，在登录之后会进行页面的跳转。正常的操作是我们在发起请求之后，得到一个状态，此时我们需要`dispatch`一个`action`去改变`redux`的状态，同时我们需要进行路由的跳转，类似于这样:`store.dispatch(replace('/home'))`。想要实现这种深度整合，我们需要用到 `connected-react-router`和`history`两个库。

首先需要`history`生成`history`对象，结合`connected-react-router`的`connectRouter`生成`routerReducer`，同时利用`connected-react-router`的`routerMiddleware`实现`dispatch action`导航，也就是我们刚刚说的`store.dispatch(replace('/home'))`:

```tsx
// APP.tsx
const createHistory = require('history').createBrowserHistory
export const history = createHistory()

// reducer/index.ts
const routerReducer = connectRouter(history)
const routerMiddlewareForDispatch = routerMiddleware(history)
const middleware = [routerMiddlewareForDispatch]
```

接着利用`redux`的`combineReducers`将我们自己的`reducer`和`routerReducer`合并起来，组成`rootReducer`，然后利用 `createStore`创建`store`并暴露出去:

```tsx
// reducer/index.ts
export default function geneGrateSotore(history: any) {
  const routerReducer = connectRouter(history)
  const routerMiddlewareForDispatch = routerMiddleware(history)
  const middleware = [routerMiddlewareForDispatch]
  //合并routerReducer
  const rootRuder = combineReducers({
    info: infoRuder,
    router: routerReducer,
  })

  const store = createStore(rootRuder, applyMiddleware(...middleware))
  return store
}
```

最后我们在`App.tsx`导入刚刚我们创建的这个方法，生成`store`,接着将我们创建的`history`对象传入`connected-react-router`的`ConnectedRouter`组件作为`props`，并用它包裹我们的`Router`组件:

```tsx
// App.tsx
import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import geneGrateSotore from './store'
import Router from './router'
import './App.css'

const createHistory = require('history').createBrowserHistory
const history = createHistory()
const store = geneGrateSotore(history)

const f: React.FC = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Router></Router>
      </ConnectedRouter>
    </Provider>
  )
}

export default f
```

这样我们就将`connected-react-router` 和 `redux`整合起来了。现在当我们在`View`利用`Link`进行路由跳转的时候，会通过`react-router-dom`进行路由跳转，并且也会通过`connected-react-router`发起一个`action`去更新`redux state`里面的`router`对象，以记录路由的变化。同时现在我们在状态管理的时候，也可以直接通过`connected-react-router`提供的`push`、`replace`等方法了，他们是从 `redux` 出发，也就是说先发起一个`action`，然后再进行路由跳转。

### dva

## 性能优化

我们都知道，react 是数据驱动视图的变化，即是通过`reder`来渲染视图，当数据(即状态)变化时，我们的页面就应当重新渲染。但是应用复杂之后就会出现这种情况：一个父组件 A 下面包含了多个子组件 B、C、D。假如 B、C 组件用到了父组件 A 的某个属性，子组件 D 却没有用到这个属性，当父组件的这个属性改变的时候，他下面的子组件 B、C 组件重新渲染，但是子组件 D 本不需要重新渲染，但是他没办法，他也被重新渲染了。这就造成了性能浪费了。说这么多，不如我们来看个例子：

```tsx
// 父组件
import React, { Component } from 'react'
import { Button } from 'antd'
import Son1 from './son1'
import Son2 from './son2'
import Son3 from './son3'

interface Istate {
  info1: string
  info2: string
}
export class Parent extends Component<Istate> {
  state: Istate = {
    info1: 'info1',
    info2: 'info2',
  }
  info1Change = () => {
    this.setState({
      info1: 'info1被改变了...',
    })
  }
  render() {
    return (
      <div>
        <p>父组件</p>
        <Button onClick={this.info1Change}> 点击更改info1</Button>
        <Son1 info1={this.state.info1} />
        <Son2 info2={this.state.info2} />
      </div>
    )
  }
}

export default Parent

// 子组件1
import React, { Component } from 'react'

interface Iprops {
  info1: string
}

class Son1 extends Component<Iprops> {
  render() {
    console.log('son1重新渲染了....')
    return (
      <div>
        <p>我是son1</p>
        <p>{this.props.info1}</p>
      </div>
    )
  }
}
export default Son1

// 子组件2
import React, { Component } from 'react'

interface Iprops {
  info2: string
}

class Son2 extends Component<Iprops> {
  render() {
    console.log('son2重新渲染了....')
    return (
      <div>
        <p>我是son2</p>
        <p>{this.props.info2}</p>
      </div>
    )
  }
}
export default Son2
```

上面这个例子，父组件提供了两个值：`info1` 和 `info2`，其中 `Son1` 组件只用到了 `info1`，`Son2` 组件只用到了 `info2`。我们在父组件中，点击了按钮改变了 `info1` 的值，父组件必须重新渲染，因为它自身状态改变了，`Son1` 也应该重新渲染，因为它依赖于 `info1`，而 `Son2` 是否应该重新渲染呢？按道理，它不应该重新渲染，因为 `info2` 没有改变，但是当我们每次点击按钮改变 `info1` 的时候，`Son1` 和`Son2` 都重新渲染了，这就明显存在问题了。

### shouldComponentUpdate

在上面 👆 生命周期章节，我们讲到了`shouldComponentUpdate`这个生命周期钩子，它接收两个参数，一个是下一次的 `props` 和下一次的 `state`，在这里，我们拿到下一次的 `props`(`nextProps`)和当前的 `props` 进行比较，根据我们的场景，返回一个 `bool` 变量，返回 `true`，则表示要更新当前组件，返回 `false` 则表示不更新当前组件。

```tsx
import React, { Component } from 'react'

interface Iprops {
  info2: string
}

class Son2 extends Component<Iprops> {
  // 利用生命周期 shouldComponentUpdate 进行比较
  shouldComponentUpdate(nextProps: Iprops, nextState: any) {
    if (nextProps.info2 === this.props.info2) return false
    return true
  }
  render() {
    console.log('son2重新渲染了....')
    return (
      <div>
        <p>我是son2</p>
        <p>{this.props.info2}</p>
      </div>
    )
  }
}
export default Son2
```

当我们再次点击按钮更改`info1`的值，发现`Son2`就不会再重新渲染了。

### PureComponet

`react`为我们提供了`PureComponet`的语法糖，用它也可以用作组件是否渲染的比较。它的原理就是内部实现了`shouldComponentUpdate`。让我们用`PureComponet`来改造一下刚刚的`Son2`组件:

```tsx
```

## hooks

## 错误捕获

## 服务(pont)

## 参考

1、https://medium.com/dailyjs/when-do-i-know-im-ready-for-redux-f34da253c85f

2、https://juejin.im/post/5c18de8ef265da616413f332

3、https://juejin.im/post/5dcaaa276fb9a04a965e2c9b
