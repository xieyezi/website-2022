---
title: javascript原型与原型链的深度解析
---

# javascript 原型与原型链的深度解析

## 前言

在前端这块领域，原型与原型链是每一个前端 er 必须掌握的概念。我们多次在面试或者一些技术博客里面看见这个概念。由此可见， 这个玩意对于前端来说有多重要。其实它本身理解起来不难，但是很多刚入行前端的同学，看到`prototype`、`__proto__`理解起来还是有点吃力，然后脑子里面就乱成一锅粥，就像我一样。但是这是很正常的事情，没什么大不了的，就像我们想要学会跑步，那么我们就必须先学会走路。任何事情都是有个过程的。所以现在就跟我一起来攻克这个难点吧。通过这篇文章你将掌握以下知识点:

- 理解 `__proto_`;
- 理解 `prototype`;
- 理解`javascript`中`对象`的概念;
- 理解原型和原型链;
- 理解`javascript`中`类`的概念;
- 理解`new`的实现;
- 理解`instanceof`的实现;
- 理解`javascript`的继承;
- 加深对`javascript`这门语言的理解。

这也是本篇文章的写作思路。

## `对象`

那么我们就从对象这一概念开始说起，其实对象这一概念相信大家并不陌生。有一种说法是“javasrcript 中万物皆是对象”，其实这个说法是错误的，一个很简单的例子，`javasript`中简单基本类型（string、boolean、number、null、undefined、symbol）本身就不是对象。其实`javasript`中对象主要分为`函数对象`和`普通对象`。其中:

- `String`
- `Number`
- `Boolean`
- `Object`
- `Function`
- `Array`
- `Date`
- `RegExp`
- `Error`

这些都是函数对象，他们同时也被称为`内置对象`。`函数对象`本身其实就是一个纯函数，`javascript`用他们来模拟`类`。普通对象就很简单了，就是我们常见的对象:

```js
const obj = {
  name: "juefei",
  desc: "cool",
};
```

可能说到这，你还是无法理解到底啥是`函数对象`，啥是`普通对象`，那我们就一起来看看下面的代码:

```js
const obj1 = {};
const obj2 = new Object();
function func1() {}
const obj3 = new func1();
const func2 = new (function () {})();
const func3 = new Function();
```

接着我们来分别打印一下他们:

```js
console.log(obj1); // object
console.log(obj2); // object
console.log(obj3); // object
console.log(func1); // function
console.log(func2); // function
console.log(func3); // function
```

所以可以看见,`obj1`、`obj2`、,`obj3`是普通对象，他们都是`Object`的实例，而`func1`、`func2`、`func3`则都是`Function`的实例，称为`函数对象`。我们再看看:

```js
console.log(typeof Object); //f unction
console.log(typeof Function); // function
```

你是不是惊呆了，原来`Object`和`Function`都是 `Function`的实例。
所以我们得出一个结论就是：

- 只要是`Function`的实例，那就是`函数对象`，其余则为`普通对象`。

同样我们也可以看出，不仅 `Object` 是`函数对象`,就连 `Function` 本身也是函数对象，因为我们通过 `console.log(typeof Function);` 得知 `Function` 是 `Function` 的实例。是不是又开始有点绕了？没事，到这一步你就记住我们刚刚的结论就算完成目标:

- 只要是`Function`的实例，那就是`函数对象`，其余则为`普通对象`。

那么说到对象，我们从上面可以看出，一个对象是通过构造函数 new 出来的，这其实跟`原型`和`原型链`有很大的关系，那么`原型`和`原型链`到底是用来干嘛的呢？

## `原型`

涉及到这两个概念，我们就必须先来介绍两个东西: `__proto__` 和 `prototype` ，这两个变量可以说，在 `javascript` 这门语言里面随处可见，我们不管他三七二十一，我们先来看一张表:

| 对象类型 | `__proto__` | `prototype` |
| :------: | :---------: | :---------: |
| 普通对象 |     ✅      |     ❌      |
| 函数对象 |     ✅      |     ✅      |

所以，请你先记住以下结论：

- 只有`函数对象`有 `prototype` 属性，`普通对象` 没有这个属性。
- `函数对象` 和 `普通对象` 都有 `__proto__`这个属性。

- `prototype` 和 `__proto__`都是在创建一个函数或者对象会自动生成的属性。

接着我们来验证一下:

```js
function func() {
  //func称为构造函数
}
console.log(typeof func.prototype); // object
console.log(typeof func.__proto__); // function
```

```js
const obj = {};
console.log(typeof obj.__proto__); //object
console.log(typeof obj.prototype); //undefined （看见了吧，普通对象真的没有 prototype 属性）
```

所以就验证了我们刚刚的结论：

- 只有`函数对象`有 `prototype` 属性，`普通对象` 没有这个属性
- `函数对象` 和 `普通对象` 都有 `__proto__`这个属性。
- `prototype` 和 `__proto__`都是在创建一个函数或者对象会自动生成的属性。

你看我又重复写了一遍，我不是为了凑字数，是为了你加深记忆，这对于我们接下来的篇幅很重要。
接着我们来看看下面的代码:

```js
console.log(obj.__proto__ === Object.prototype); // true
console.log(func.__proto__ === Function.prototype); // true
```

所以我们又得出如下结论:

- 实例的 `__proto__`属性主动指向构造的 `prototype`;
- `prototype` 属性被 `__proto__` 属性 所指向。

这就是`prototype` 属性和 `__proto__` 属性的区别与联系。
这可能又有点绕了，来多看几遍这一节，多背一下我们的结论。我们继续。  
 那么问题来了，既然`func`是一个`函数对象`，函数对象是有 `prototype` 属性的，那么`func.prototype.__proto__`等于啥呢？  
 为了解决这个问题，我们来思考一下：  
 首先，我们看看`func.prototype` 是啥:

```js
console.log(typeof func.prototype); //object
```

好，我们知道了，`func.prototype` 是一个对象，那既然是对象，那 `func.prototype` 那不就是 `Object`的实例吗？那也就是说，`func.prototype.__proto__`属性肯定是指向 `Object.prototype` 咯！
好，我们来验证一下:

```js
console.log(func.prototype.__proto__ === Object.prototype); //true
```

看见没有，就是这样的。那看到这里，我们应该也知道当我们这创建一个构造函数的时候，javascript 是如何帮我们自动生成`__proto__`和`prototype`属性的。哈哈没错就是这样:

```js
//我们手动创建func函数
function func() {}
//javascript悄悄咪咪执行以下代码:
func._proto = Function.prototype; //实例的 __proto__ 属性主动指向构造的 prototype
func.prototype = {
  constructor: func,
  __proto: Object.prototype, //我们刚刚才在上面验证的，你别又忘记了
};
```

我还专门为你画了个图(够贴心不老铁):

![原型.png](https://i.loli.net/2019/11/13/I16unTODFKcwjER.png)

所以`prototype`又被称为显式原型对象，而`__proto__`又被称为隐式原型对象。

hi，看到这里，你是不是有种脑子开了光的感觉。哈哈，所以到现在你应该已经理解原型的概念了，如果你还不理解，那就把上述章节再看一遍。最好拿个纸笔出来跟着画一画，顺便拿出电脑把示例代码敲一敲。好，整理一下头脑，接下来我们来看看什么又是`原型链`。

## `原型链`

再介绍这个概念之前，我们先来看如下代码：

```js
function Person = function(name,desc){
    this.name = name;
    this.desc = desc;
} //***1****//
Person.prototype.getName = function(){
    return this.name;
}//***2****//
Person.prototype.getDesc = function(){
    return this.desc;
}//***3****//

const obj = new Person('juefei','cool');//***4****//
console.log(obj);//***5****//
console.log(obj.getName);//***6****//
```

接下来我们来逐步解析一下:

1.  创建了一个构造函数 `Person`，此时，`Person.portotype`自动创建，其中包含了 `constructor` 和 `__proto__`两个属性;
2.  给对象 `Person.prototype` 新增了一个方法 `getName`;
3.  给对象 `Person.prototype` 新增了一个方法 `getDesc`;
4.  根据构造函数 `Person` 新建一个实例: `obj`（在创建实例的时候，构造函数会自动执行）;
5.  打印实例 `obj` :

```js
{
    name: 'juefei',
    desc: 'cool'
}
```

根据上面一节的结论，我们得出：

```js
obj.__proto__ = Person.prototype;
```

6.  执行到第 6 步时，由于在实例 `obj` 上面找不到 `getName()`这个方法，所以它就会自动去通过自身的 `__proto__` 继续向上查找，结果找到了 `Person.prototype` ，接着它发现，刚好 `Person.prototype` 上面有`getName()`方法，于是找到了这个方法，它就停止了寻找。
    怎么样，是不是有一种环环相扣的感觉？他们形成一个链了，没错，这就是`原型链`。

我们得出如下结论:  
 在访问一个对象(假设这个对象叫 obj)的属性/方法时，若在当前的对象上面找不到，则会尝试通过`obj.__proto__`去寻找，而 `obj.__proto__` 又指向其构造函数(假设叫`objCreated`)的 `prototype`，所以它又自动去 `objCreated.prototype` 的属性/方法上面去找,结果还是没找到，那么就访问 `objCreated.prototype.__proto__`继续往上面寻找，直到找到,则停止对原型链对寻找，若最终还是没能找到，则返回 `undefined` 。
一直沿着原型链寻找下去，直到找到 `Object.prototype.__proto__`,指向 `null`，于是返回 `undefined`了。

是不是自然而然就理解了。我又给你画了个图（请对照着上面 👆 那个图看）：

![原型链.png](https://i.loli.net/2019/11/14/hTFDavQMA1Lt5Ps.png)

接下来我们再来增加一些概念：

1. 任何`内置函数对象`本身的 `__proto__`属性都指向 `Function`的原型对象，即： `Function.prototype`;
2. 除了 `Object.prototype.__proto__`指向 `null` ,所有的`内置函数对象`的原型对象的 `__proto__`属性 ( `内置函数对象.prototype.__proto__`)，都指向`Object`。

我们得出如下终极原型链的图：
![原型链终极图.png](https://i.loli.net/2019/11/14/j2DpABNq36k8Isx.png)

针对这个图，我最终给出我们经常看见那个原型链的图:

![prototype.jpg](https://i.loli.net/2019/11/14/6xyi27HkpcMdYEu.jpg)

好好对比一下，拿出纸和笔画一画，根据上面章节的讲解，相信你很容易就能明白。

## `javascript`中的`类`

刚刚我们终于明白什么是 `原型` 和 `原型链`。下面我们根据上面的概念来讲解一下`javascript`中的`类`。
我们知道，在面向对象的语言中，类可以被`实例化`多次，这个`实例化`是指我们可以根据构造函数去独立`复制`多个独立的实例，这些实例之间是独立的。但是实际上在 `javascript` 却不是这样的，因为它不是这种`复制机制`。我们不能创建一个类的多个实例，我们只能创建这个类的多个对象，因为他们都是通过`原型`和`原型链`关联到同一个对象。所以在 `javascript` 中 ,`类`都是通过`原型`和`原型链`来实现的，它其实是一种`委托方式`。

## `new`的实现

了解了上面`javascript`中的`类`的概念，那我们应该很容易就理解`new`的过程，其核心无非就是执行原型链的链接:

```js
function myNew(Cons, ...args) {
  let obj = {};
  obj.__proto__ = Cons.prototype; //执行原型链接
  let res = Cons.call(obj, args);
  return typeof res === "object" ? res : obj;
}
```

## `instanceof`的实现

那么学习了`原型`和`原型链`，`instanceof`的实现肯定也很简单了，它也是通过`原型`和`原型链`来实现的:

```js
function myInstanceof(left, right) {
  let rightProto = right.prototype;
  let leftValue = left.__proto__;
  while (true) {
    if (leftValue === null) {
      return false;
    }
    if (leftValue === rightProto) {
      return true;
    }
    leftValue = leftValue.__proto__;
  }
}
```

我就不讲解过程了，因为我知道你肯定能看懂，哈哈。

## `javascript`的继承

我们都知道继承也是通过`原型`和`原型链`来实现的，那我在这里介绍两种常见的继承方式:

1.  组合继承:

```js
//组合式继承
//通过call继承Parent的属性，并传入参数
//将Child的原型对象指向Parent的实例，从而继承Parent的函数
function Parent(value) {
  this.val = value;
}
Parent.prototype.getValue = function () {
  console.log(this.val);
};
function Child(value) {
  Parent.call(this, value); //继承Parentd的属性
}
Child.prototype = new Parent();
```

2. 寄生组合式继承:

```js
//寄生组合式继承
//通过call继承Parent的属性，并传入参数
//通过Object.create()继承Parent的函数
function Parent(value) {
  this.val = value;
}
Parent.prototype.getValue = function () {
  console.log(this.val);
};
function Child(value) {
  //继承Parentd的属性
  Parent.call(this, value);
}
Child.prototype = Object.create(Parent.prototype, {
  constructor: {
    value: Child,
    writable: true,
    configurable: true,
    enumerable: false,
  },
});
```

## 总结

1.  若 A 通过 new 创建了 B,则 `B.__proto__ = A.prototype`；
2.  执行`B.a`，若在 B 中找不到 a，则会在`B.__proto__`中，也就是`A.prototype`中查找，若`A.prototype`中仍然没有，则会继续向上查找，最终，一定会找到`Object.prototype`,倘若还找不到，因为`Object.prototype.__proto__`指向`null`，因此会返回`undefined`；
3.  原型链的顶端，一定有 `Object.prototype.__proto__` ——> null。

由此可见，`原型`和`原型链`是如此的强大，希望看完这篇文章，你不再会对他们感到恐惧。

写完这篇已经近凌晨两点，如果你觉得这篇文章对你有些许收获，请点赞支持！！

参考资料:
<< 你不知道的 javascript 上卷 >>
