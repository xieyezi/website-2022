---
title: package.json的前世今生
tags:
  - commonjs
  - es module
  - javascript
---

# package.json的前世今生

![logo.png](https://s2.loli.net/2022/04/16/YKTv45F7IunJE9A.png)


### 说在前面

> 大家好，我是 xieyezi, 我又来咯，这次为大家带来 `package.json的前世今生` 这篇新文章，希望大家喜欢😄

### 引言

相信只要你写过`JavaScript`, 或者曾经与`JavaScript`模块、`Node.js`等前端模块进行过交互，则肯定会遇到过 `package.json` 文件，如果你是一名前端开发人员，相信你更能深知 `package.json` 文件的重要性。然而很多小伙伴并不完整的了解 `package.json` 文件的作用以及如何正确使用它。

除此之外，在过去的十年中，基于 `nodejs`，诞生了 `CJS (module.exports）`，这种格式一直是 `node.js` 和 `npm` 包的工作方式。到了2015年，又诞生了 `ESM (default export)`格式，并在后来逐渐变成标准的解决方案，所以社区开始逐步迁移到`ESM`。在这个过程中，`package.json` 文件的作用和使用方式也发生了变化。这篇文章会以循序渐进的方式来介绍他们。但在开始之前，我先提出几个预置的问题，以此作为此篇文章的引子：

- 什么是 `package.json` ， 它有什么作用？
- `package.json` 各个字段的含义是什么？
- `package.json` 的发展历史是怎样的？
- 什么是`CJS` 和 `ESM`格式，他们如何出现的 ?
- `CJS` 和 `ESM` 与 `package.json` 有什么关系？
- 如何正确的配置 `package.json`?
- ...

相信大家读完这篇文章会对`package.json`有一定的了解，并且在阅读过程中，会逐步明白以上几个问题。

### 什么是package.json
首先，什么是 `package.json` ？简单来说，`package.json` 是模块的清单文件，它是对项目或者模块包的描述。`package.json` 文件里面包含许多元信息。比如项目名称，项目版本，项目执行入口文件，项目贡献者等等。`npm install` 命令会根据这个文件下载所有依赖模块。而当我们的项目作为一个模块包发布到 `npm` 时，`package.json` 则提供了别人使用我们这个模块包的入口。所以，正确的配置 `package.json` 文件显得非常重要。

### package.json 各字段的含义

#### 如何创建
在介绍 `package.json` 文件之前，我们先来看看如何创建 `package.json`。
我们可以通过手动和自动的方式来创建 `package.json` 文件:

1. 手动创建 `package.json` 文件:

直接在模块根目录新建一个 package.json 文件，然后输入相关的内容。

2. 通过`npm init` 命令来创建 `package.json` 文件:
   

根据提示一步步输入相应的内容完成后即可自动创建。

#### 各字段含义
为了更加全面的了解`package.json`，下面我们先来看看`package.json`文件的各个字段的含义。现在有如下`package.json`:

> 在此处，为了介绍方便，我们将`package`当作一个`npm`模块来看。

  ```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A Vue.js project",
  "keywords": [
    "config"
  ],
  "author": "xieyezi <xieyezi@email.com>",
  "main": "src/main.js",
  "bin": "./bin/index.js" 
  "private": true,
  "scripts": {
    "test": "npm run unit"
  },
  "repository": {
    "type": "git",
    "url": "git+ https://github.com/xieyezi/vuepress-blog.git"
  },
  "bugs": {
    "url": " https://github.com/xieyezi/vuepress-blog/issues"
  },
  "dependencies": {
    "vue": "^2.5.2"
  },
  "devDependencies": {
    "babel-core": "^6.22.1"
  },
  "peerDependencies": {
    "vuex": "3.x"
  },
  "license": "MIT",
  "engines": {
    "node": ">= 6.0.0",
    "npm": ">= 3.0.0"
  },
  "browserslist": ["> 1%", "last 2 versions", "not ie <= 8"]
}
  ```

- `name`：模块的名称

> `name` 属性必须少于 214 个字符，且不能包含空格，只能包含小写字母、连字符（-）或下划线（_）。不能使用大写字母。起一个有意义的名字，可以帮助您的模块被人找到，作为一个`npm` 通用库来说，`name` 应该是一个简单的名字，而不是一个复杂的名字。


- `version`：模块的版本

> 模块的版本应该遵循 `Semver` 规范，主要的版本命名方式为：`主版本号.次版本号.修订号`, 具体请参考：[Semver]( https://semver.org/)。

- `description`： 模块的描述

> 模块的描述应该简单明了，不要太长，不要太短。它的作用是在 `npm` 搜索模块时，提供一个描述。所以和 `name` 一样，`description` 也值得你去仔细思考。

- `bin`: 指定了模块可执行文件的位置。

- `private`: 模块是否为私有模块

> 这个值的真假决定了这个模块是否可以发布到 `npm` 平台。如果这个值为 `true`，那么则表明这个包不能执行 `npm publish `，可以防止我们的模块意味被发布到 `npm`。

- `author`：模块的作者

- `license`: 模块的协议

> 根据模块的协议，使用该模块或者库的使用者即可知道该模块在使用时有哪些限制。

- `scripts`： 表示模块执行脚本的命令的缩写，例如：

  ```shell
  "test": "npm run dev"
  ```

> 通过这个字段，我们可以去自定义脚本的名称。

- `dependencies`： 指定了模块运行所依赖的模块。

> `dependencies` 指定的依赖在模块打包时，会根据使用的情况，将依赖代码打包进最终的模块代码中。

- `devDependencies`： 指定了模块开发时所需要的依赖

> `devDependencies` 不会将依赖代码打包进最终的模块代码中，只是我们在开发这个模块时需要的依赖。

- `peerDependencies`:  指定使用者使用该模块时，必须先安装哪些依赖。
- `engines`: 指定模块运行的平台极其版本。
- `browserslist`: 指定模块运行的浏览器及其版本。

好了，对于`package.json` 的各个字段介绍到此为止，可能你会问，明明还有`main`、`module` 、`files`、`type` 这些字段啊，是的没有错，的确还有这些字段，我们接下来不仅要讲它们，而且要重点讲它们，👇下面我将回溯历史，采用讲故事的形式来介绍剩下的这些字段。

### 什么是`CJS`和`ESM`

在补充 `main`、`module` 、`files`、`type` 之前，我先介绍一下 `CJS` 和 `ESM` ，什么是  `CJS` 和 `ESM` ？我们先来看两段代码：

```js
// CJS
const cjs = require('./cjsModule.js');
console.log(cjs);
```

```js
// ESM
import esm from './esmModule.js';
console.log(esm);
```

从上面很清晰能看到，`CJS` 是 `require`的形式，而 `ESM` 则是 `import` 的形式，你可能以为他们只是使用层面上面的不同，也许可以混用，我们来试一试，假设我们现在在 `CJS`的 模块里面去导入并试图使用 `ESM` 的模块：

```js
// ESM
const esm = `esm`;
export default esm;
```

```js
// CJS
const esm = require('./esm.js');
console.log(esm);
```

会得到以下错误：

```json
SyntaxError: Unexpected token 'export'
    at Object.compileFunction (node:vm:352:18)
    at wrapSafe (node:internal/modules/cjs/loader:1032:15)
    at Module._compile (node:internal/modules/cjs/loader:1067:27)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1157:10)
    at Module.load (node:internal/modules/cjs/loader:981:32)
    at Function.Module._load (node:internal/modules/cjs/loader:822:12)
    at Module.require (node:internal/modules/cjs/loader:1005:19)
    at require (node:internal/modules/cjs/helpers:102:18)
    at Object.<anonymous> (/Users/xieyezi/Desktop/sss/2.js:1:13)
    at Module._compile (node:internal/modules/cjs/loader:1103:14)
```

很显然，`CJS`无法识别`ESM` 模块的导出。这到底是为什么呢？要搞明白具体原因，我们还得从源头说起。

#### 模块发展历史

当`Node.js` 刚刚出现的时候，那个时候混沌初开，其模块的标准主要是 `CJS`，不得不说，`Node.js`真的是跨世纪的产物，它诞生了前端的 `模块系统`。从此之后，前端开始发生翻天覆地的变化，用`Javascript`语言，也可以写服务端的应用了，这是一件令人兴奋的事情，扩宽了我们前端er的技术视野和天地，随着`Node.js`的发展，越来越多公用的模块被相继开发出来，开发者们就在思考，能否将这些已经封装好了的模块放到一个公共的平台，提供给别人下载使用呢？于是一款名为 [npm](https://zh.wikipedia.org/wiki/Npm) 的 [软件包管理系统](https://zh.wikipedia.org/wiki/软件包管理系统)  诞生了，通过这个平台，大家可以上传自己封装好的模块，其他开发者则可以在该平台上搜索对应的包，进行下载使用。上传时，我们需要对我们模块指定一个统一入口文件，所以在`package.json` 中，于是 `main`字段诞生了：

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A Vue.js project",
  "main": "src/index.js", // main 指定了模块包的入口位置
}
```

`main` 字段表示模块包导出的统一入口位置。例如：

```js
// src/index.js
const cjs = `hello, xieyezi`;
module.exports = cjs;
```

使用方导入该模块时，即默认从`src/index.js` 导入模块。

随着越来越多的``npm``包被开发出来，前端的发展呈现出爆炸式的增长和普及，工程师的脑洞越来越大，`Node.js` 的能力越来越强，可应用的范围也越来越广，所以随之而来的，各种前端应用框架诞生了。

比较著名前端框架的有`React.js`、`Vue.js`、`Angular.js` 等。这些前端框架诞生之后，前端应用层的开发也发生了翻天覆地的变化，依赖于`Node.js` 的完整的模块能力和强大生态系统，前端开发脱离了 `刀耕火种` 的年代，我们不用直接写`html`了，我们也不用令人诟病的`jQurey`了，基于这些前端框架，我们可以以工程化的角度去看待前端应用了，随着前端框架的发展，又催生了`Webpack`、`Rollup`这样的前端工具，整个前端生态得到了更加惊人的发展。

除此之外，随着生态的不断发展，`Javascript` 的开发者越来越多，当使用者数量变得庞大时，就意味着这门语言，会不断迭代，开发者们发现，既然 `Node.js` 拥有`模块系统`，为什么 `Javascript` 本身却不支持呢？所以，`ES6` 就诞生了，它的诞生，为 `Javascript` 带来了原生的模块系统，即我们上文提到的`ES Module` (简称`ESM`)，它的使用形式为：

```js
// src/es-module.js
const esm = `hello, xieyezi`;
export default esm;
```

```js
// src/index.js
import esm from './es-module.js'
console.log(esm);
```

接着运行`node src/index.js ` ，运行结果如下：

```json
SyntaxError: Cannot use import statement outside a module
    at Object.compileFunction (node:vm:352:18)
    at wrapSafe (node:internal/modules/cjs/loader:1032:15)
    at Module._compile (node:internal/modules/cjs/loader:1067:27)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1157:10)
    at Module.load (node:internal/modules/cjs/loader:981:32)
    at Function.Module._load (node:internal/modules/cjs/loader:822:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:77:12)
    at node:internal/main/run_main_module:17:47
```

咋报错了？那是因为，我们在执行这段代码的时候，是利用 `Node.js` 来解析执行我们的代码，那么此时此刻，矛盾出现了：

<strong>`Node.js` 怎么知道我们使用的是 `ESM` 还是 `CJS` 呢？</strong>

问题的答案也很简单，我们告诉它不就行了？

```json
// src/package.json
{
  "name": "sss",
  "version": "1.0.0",
  "description": "",
  "type": "module", // 将 type 指定为 module
}
```

我们在 `package.json` 中，指定了一个 `type` 字段，并将它的值取作 `module` ，它的意思就是告诉 `Node.js` ，我们采用了

`ESM` 的形式运行模块系统，你就按照 `ESM` 帮我解析模块代码吧，于是，再执行 `node src/index.js `:

```json
hello, xieyezi
```

到现在为止，我们知道了 `main` 字段可以指定 `CJS` 模块的入口，后来出现了 `ESM` 格式 之后，我们想要使用 `ESM` 时，我们可以指定 `type: module` 来告知 `Node.js`  按照 `ESM`  格式来解析模块系统。

随着 `ESM` 模块系统本身的发展，它提供了更好的静态分析能力、更好的`tree shaking` 能力，甚至后来，各大浏览器均支持原生的	`ESM` ，所以 `ESM` 变得更加流行，社区逐渐把它当作是 `JavaScript` 的未来。基于这样的背景，社区的开发者们开始更多的使用	`ESM` 去开发他们的模块，所以越来越多的 `ESM` 被开发出来，但是此时问题又来了：

<strong>发布到 `NPM` 时，应该如何指定 `ESM` 的入口呢？</strong>

所以，`module` 字段也就诞生了，当我们需要告诉使用者我们自己的 `ESM` 模块包入口位置时，我们可以在 `package.json` 里面新增一个 `module` 字段:

```json
// src/package.json
{
  "name": "sss",
  "version": "1.0.0",
  "description": "",
  "module": "src/index.js", // module 指定 ESM 的入口
}
```

这个问题也就这样被解决了，同时此时很明显地可以推断出，当我们需要在一个模块包里面同时暴露出 `CJS` 和 `ESM` 的入口时，我们可以这样做：

```json
// src/package.json
{
  "name": "sss",
  "version": "1.0.0",
  "description": "",
  "main": "src/cjs/index.js", // main 指定 CJS 的入口
  "module": "src/esm/index.js", // module 指定 ESM 的入口
}
```

这样，使用者使用时就知道分别从 `src/cjs/index.js` 和 `src/esm/index.js` 导入模块了。你可能会问，什么情况下，需要同时指定这两个字段呢？有一些模块包，可能会同时需要在 `Node.js` 和浏览器环境下执行，那么 `CJS` 就是提供给 `Node.js` 使用的，而 `ESM` 就是提供给 `Webpack` 或者 `Rollup` 这样的构建工具使用的。很明显，当我们使用 `require` 和 `import` 导入模块包时，入口文件路径是不一样的，所以此时这两个字段就派上了用场。

基于`CJS` 和 `ESM` ，上述好像已经很完善了，但是实际上并不是的，接下来我们来思考一下下面这个问题：

<strong>如果在暴露模块入口的时候，需要指定不同格式以及不同文件夹下面的文件怎么办？</strong>

可能一下子有点不理解这个问题，我们来看个例子：

假设我们现在想要写一个插件，这个插件同时支持 `Webpack` 、`Rollup`、`ESbuild` 这三个工具，并且同时支持 `CJS` 和  `ESM` ，我们很自然的想到，在使用者使用时他可以根据自己当前使用的工具来导入他应该导入的模块，例如他用的是`Webpack`，那么他只需要：

```js
import myPlugin from 'my-plugin/webpack';
```

同理的，如果使用`Rollup`、`ESbuild`的使用者，则应该是这样的：

```js
import myPlugin from 'my-plugin/rollup'; // rollup 使用者
import myPlugin from 'my-plugin/esbuild'; // esbuild 使用者
```

还有一个问题，如果我们还需要同时 `CJS` 呢？那么，基于这样的情况下，我们又应该如何配置 `package.json` 呢？

所以 `exports` 它来了。从`Node.js v12.16.0` 的版本开始，新增了 `exports` 字段，它的主要作用就是用来解决刚刚上面的两个问题，下面我们基于 `exports` 来解决上面两个问题：

```json
  "exports": {
    "./webpack": {
      "import": "./webpack/index.mjs",
      "require": "./webpack/index.js"
    },
    "./rollup": {
      "import": "./rollup/index.mjs",
      "require": "./rollup/index.js"
    },
    "./esbuild": {
      "import": "./esbuild/index.mjs",
      "require": "./esbuild/index.js"
    },
  },
```

这样，我们就完美的解决了刚刚上面两个问题。当使用 `require('my-plugin/webpack')` 时，导入的是 `my-plugin/webpack/index.js`，而使用 `import myPlugin from 'my-plugin/webpack'` 时，导入的则是 `my-plugin/webpack/index.mjs`。 

>注意，以上以`.mjs` 结尾的文件即表明为`ESM` 的格式，当然你完全可以不这样做，你可以新建两个不同的文件夹，分别放置 `CJS` 和 `ESM ` 格式的文件。

> 还有一个地方值得注意：`exports` 的优先级比 `main` 和`module` 高，也就是说，使用方只要匹配上`exports`的路径就不会使用 `main` 和 `module` 的路径。

好了，我们来简单总结一下以上的内容。首先我们介绍了 `package.json` 的由来和作用，接着介绍了它下面每个字段段基础含义，后来，又介绍了 因为`Node.js` 的发展历史，产生了 `CJS`  和 `ESM` ，并且随着它们的不断变更，`package.json` 的作用也得到了拓展和丰富。

### 总结

通过阅读以上内容，想必你应该都明白 `package.json` 各个字段的含义了，并且已经能回答文章开头提出的那几个问题了，同时，也希望通过阅读这篇文章，你能学会如何正确的配置`package.json`。

另外，这篇文章断断续续码了将近两周，写一章是不易的，要想把文章写得通俗易懂更不容易，希望你给我点个赞，你的点赞是我源源不断更文的最大动力，最后，感谢你的阅读，我是 xieyezi ，我们下一篇再见～

下一篇预告：[两个最好用的库打包工具](#)

