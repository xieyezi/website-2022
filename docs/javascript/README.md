---
title 一些语法块
---

# 一些语法块

## 防抖函数

```js
"use-strict";
/**
 * 自己实现防抖函数
 */
function debounce(func, delay) {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer); //如果用户再次输入，则把前一个 setTimeout clear 掉
    }
    timer = setTimeout(() => {
      func.call(this, args);
    }, delay); // 然后又创建一个新的 setTimeout, 这样就能保证输入字符后的 delay 间隔内如果还有字符输入的话，就不会执行 fnnc 函数
  };
}
```

## 节流函数

```js
"use-strict";
/**
 * 自己实现节流函数
 */
function throttle(func, delay) {
  let canRun = true;
  return function (...args) {
    if (!canRun) {
      return; //在函数开头判断标志是否为 true，不为 true 则中断函数
    }
    canRun = false; //将canRun 设置为 false，防止执行之前再被执行
    setTimeout(() => {
      func.call(this, args);
      canRun = true; // 执行完事件（比如调用完接口）之后，重新将这个标志设置为 true。当定时器没有执行的时候标记永远是false，在开头被return掉
    }, delay);
  };
}
```

## 组合式继承

```js
"use-strict";
/***
 * 组合式继承
 * 通过call继承Parent的属性，并传入参数
 * 将Child的原型对象指向Parent的实例，从而继承Parent的函数
 */
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
Child.prototype = new Parent();

//test
const child = new Child("Child");
const parent = new Parent("Parent");

console.log(child instanceof Parent); // true

child.getValue();
parent.getValue();
```

## 组合寄生式继承

```js
"use-strict";
/***
 * 寄生组合式继承
 * 通过call继承Parent的属性，并传入参数
 * 通过Object.create()继承Parent的函数
 */
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
  constructor {
    value Child,
    writable true,
    configurable true,
    enumerable false,
  },
});

//test
const child = new Child("Child");
const parent = new Parent("Parent");

console.log(child instanceof Parent); // true

child.getValue();
parent.getValue();
```

## 实现`New`操作符

```js
"use-strict";
/**
 * 自己实现New操作符
 */
function myNew(Cons, ...args) {
  let obj = {};
  obj.__proto__ = Cons.prototype;
  let res = Cons.call(obj, args);
  return typeof res === "object" ? res  obj;
}

//test
function Person(value) {
  this.name = value;
}
Person.prototype.getName = function () {
  console.log(this.name);
  return this.name;
};
const suyechun = myNew(Person, "syc");
suyechun.getName();
```

## 实现`instance of`

```js
"use-strict";
/**
 * 自己实现instanceof
 * 实现原理为利用原型链
 * typeof只能判断原始类型（除了null会输出object）,引用类型都会输出object
 * instanceof 只能判断对象
 * 还有一种判断方法，Object.prototype.toString.call();会输出"[object 类型值]"
 */
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
//test
function Person(value) {
  this.name = value;
}
Person.prototype.getName = function () {
  console.log(this.name);
  return this.name;
};
const suyechun = new Person("syc");
console.log(myInstanceof(suyechun, Person));
```

## 斐波那契数列

```js
function* fibonacci() {
  let [prev, curr] = [0, 1];
  for (;;) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

for (let n of fibonacci()) {
  if (n > 1000) break;
  console.log(n);
}
```
