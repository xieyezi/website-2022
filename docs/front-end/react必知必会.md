---
title: react 必知必会
---

# react 必知必会

## 组件通信

### props

适用于父子组件通信

#### 父组件->子组件

父组件将需要传递的参数通过`key={xxx}`方式传递至子组件，子组件通过`this.props.key`获取参数.

```tsx
import React from "react";
import Son from "./son";
class Father extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  state = {
    info: "父组件",
  };
  handleChange = (e) => {
    this.setState({
      info: e.target.value,
    });
  };
  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.info}
          onChange={this.handleChange}
        />
        <Son info={this.state.info} />
      </div>
    );
  }
}
export default Father;

// 子组件
import React from "react";
interface IProps {
  info?: string;
}
class Son extends React.Component<IProps> {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <p>{this.props.info}</p>
      </div>
    );
  }
}
export default Son;
```

#### 子组件->父组件

利用 props callback 通信，父组件传递一个 callback 到子组件，当事件触发时将参数放置到 callback 带回给父组件.

```tsx
// 父组件
import React from "react";
import Son from "./son";
class Father extends React.Component {
  constructor(props) {
    super(props);
    this.callback = this.callback.bind(this);
  }
  state = {
    info: "",
  };
  callback = (value) => {
    // 此处的value便是子组件带回
    this.setState({
      info: value,
    });
  };
  render() {
    return (
      <div>
        <p>{this.state.info}</p>
        <Son callback={this.callback} />
      </div>
    );
  }
}
export default Father;

// 子组件
import React from "react";
interface IProps {
  callback: (string) => void;
}
class Son extends React.Component<IProps> {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange = (e) => {
    // 在此处将参数带回
    this.props.callback(e.target.value);
  };
  render() {
    return (
      <div>
        <input type="text" onChange={this.handleChange} />
      </div>
    );
  }
}
export default Son;
```

### Context

适用于跨层级组件之间通信

```tsx
// context.js
import React from "react";
const { Consumer, Provider } = React.createContext(null); //创建 context 并暴露Consumer和Provide
export { Consumer, Provider };

// 父组件
import React from "react";
import Son from "./son";
import { Provider } from "./context";
class Father extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    info: "info from father",
  };
  render() {
    return (
      <Provider value={this.state.info}>
        <div>
          <p>{this.state.info}</p>
          <Son />
        </div>
      </Provider>
    );
  }
}
export default Father;

// 子组件
import React from "react";
import GrandSon from "./grandson";
import { Consumer } from "./context";
class Son extends React.Component {
  constructor(props) {
    super(props);
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
    );
  }
}
export default Son;

// 孙子组件
import React from "react";
import { Consumer } from "./context";
class GrandSon extends React.Component {
  constructor(props) {
    super(props);
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
    );
  }
}
export default GrandSon;
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
import React from "react";
import Son from "./son";
import { Button } from "antd";

class Father extends React.Component {
  child: any;
  constructor(props) {
    super(props);
  }
  sonRef = (ref) => {
    this.child = ref; // 在这里拿到子组件的实例
  };
  clearSonInput = () => {
    this.child.clearInput();
  };
  render() {
    return (
      <div>
        <Son onRef={this.sonRef} />
        <Button type="primary" onClick={this.clearSonInput}>
          清空子组件的input
        </Button>
      </div>
    );
  }
}
export default Father;

// 子组件
import React from "react";
import { Button } from "antd";

interface IProps {
  onRef: any;
}

class Son extends React.Component<IProps> {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.onRef(this); // 在这将子组件的实例传递给父组件this.props.onRef()方法
  }
  state = {
    info: "son",
  };
  handleChange = (e) => {
    this.setState({
      info: e.target.value,
    });
  };
  clearInput = () => {
    this.setState({
      info: "",
    });
  };
  render() {
    return (
      <div>
        <div>{this.state.info}</div>
        <input type="text" onChange={this.handleChange} />
      </div>
    );
  }
}
export default Son;
```

### ref

`ref`是`react`提供给我们的一个属性,通过它，我们可以访问 `DOM` 节点或者组件.

```tsx
// 父组件
import React from "react";
import Son from "./son";
import { Button } from "antd";

class Father extends React.Component {
  son: any;
  constructor(props) {
    super(props);
    this.son = React.createRef(); // 在此处创建ref
  }
  clearSonInput = () => {
    const { current } = this.son; // 注意，这里必须通过 this.son.current拿到子组件的实例
    current.clearInput();
  };
  render() {
    return (
      <div>
        <Son ref={this.son} />
        <Button type="primary" onClick={this.clearSonInput}>
          清空子组件的input
        </Button>
      </div>
    );
  }
}
export default Father;

// 子组件
import React from "react";
import { Button } from "antd";

class Son extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    info: "son",
  };
  handleChange = (e) => {
    this.setState({
      info: e.target.value,
    });
  };
  clearInput = () => {
    this.setState({
      info: "",
    });
  };
  render() {
    return (
      <div>
        <div>{this.state.info}</div>
        <input type="text" onChange={this.handleChange} />
      </div>
    );
  }
}
export default Son;
```

> 值得注意的是，我们必须通过 `this.childRef.current`才能拿到子组件的实例。  
> 使用 ref 常见的场景有管理焦点，文本选择或媒体播放、触发强制动画、集成第三方 DOM 库等。

### 第三方工具

### events(发布订阅)

这种方式适用于没有任何嵌套关系的组件通信。其原理就是使用事件订阅。即是一个发布者，一个或者多个订阅者。
使用之前需要先安装:

```
yarn install events
```

```tsx
// event.ts
import { EventEmitter } from "events";
export default new EventEmitter();

// 发布者 通过emit事件触发方法，发布订阅消息给订阅者
import React from "react";
import Son1 from "./son1";
import Son2 from "./son2";
import { Button } from "antd";
import emitter from "./event";

class Father extends React.Component {
  son: any;
  constructor(props) {
    super(props);
  }
  handleClick = () => {
    //emit事件触发方法,通过事件名称找对应的事件处理函数info，将事件处理函数作为参数传入
    emitter.emit("info", "我是来自father的 info");
  };
  render() {
    return (
      <div>
        <Button type="primary" onClick={this.handleClick}>
          点击按钮发布事件
        </Button>
        <Son1 />
        <Son2 />
      </div>
    );
  }
}
export default Father;

// 订阅者1
// 通过emitter.addListener(事件名称,函数名)方法，进行事件监听(订阅)。
// 通过emitter.removeListener(事件名称,函数名)方法 ，进行事件销毁(取消订阅)

import React from "react";
import { Button } from "antd";
import emitter from "./event";

class Son1 extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    info: "",
  };
  componentDidMount() {
    // 在组件挂载完成后开始监听
    emitter.addListener("info", (info) => {
      this.setState({
        info: "Son1收到消息--" + info,
      });
    });
  }

  componentWillUnmount() {
    // 组件销毁前移除事件监听
    emitter.removeListener("info", (info) => {
      this.setState({
        info: "Son1即将移除事件监听--" + info,
      });
    });
  }
  render() {
    return (
      <div>
        <div>{this.state.info}</div>
      </div>
    );
  }
}
export default Son1;

// 订阅者2
import React from "react";
import { Button } from "antd";
import emitter from "./event";

class Son2 extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    info: "",
  };
  componentDidMount() {
    // 在组件挂载完成后开始监听
    emitter.addListener("info", (info) => {
      this.setState({
        info: "Son2收到消息--" + info,
      });
    });
  }

  componentWillUnmount() {
    // 组件销毁前移除事件监听
    emitter.removeListener("info", (info) => {
      this.setState({
        info: "Son2即将移除事件监听--" + info,
      });
    });
  }
  render() {
    return (
      <div>
        <div>{this.state.info}</div>
      </div>
    );
  }
}
export default Son2;
```

### redux

## 路由

### 区别和联系

`react-router` 包含 `3` 个，分别为`react-router`、`react-router-dom` 和 `react-router-native`。

`react-router`提供最基本的路由功能，但是实际使用的时候我们不会直接安装 `react-router`，而是根据应用运行的环境来选择安装 `react-router-dom`和`react-router-native`。因为`react-router-dom` 和 `react-router-native` 都依赖 `react-router`，所以在安装时，`react-router` 也会⾃自动安装。

其中`react-router-dom` 在浏览器器中使⽤，而`react-router-native`在 `react-native` 中使用。

### 基本使用

常用 BrowserRouter 、链接-Link、路由-Route、独占路由 Switch、重 定向路由-Redirect。

```
// RouterPage
// import React, { Component } from 'react';
// import { BrowserRouter, Link, Route,Switch } from 'react-router-dom';
import HomePage from './HomePage';
import UserPage from './UserPage';
import SearchPage from './Search';
import Login from './Login';
export default class RouterPage extends Component {
  render() {
    return (
        <div>
          <h1>RouterPage</h1>
          <BrowserRouter>
            <nav>
              <Link to="/">首页  </Link>
              <Link to="/user">用户中心  </Link>

              <Link to="/login">登陆  </Link>
            </nav>
            {/* 根路路由要添加exact，实现精确匹配 不加这个可能会出现多次渲染 */ }
            <Switch>
              {/*匹配到之后就不在继续往下匹配 Switch作用*/}
              <Route exact path="/" component={ HomePage }/>
              {/*<Route path="/user" component={ UserPage }/>*/}
              <Route path="/login" component={ Login }/>

              {/*404 页面 一定要放到最后*/}
              <Route component={() => <h1>404</h1>} />
            </Switch>
          </BrowserRouter>
        </div>
    );
  }
}
```
