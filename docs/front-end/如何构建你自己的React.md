现在，我们将要遵循 React 代码的体系结构，一步步的实现我们自己的 React 版本。但是本次并不会将优化以及非必要的特性加入进来。
如果你有阅读过我以前任何一篇 构建你自己的 React 文章，这次的不同点在于，本次构建是基于 React 的16.8版本，所以这意味着我们可以使用 hooks 来替代 class。
你可以在之前的文章或者 Didact 代码仓库中了解之前构建的 react。而且这里还有一个内容相同的视频。但是本篇文章包含完整的构建过程，并不会依赖于之前的内容。
那从头开始，下面是需要我们加入到本次 react 构建中的特性。

- 步骤一：createElement 函数
- 步骤二：render 函数
- 步骤三：Concurrent 模式（了解更多）
- 步骤四：Fibers（了解更多）
- 步骤五：渲染和提交 
- 步骤六：Reconciliation（了解更多）
- 步骤七：函数组件
- 步骤八：Hooks（了解更多）

开始之前：回顾
首先我们回顾一些基本的概念。如果你已经对 React、JSX 和 DOM 元素的原理有一个很好的了解，那么可以跳过这一步。
我们使用如下 React 应用来作为例子，这个例子只需要三行代码。第一行创建了一个 React 元素。接下来从 DOM 中获取一个节点。最后将 React 元素渲染到获取的 DOM 节点中。
```ts
const element = <h1 title="foo">Hello</h1>
const container = document.getElementById("root")
ReactDOM.render(element, container)
```
使用原生 JS 替换掉所有的 React 代码。
在第一行中使用 JSX 创建了一个元素。但 JSX 并不是有效的 Javascript 代码，所以需要使用原生 JS 来替换掉。
JSX 可以被 Babel 等编译工具转换为 JS。这个转换过程通常很简单：调用 createElement 函数替换掉标签内的代码，将标签名、props 属性和 childen元素 作为参数传入。
```ts
// 转换前
const element = <h1 title="foo">Hello</h1>
// 转换后
const element = React.createElement(
  "h1",
  { title: "foo" },
  "Hello"
)
```
 React.createElement  根据参数创建了一个对象。除了一些校验，这就是这个函数做的全部工作。所以我们可以直接使用它的输出来替换掉函数调用。
 ```ts
// 转换前
const element = React.createElement(
  "h1",
  { title: "foo" },
  "Hello"
)
// 转换后
const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
}
```
这就是一个 React 元素的本质，一个包含两个属性的对象：type 和 props（当然，还有更多属性，但是我们只关注这两个）。
type 是一个标识我们想创建的 DOM 元素类型的字符串，当你想创建一个 HTML 元素时，type作为一个 标签名 参数传入到 document.createElemnt 函数中。我们将在第七步中使用它。
props 是一个包含所有 JSX 属性的对象，它还有一个特殊的属性：children。
children 在这个例子中是一个字符串，但是它通常都是一个有很多元素的数组。数组中的每个元素还可能有自己的子元素，所以最后所有的元素会组成一个树状结构。
我们需要替换的另外一部分是 ReactDom.render 函数的调用。
render 是 React 改变 DOM 的地方，那么接下来我们自己来实现 DOM 的更新。
第一步我们根据例子中的元素类型 h1 创建一个 DOM 节点。
之后我们将所有元素 props 中的属性添加到这个 DOM 节点中。这里需要添加的只有一个 title 属性。
*（为了避免大家产生疑惑，我使用“元素”代指React元素，使用“节点”代指 DOM 元素。）
接下来我们为 children 创建节点。这里我们只有一个字符串作为 children，所以只需要创建一个文本节点。
使用 textNode 而不是设置 innerHTML 是因为之后这样可以以相同的方式去创建其他元素。注意我们是怎么设置 nodeValue 的，就像我们设置 h1 的 title 一样，这就好像字符串有了 props:{nodeValue:"hello"}。
最后，我们将 文本节点 添加到 h1节点 中，然后将 h1节点 添加到从 DOM 中获取到的 container 节点中。
现在我们的应用和之前一样，但是没有使用 React 来构建。
```ts
const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
}
​
const container = document.getElementById("root")
​
const node = document.createElement(element.type)
node["title"] = element.props.title
​
const text = document.createTextNode("")
text["nodeValue"] = element.props.children
​
node.appendChild(text)
container.appendChild(node)
```
第一步 createElement 函数
让我们以另外一个应用开始，这次我们将会把 React 代码替换为我们自己实现的 React 版本。
```ts
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)
const container = document.getElementById("root")
ReactDOM.render(element, container)
```
第一步，我们来实现自己的 createElement。
让我们将 JSX 转换为 JS，这样我们就可以看到 *createElement 函数是如何被调用。
```ts
const element = React.createElement(
 "div",
 {id:"foo"},
 React.createElement("a",null,"bar"),
 React.createElement("b"),
)
const container = document.getElementById("root")
ReactDOM.render(element, container)
```
正如我们在上一步看到的，元素就是一个包含 type 和 props 属性的对象。我们的函数唯一要做的就是去创建一个这样的对象。
```ts
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  }
}
```
我们使用扩展运算符来处理 props，使用rest参数语法来处理 *children，这样 children 属性将始终是一个数组。
举个例子，createElement("div") 返回如下：
```ts
{
  "type": "div",
  "props": { "children": [] }
}
```
createElement("div",null,a) 返回如下：
```ts
{
  "type": "div",
  "props": { "children": [a] }
}
```
createElement("div",null,a,b) 返回如下：
```ts
{
  "type": "div",
  "props": { "children": [a,b] }
}
```
children 数组还可以包含像字符串或者数字这样的基本类型数据。所以我们创建一个特殊的类型：TEXT_ELEMENT 来将所有不是对象的值包装在自己的元素中。
（React 不会像我们这样包装基本类型值，在没有子元素的情况下创建空数组。我们这样做是为了代码的简洁，对于我们的库，在简洁与性能之间更倾向于前者。）
```ts
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children:children.map(child =>
        typeof child === "object"
          ? child
          : createTextElement(child)
      ),,
    },
  }
}
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
}
```
目前我们仍然通过 React 这个名字来调用 createElement。
为了替换它，让我们给库取一个名字吧。我们需要一个听起来像 React，但是也能暗示其教学目的名字。
我们可以叫它 Didact（在英文中，didactic是教学的意思）。
const Didact = {
  createElement,
}

const element = Didact.createElement(
  "div",
  { id: "foo" },
  Didact.createElement("a", null, "bar"),
  Didact.createElement("b")
)
复制代码
但是我们还是希望在这里使用 JSX。那我们怎么告诉 babel 去使用 Didact 的 createElement 而不是 React的呢？
如果我们像这样注释一下，当 babel 转换 JSX 时，就会使用我们定义的函数。
/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)
复制代码
第二步 render 函数
接下来，我们来实现 ReactDOM.render  函数。
现在，我们只需要关注如何把元素放入到 DOM 中。至于如何处理元素的更新和删除，我们会在之后考虑。
function render(element, container) {
  // TODO create dom nodes
}
const Didact = {
  createElement,
  render,
}
复制代码
我们先根据元素的类型创建一个 DOM 节点，之后把这个新节点添加到 container 元素中。
function render(element, container) {
  const dom = document.createElement(element.type)
  
  container.appendChild(dom)
}
复制代码
我们通过递归对每个 child 元素执行相同的操作。
function render(element, container) {
  const dom = document.createElement(element.type)
  
  element.props.children.forEach(child =>
    render(child, dom)
  )
  
  container.appendChild(dom)
}
复制代码
我们还需要处理一下文本元素，如果元素的类型是 TEXT_ELEMENT，那么就需要创建一个文本节点。
function render(element, container) {
  const dom =
    element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type)
  
  element.props.children.forEach(child =>
    render(child, dom)
  )
  
  container.appendChild(dom)
}
复制代码
最后，我们需要做的是，将元素 props 中的属性添加到 DOM 节点上。
function render(element, container) {
  const dom =
    element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type)
  
  // 将元素 props 中的属性添加到 DOM 节点上
  const isProperty = key => key !== "children"
  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = element.props[name]
  })
  
  element.props.children.forEach(child =>
    render(child, dom)
  )
  
  container.appendChild(dom)
复制代码
就这样，我们实现了一个可以渲染 JSX 元素到 DOM 中的库。
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object"
          ? child
          : createTextElement(child)
      ),
    },
  }
}
​
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
}
​
function render(element, container) {
  const dom =
    element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type)
​
  const isProperty = key => key !== "children"
  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = element.props[name]
    })
​
  element.props.children.forEach(child =>
    render(child, dom)
  )
​
  container.appendChild(dom)
}
​
const Didact = {
  createElement,
  render,
}
​
/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)
const container = document.getElementById("root")
Didact.render(element, container)
复制代码
大家可以在 codesandbox 看到完整代码。
第三步 Concurrent 模式
但是...在我们加入更多特性之前我们需要对代码进行一次重构。
因为递归调用会存在这样一个问题：
一旦渲染开始就不会停止。设想一下，如果整个页面包含非常多的元素，渲染过程中就会一直阻塞主进程。如果此时浏览器想去处理一些像用户输入或者保持动画流畅这些高优先级的任务，就需要等到所有的元素渲染完成之后再进行处理，这对于用户来说是非常不好的体验。
所以我们需要做的是将整个任务拆分为一个个小的子任务，浏览器可以在执行完每一个小任务之后中断渲染流程转而去处理一些其他的事情。
let nextUnitOfWork = null
​
function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}
​
requestIdleCallback(workLoop)
​
function performUnitOfWork(nextUnitOfWork) {
  // TODO
}
复制代码
我们使用 reqeustIdleCallback 来创建一个循环任务。你可以把 requestIdleCallback 等同于 setTimeout 。只不过 setTimeout 需要我们告诉它什么时候执行，而 requestIdleCallback 会在浏览器主进程空闲时执行回调。
React 并没有使用 requestIdleCallback 而是使用的这个调度程序包，但是在概念上两者是一致的。
requestIdleCallback 提供了一个 deadline 参数，通过这个参数可以了解到还有多少时间浏览器就会拿回控制权。
截止到2019年11月，Cocurrent 模式还是不稳定的。循环的稳定版本看起来更像这个:
while (nextUnitOfWork) {    
  nextUnitOfWork = performUnitOfWork(   
    nextUnitOfWork  
  ) 
}
复制代码
开始使用循环，我们需要设置初始子任务，之后需要创建一个 performUnitWork 函数，这个函数不仅要执行当前子任务，还需要返回下一个要执行的子任务。
第四步 Fibers
我们使用 fiber 树这种数据结构来连接所有的子任务。
每一个元素对应一个 fiber，每一个 fiber 就是一个子任务。
让我给你举个例子。
如果我们想渲染如下元素：
Didact.render(
  <div>
    <h1>
      <p />
      <a />
    </h1>
    <h2 />
  </div>,
  container
)
复制代码

在 render 中，我们会创建一个根 fiber，并将它设置为 nextUnitOfWork。剩下的工作则会在 performUnitOfWork 中进行，在这个函数中我们要为每个 fiber 做三件事：

将元素添加到 DOM 中。
为元素的子元素创建 fiber。
寻找下一个子任务。

使用这个数据结构的其中一个目的就是为了可以更简单的寻找下一个子任务。这就是为什么每个 fiber 都会指向它的第一个子 fiber、相邻的兄弟 fiber，以及父 fiber。
当执行完一个 fiber 任务后，如果这个 fiber 有一个子 fiber，那这个子 fiber 就是下一个要执行的子任务。
举个例子，当处理完 div fiber，接下来就会处理 h1 fiber。
如果当前 fiber 没有子 fiber，那么就会把它的兄弟 fiber 作为下一个要执行的子任务。
举个例子，p fiber没有子 fiber，所以我们会在当前 fiber 任务结束后去处理 a fiber。
如果当前 fiber 既没有子 fiber 也没有兄弟 fiber。就需要去到“叔叔”那里：兄弟 fiber 的父 fiber。就像例子中的 a 和 h2 fiber。
如果父 fiber 没有兄弟 fiber，就需要继继续向上寻找，直至找到有兄弟 fiber 的 fiber 节点或者到达根 fiber。如果到达根 fiber，就代表已经完成本次渲染的所有工作。
现在，我们将以上处理逻辑加入到代码中。
首先，需要从 render 函数中移除创建 DOM 节点的代码。
我们将创建 DOM 节点的逻辑单独放在 createDom 函数中，这个函数我们会在之后用到。
function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type)
​
  const isProperty = key => key !== "children"
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = fiber.props[name]
    })
​
  return dom
}
复制代码
在 render 函数中，我们将 fiber 树的根节点赋值给 nextUnitOfWork。
function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  }
}
​
let nextUnitOfWork = null
复制代码
之后，如果浏览器有空闲时间了，就会调用我们的 workLoop,从根节点开始工作。
首先，我们创建一个节点并将其添加到DOM中。
我们可以在 fiber.dom 中获取到这个 DOM 节点。
function performUnitOfWork(fiber) {
  // 将元素添加到 DOM 中
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
​
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }
​
  // TODO 为子元素创建 fiber 节点 
  // TODO 返回下一个子任务
}
复制代码
之后，我们为每一个子元素创建一个新的 fiber 节点。
并且根据是否是第一个子节点将其作为孩子节点或者兄弟节点添加到 fiber 树中。
function performUnitOfWork(fiber) {
  // 将元素添加到 DOM 中
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
​
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }
​
  // 为子元素创建 fiber 节点
  const elements = fiber.props.children
  let index = 0
  let prevSibling = null
​
  while (index < elements.length) {
    const element = elements[index]
​
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    }
   
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
​
    prevSibling = newFiber
    index++
  }
  
  // TODO 返回下一个子任务
}
复制代码
最后，我们按照子节点、兄弟节点、叔叔节点的顺序依次类推，来找到下一个子任务。
function performUnitOfWork(fiber) {
  // 将元素添加到 DOM 中
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
​
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }
​   
  // 为子元素创建 fiber 节点
  const elements = fiber.props.children
  let index = 0
  let prevSibling = null
​
  while (index < elements.length) {
    const element = elements[index]
​
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    }
   
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
​
    prevSibling = newFiber
    index++
  }
  
  // 返回下一个子任务
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}
复制代码
以上就是 performUnitOfWork 的全部逻辑。
第五步 渲染与提交阶段
经过上面一系列的处理，另外一个问题出现了。
我们在处理一个元素时会为其创建一个节点添加到 DOM 中。但是要记得，浏览器是会打断渲染过程的，这样用户就会看到一个不完整的UI，这不是我们想要看到的结果。
所以我们需要从 performUnitOfWork 函数中删除添加 DOM 的代码。
function performUnitOfWork(fiber) {
  // 将元素添加到 DOM 中
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
​
//  删除添加 DOM 的部分
//  if (fiber.parent) {
//    fiber.parent.dom.appendChild(fiber.dom)
//  }
​   
  // 为子元素创建 fiber 节点
  const elements = fiber.props.children
  let index = 0
  let prevSibling = null
​
  while (index < elements.length) {
    const element = elements[index]
​
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    }
   
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
​
    prevSibling = newFiber
    index++
  }
  
  // 返回下一个子任务
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}
复制代码
我们添加一个新的变量指向 fiber 树的根节点。我们可以将其命名为 work in progress root（正在工作流程中的根节点）或者 wipRoot。
function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  }
  nextUnitOfWork = wipRoot
}
​
let nextUnitOfWork = null
let wipRoot = null
复制代码
这样，直到完成本次渲染的全部工作（此时已经没有下一个子任务）才会将整个 fiber 树提交到 DOM 中。
我们在 commitRoot 函数中处理添加逻辑。在函数中通过递归的形式将所有节点添加到 DOM 中。
function commitRoot() {
  commitWork(wipRoot.child)
  wipRoot = null
}
​
function commitWork(fiber) {
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom
  domParent.appendChild(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}


function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    shouldYield = deadline.timeRemaining() < 1
  }
  
​ // 直到没有下一个子任务，将整个 fiber 树提交到 DOM 节点中
  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
​
  requestIdleCallback(workLoop)
}
​
requestIdleCallback(workLoop)
复制代码
第六步 协调阶段（Reconciliation）
到目前为止，我们只是将元素添加到了 DOM 中，但是我们怎么去更新或者删除节点呢？
这正是我们现在要去做的。我们需要将 render 函数中返回的元素与上一次提交到 DOM 中的 fiber 树进行比较。
所以我们需要在上一个 fiber树提交之后保存对其的引用，我们可以称为 currentRoot。
我们还需要在每个 fiber 节点中添加一个 alternate 属性。这个属性会保存上一次提交到 DOM 中的fiber节点。
function commitRoot() {
  commitWork(wipRoot.child)
  // 将 DOM 更新之后，更新当前 fiber 树
  currentRoot = wipRoot
  wipRoot = null
}
​

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  }
  nextUnitOfWork = wipRoot
}
​
let nextUnitOfWork = null
// 增加 currentRoot 用于保存当前提交到 DOM 中的 fiber 树
let currentRoot = null
let wipRoot = null
复制代码
现在，我们将 performUnitOfWork 中关于创建新的 fiber 节点的逻辑移动到一个新的 reconcileChildren 函数中。
function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
​
  const elements = fiber.props.children
  // 将创建新的 fiber 节点的逻辑移动到 reconcileChildren 函数中
  reconcileChildren(fiber, elements)
​
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

function reconcileChildren(wipFiber, elements) {
  let index = 0
  let prevSibling = null
​
  while (index < elements.length) {
    const element = elements[index]
​
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: wipFiber,
      dom: null,
    }
​
    if (index === 0) {
      wipFiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
​
    prevSibling = newFiber
    index++
  }
}
复制代码
在 reconcileChildren 函数中，我们会把旧的 fiber 与新的元素进行协调（比较和复用）。
我们同时迭代旧的 fiber 的子节点以及我们想要协调的元素数组。
如果我们忽略掉迭代的代码，那么只剩下最重要的部分：旧的 fiber 和元素，元素是我们想要渲染到 DOM 中的东西，旧的 fiber 是我们上一次要渲染的内容。
我们需要对它们进行比较，看看是否需要对 DOM 进行任何更改。
function reconcileChildren(wipFiber, elements) {
  let index = 0
  // 获取旧的 fiber 节点
  let oldFiber =
    wipFiber.alternate && wipFiber.alternate.child
  let prevSibling = null
​
 
  while (
    index < elements.length ||
    oldFiber != null
  ){
    const element = elements[index]
    let newFiber = null;
​   
    // TODO 在这里将旧的 fiber 节点与元素作比较
    
    if(oldFiber){
        oldFiber = oldFiber.sibling;
    }
​
    if (index === 0) {
      wipFiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
​
    prevSibling = newFiber
    index++
  }
}
复制代码
我们使用 type 属性来比较它们：

如果之前的 fiber 节点和新的元素 type 属性相同，那就保留这个 DOM 节点，只需要更新一下新的 props 属性。
如果 type 属性不同，并且存在新的元素，这就意味着我们需要创建一个新的 DOM 节点。
如果 type 属性不同，并且存在旧的 fiber 节点，那么就需要移除这个节点。

*（为了在协调阶段可以更好的进行比较，React还在这个阶段使用了 key 属性。举个例子，通过添加 key 属性可以知道数组中的元素是否只是调换了顺序，从而直接复用之前的节点。）
function reconcileChildren(wipFiber, elements) {
  let index = 0
  // 获取旧的 fiber 节点
  let oldFiber =
    wipFiber.alternate && wipFiber.alternate.child
  let prevSibling = null
​
 
  while (
    index < elements.length ||
    oldFiber != null
  ){
    const element = elements[index]
    let newFiber = null;
​   
    // 在这里将旧的 fiber 节点与元素作比较
    const sameType =
      oldFiber &&
      element &&
      element.type == oldFiber.type
​
    if (sameType) {
      // TODO 更新节点
    }
    if (element && !sameType) {
      // TODO 添加节点
    }
    if (oldFiber && !sameType) {
      // TODO 删除旧的 fiber 中的节点
    }
    
    if(oldFiber){
        oldFiber = oldFiber.sibling;
    }
​
    if (index === 0) {
      wipFiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
​
    prevSibling = newFiber
    index++
  }
}
复制代码
当旧的 fiber 节点与新元素的 type 属性相同时，我们创建新的 fiber 节点时会复用旧的 fiber 节点的 DOM 对象。
我们还需要给 fiber 节点添加一个 effectTag 的属性。这个属性会在之后的提交阶段用到。
if (sameType) {
// 更新节点
   newFiber = {
     type: oldFiber.type,
     props: element.props,
     dom: oldFiber.dom,
     parent: wipFiber,
     alternate: oldFiber,
     effectTag: "UPDATE",
   }
 }
复制代码
在当前这个例子中，如果元素需要创建一个新的 DOM 节点，就需要将fiber的 effectTag 属性标记为 PLACEMENT。
if (element && !sameType) {
//  添加节点
  newFiber = {
    type: element.type,
    props: element.props,
    dom: null,
    parent: wipFiber,
    alternate: null,
    effectTag: "PLACEMENT",
  }
}
复制代码
如果当前元素需要被删除，那么就不需要创建一个新的 fiber 节点，所以我们将旧的 fiber 节点的 effectTag 属性标记为 DELETION。
if (oldFiber && !sameType) {
// 删除旧的 fiber 中的节点
   oldFiber.effectTag = "DELETION"
   deletions.push(oldFiber) // deletions 哪来的？我们来马上分解一下
}
复制代码
但是当我们将 wipRoot 指向的这个 fiber 树提交到 DOM 中时是不包含这个旧的 fiber 节点。
所以我们需要一个数组用来存储需要被删除的 fiber 节点。
function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  }
  deletions = [] // 新增
  nextUnitOfWork = wipRoot
}
​
let nextUnitOfWork = null
let currentRoot = null
let wipRoot = null
// 新增 deletions 用来存储要删除的 fiber 节点
let deletions = null 
复制代码
这样在我们将改变提交到 DOM 的时候，就可以通过这个数组删除不再需要的 DOM 节点。
function commitRoot() {
  deletions.forEach(commitWork) // 
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}
复制代码
现在，让我们在 commitWork 函数里面根据新加入的 effectTags 属性做一些处理。
如果 fiber 节点的 effectTag 的属性为 PLACEMENT，我们只需要像之前那样将 DOM 节点放入到父 fiber 对应的 DOM 节点中。
如果属性为 DELETION，则与前一步相反，我们就需要移除这个 DOM 节点。
如果属性为 UPDATE，我们就需要根据 props 属性的改变来更新已经存在的 DOM 节点。
function commitWork(fiber) {
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom
  // 将新节点添加到 DOM 中
  if (
    fiber.effectTag === "PLACEMENT" &&
    fiber.dom != null
  ) {
    domParent.appendChild(fiber.dom)
  }
  // 更新节点
  else if (
    fiber.effectTag === "UPDATE" &&
    fiber.dom != null
  ) {
    // updateDom 又在哪？呵呵，继续往下看吧
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props
    )
  } 
  // 删除节点
  else if (fiber.effectTag === "DELETION") {
    domParent.removeChild(fiber.dom)
  }
​
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
复制代码
我们在 updateDom 函数中来处理更新 DOM 的逻辑。
我们比较旧的 fiber 节点与新的 fiber 节点之间的 props 属性的差异，删除不存在的属性，设置新的属性，以及更新改变的属性。
const isProperty = key => key !== "children"
const isNew = (prev, next) => key =>
  prev[key] !== next[key]
const isGone = (prev, next) => key => !(key in next)

function updateDom(dom, prevProps, nextProps) {
  // 删除不再需要的属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = ""
    })
​
  // 更新或者设置新的属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name]
    })
}
复制代码
除此之外，我们还要对事件监听这个特殊的 porps 属性进行特殊处理。所以如果 prop 的属性名是以 “on” 为前缀，我们就需要对其进行差异处理。
如果事件处理函数发生改变，我们就从节点上将这个事件监听移除。
之后我们再添加新的事件处理函数。
const isEvent = key => key.startsWith("on")
const isProperty = key =>
  key !== "children" && !isEvent(key)
  
const isProperty = key => key !== "children"
const isNew = (prev, next) => key =>
  prev[key] !== next[key]
const isGone = (prev, next) => key => !(key in next)

function updateDom(dom, prevProps, nextProps) {
  // 删除旧的事件监听
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      key =>
        !(key in nextProps) ||
        isNew(prevProps, nextProps)(key)
    )
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.removeEventListener(
        eventType,
        prevProps[name]
      )
    })
    
  // 删除不再需要的属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = ""
    })
​
  // 更新或者设置新的属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name]
    })

  // 添加新的事件监听
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.addEventListener(
        eventType,
        nextProps[name]
      )
    })
}
复制代码
大家可以在codesandbox浏览添加了协调机制的代码版本。
第七步 函数组件
接下来我们要做的事情就是增加对函数组件的支持。
首先，需要更换一下例子。我们使用一个简单的函数组件，这个组件会返回一个 h1 元素。
/** @jsx Didact.createElement */
function App(props) {
  return <h1>Hi {props.name}</h1>
}
const element = <App name="foo" />
const container = document.getElementById("root")
Didact.render(element, container)
复制代码
请注意，如果们将 jsx 转换为 那么将会是下面这个样子：
function App(props) {
  return Didact.createElement(
    "h1",
    null,
    "Hi ",
    props.name
  )
}
const element = Didact.createElement(App, {
  name: "foo",
})
复制代码
函数组件有两个方面的不同：

代表函数组件的 fiber 节点是没有 DOM 节点的
子节点是需要运行函数而不是直接 从 props 属性中得到的

如果判断这个 fiber 的 type 属性是一个函数，我们则需要一个不同的更新函数来处理它。
function performUnitOfWork(fiber) {
// 判断是不是函数组件，如果是，就针对其进行特殊处理
 const isFunctionComponent =
    fiber.type instanceof Function
  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
​   
  // 为子元素创建 fiber 节点
  const elements = fiber.props.children
  let index = 0
  let prevSibling = null
​
  while (index < elements.length) {
    const element = elements[index]
​
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    }
   
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
​
    prevSibling = newFiber
    index++
  }
  
  // 返回下一个子任务
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

​
function updateFunctionComponent(fiber) {
  // TODO
}
​
function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  reconcileChildren(fiber, fiber.props.children)
}
复制代码
在 updateHostComponent 中我们继续沿用之前逻辑。
在 updateFunctionComponent 函数中，我们需要调用函数（fiber.type）来获取 children 元素。
在我们的例子中， fiber.type 属性就是 App 这个函数，我们调用它，会返回一个 h1 元素。
只要我们拿到了子节点，之后的协调阶段也是和之前一样的，没有什么改变。
function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}
复制代码
我们需要改变的是 commitWork 函数。
function commitWork(fiber) {
  if (!fiber) {
    return
  }
​
  const domParent = fiber.parent.dom
  if (
    fiber.effectTag === "PLACEMENT" &&
    fiber.dom != null
  ) {
    domParent.appendChild(fiber.dom)
  } else if (
    fiber.effectTag === "UPDATE" &&
    fiber.dom != null
  ) {
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props
    )
  } else if (fiber.effectTag === "DELETION") {
    domParent.removeChild(fiber.dom)
  }
​
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
复制代码
现在，我们需要针对不包含 DOM 的 fiber 节点做两处改动。
首先，要找到一个 DOM 节点的父节点，我们需要沿着 fiber 树向上寻找，直到找到一个包含 DOM 节点的fiber。
function commitWork(fiber) {
  if (!fiber) {
    return
  }
  
  // 寻找 DOM 节点的父节点
  let domParentFiber = fiber.parent
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent
  }
  const domParent = domParentFiber.dom
​
  if (
    fiber.effectTag === "PLACEMENT" &&
    fiber.dom != null
  ) {
    domParent.appendChild(fiber.dom)
  } else if (
    fiber.effectTag === "UPDATE" &&
    fiber.dom != null
  ) {
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props
    )
  } else if (fiber.effectTag === "DELETION") {
    domParent.removeChild(fiber.dom)
  }
​
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
复制代码
当需要移除一个节点时，我们也需要持续寻找直到找到一个包含 DOM 节点的子节点。
function commitWork(fiber) {
  if (!fiber) {
    return
  }
  
  let domParentFiber = fiber.parent
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent
  }
  const domParent = domParentFiber.dom
​
  if (
    fiber.effectTag === "PLACEMENT" &&
    fiber.dom != null
  ) {
    domParent.appendChild(fiber.dom)
  } else if (
    fiber.effectTag === "UPDATE" &&
    fiber.dom != null
  ) {
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props
    )
  } else if (fiber.effectTag === "DELETION") {
    // 通过 commitDelection 递归直到找到子节点
    commitDeletion(fiber,domParent);
  }
​
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child, domParent)
  }
}
复制代码
第八步 Hooks
最后一步，既然我们使用了函数组件，当然也要给它加上状态。
让我们将例子替换为一个经典的计算组件，当我们每次点击它，组件中的值加1。
注意，我们使用 Didact.useState 来获取和更新这个计算值。
const Didact = {
  createElement,
  render,
  useState,
}
​
/** @jsx Didact.createElement */
function Counter() {
  // 使用 Didact.useState 在函数组件内创建状态（useState我们会在稍后实现） 
  const [state, setState] = Didact.useState(1)
  return (
    <h1 onClick={() => setState(c => c + 1)}>
      Count: {state}
    </h1>
  )
}
const element = <Counter />
const container = document.getElementById("root")
Didact.render(element, container)
复制代码
在 useState 函数中，会存储以及更新组件的状态。
function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}
​
function useState(initial) {
  // TODO
}
复制代码
在调用函数组件之前，我们需要声明一些全局变量以供在 useState 函数中使用。
首先，我们创建一个 wipFiber 变量（ wip 即是 work in progress，表示参与本次渲染工作的 fiber 节点）。
我们还需要在 fiber 节点中添加一个 hooks 数组，以支持在同一个组件中多次调用 useState 方法。并且我们还需要对当前 hook 的索引进行记录。
let wipFiber = null
let hookIndex = null
​
function updateFunctionComponent(fiber) {
  wipFiber = fiber
  hookIndex = 0
  wipFiber.hooks = []
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}
​
function useState(initial) {
  // TODO
}
复制代码
当在函数组件中调用 useState 时，我们需要通过 fiber 的 alternate 属性以及 hook 的索引来查看是否存在旧的 hook。
如果存在旧的 hook，我们则从旧的 hook 中拷贝这个状态到新的 hook，如果不存在我们就使用初始值对 hook 的状态进行初始化。
之后我们将新的 hook 添加到 fiber 节点上，增加 hook 的索引值（指向下一个hook），之后返回处理好的状态（在例子中即是计算好的数值）。
function useState(initial) {
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex] 
  const hook = {
    state: oldHook ? oldHook.state : initial,
  }
​
  wipFiber.hooks.push(hook)
  hookIndex++
  return [hook.state]
}
复制代码
并且 useState 还返回了一个用于更新状态的函数，所以我们需要定义一个接收action（在当前例子中，action就是对值进行加1的函数）作为参数的 setState 函数。
我们需要将 action 添加到 hook 的 queue 数组中。
之后我们需要做一个与 render 函数中相似的操作，为 wipRoot 赋值一个新的 fiber 作为下一个任务，这样 workLoop 就会开始一个新的渲染阶段。
但是我们此时还没有处理 action 函数。
在下一次渲染组件的时候，我们从旧的 hook 中拿到所有的 action，并使用这些action对state进行处理，因此当我们返回状态时，值会被更新。
function useState(initial) {
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex]
    
  const hook = {
    state: oldHook ? oldHook.state : initial,
    // 将 action（即更新状态的函数）添加到 queue 数组中
    queue:[]
  }
  
  // 拿到 action 对 state 进行处理
  const actions = oldHook ? oldHook.queue : []
  actions.forEach(action => {
    hook.state = action(hook.state)
  })
  
  // setState 将 action 添加到 hook 的 queue 中，创建子任务这样就会重新进行渲染页面
​ const setState = action => {
    hook.queue.push(action)
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    }
    nextUnitOfWork = wipRoot
    deletions = []
  }
  
  wipFiber.hooks.push(hook)
  hookIndex++
  
 // 将 state 和 setState 暴露出去
  return [hook.state,setState]
}
复制代码
就这样，我们构建出了我们自己的 React。
你可以在 codesandbox 或者 github 中看到完整的源码。
总结
除了帮助你理解 React 是如何工作的，本文的其中一个目标是可以让你更容易深入了解 React 的代码库。这就是为什么我们几乎在所有地方都使用与 React 相同的变量以及函数名。
 举个例子，如果你在任何一个真实的 React 应用的函数组件中添加一个断点，那么调用堆栈就会显示给你如下信息：

workLoop
performUnitOfWork
updateFunctionComponent

 我们实现的代码并没有包含很多的 React 特性以及优化。举个例子，以下是 React 与我们的实现做的不同的地方：

在 Didact 中，渲染阶段会遍历整个树。React 则会通过一些机制跳过那些没有发生改变的子树。
我们还会在提交阶段遍历整个树，React 则只会保留产生影响的 fiber 节点链表。
每次我们构建一个新的树时，我们会为每个 fiber 创建一个新的对象。但是 React 会复用之前树上的 fiber 节点。
当 Didact 在渲染阶段收到一个新的更新时，会丢弃之前的工作树，从根节点重新开始。但是 React 会给每一个更新标记一个过期时间戳，通过这个时间戳来决定各更新之间的优先级。
除此之外还有很多... 

 这里还有一些你可以比较简单添加的特性：

在 props 中添加样式对象属性（即 style 属性）
扁平化子元素数组
useEffect hook
将 key 机制引入到协调机制中

如果你在 Didact 中加入了以上任何一个特性或者其他的特性，你可以提一个 PR 到这个 Github 仓库，这样就可以让其他人看到了。
感谢阅读。
最后，附上原文地址。