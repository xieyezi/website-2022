---
title: call和apply的区别及其用法
---

# call 和 apply 的区别及其用法

ECMAScript 规范给所有函数都定义了 call 与 apply 两个方法，它们的应用非常广泛，它们的作用也是一模一样，只是传参的形式有区别而已。

## apply

apply()方法传入两个两个参数：一个是作为函数上下文的对象，另一个是作为函数参数所组成的数组。

```js
var obj = {
  name: "linxin",
};

function func(firstName, lastName) {
  console.log(firstName + " " + this.name + " " + lastName);
}

func.apply(obj, ["A", "B"]); // A linxin B
```

可以看到,obj 是作为函数上下文的对象，函数 func 中的 this 指向了 obj 这个对象。参数 A 和 B 是放在数组中传入了 func 函数,分别对应 func 参数的列表元素。

## call

call 方法第一个参数也是作为函数上下文的对象，但是后面传入的是一个参数列表，而不是单个数组。

```js
var obj = {
  name: "linxin",
};

function func(firstName, lastName) {
  console.log(firstName + " " + this.name + " " + lastName);
}

func.call(obj, "C", "D"); // C linxin D
```

当使用 call 或者 apply 的时候,如果我们传入的第一个参数为 null,函数体内的 this 会指 向默认的宿主对象,在浏览器中则是 window。

```js
var func = function (a, b, c) {
  console.log(this === window); // 输出:true
};
func.apply(null, [1, 2, 3]);
```

但是如果是在严格模式下(`use strict`)，函数体内的 this 还是为 null。

## 用途

### 改变 this 的指向

```js
var obj = {
  name: "linxin",
};

function func() {
  console.log(this.name);
}

func.call(obj); // linxin
```

我们知道，call 方法的第一个参数是作为函数上下文的对象，这里把 obj 作为参数传给了 func，此时函数里的 this 便指向了 obj 对象。此处 func 函数里其实相当于

```js
function func() {
  console.log(obj.name);
}
```

### 借用别的对象的方法

```js
var Person1 = function () {
  this.name = "linxin";
};
var Person2 = function () {
  this.getname = function () {
    console.log(this.name);
  };
  Person1.call(this);
};
var person = new Person2();
person.getname(); // linxin
```

从上面我们看到，Person2 实例化出来的对象 person 通过 getname 方法拿到了 Person1 中的 name。因为在 Person2 中，Person1.call(this) 的作用就是使用 Person1 对象代替 this 对象，那么 Person2 就有了 Person1 中的所有属性和方法了，相当于 Person2 继承了 Person1 的属性和方法。

### 调用函数

```js
function func() {
  console.log("linxin");
}
func.call(); // linxin
```

apply、call 方法都会使函数立即执行，因此它们也可以用来调用函数。

## call、apply 和 bind 的区别

call 和 apply 改变了函数的 this 上下文后便执行该函数,而 bind 则是返回改变了上下文后的一个函数。

### bind 的返回值是一个函数

```js
var obj = {
  name: "linxin",
};

function func() {
  console.log(this.name);
}

var func1 = func.bind(obj);
func1();
```

bind 方法不会立即执行，而是返回一个改变了上下文 this 后的函数。而原函数 func 中的 this 并没有被改变，依旧指向全局对象 window。

### 参数的使用

```js
function func(a, b, c) {
  console.log(a, b, c);
}
var func1 = func.bind(null, "linxin");

func("A", "B", "C"); // A B C
func1("A", "B", "C"); // linxin A B
func1("B", "C"); // linxin B C
func.call(null, "linxin"); // linxin undefined undefined
```

call 是把第二个及以后的参数作为 func 方法的实参传进去，而 func1 方法的实参实则是在 bind 中参数的基础上再往后排。

## 总结

我们很多时候都记不住，因为不能常常在实际中用到，我们可以利用以下的口诀达到记忆的方式:

```
    猫吃鱼，狗吃肉，奥特曼打小怪兽。

    有天狗想吃鱼了

    猫.吃鱼.call(狗，鱼)

    狗就吃到鱼了

    猫成精了，想打怪兽

    奥特曼.打小怪兽.call(猫，小怪兽)
```

> 口诀来自知乎网友: [寇云](https://www.zhihu.com/people/kou-yun/activities)
