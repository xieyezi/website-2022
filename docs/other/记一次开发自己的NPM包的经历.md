---
title: 记一次自己封装NPM包的经历
tags:
  - npm
  - rollup
  - webpack
  - localStorage
  - sessionStorage
---

### 说在前面

最近一直在忙自己的毕业设计,在做的过程中,有的地方要用到缓存.我采用了localStorage和sessionStorage的方式进行的缓存,并完整地实现了自己想要的功能.但是我突然想到前端的"模块化开发",这块完全可以独立出来,将其封装为一个统一的API,想要使用的时候就引入使用,于是我将其封装为了一个将localStorage和sessionStorage统一在一起的功能函数:`xieyezi-storage.js`.我存放在自己的电脑里面,以便我自己以后使用,但是我突然想到了程序员的"开源精神"😹,好吧其实是想到,每次我们需要安装一个包的时候,我们都是采用`npm install xxx`的方式进行引入,然后在使用的时候,就通过`import xxx from xxx` 这样的方式进行使用.于是我也想要将我的功能函数封装为一个npm包,并且发布到[npm](https://www.npmjs.com/)👆上面去,那也算是为我们开源作出了一定的贡献.<!-- more -->

### 说得简单,动手困难

世界上很多事情都是说起来容易,做起来比较难,并且,万事开头难.我发现我自己缺乏这方面的很多知识,于是我开始了边学边写的模式.
在前期的考察中,我看了许多的npm包的源码,他们都有差不多类似的目录结构,于是我依葫芦画瓢,构建了如下的目录结构:

```js
   .
    ├── ./dist
    └── ./src
        └── ./src/index.js

```

我执行了一下npm 的初始化工程命令：

```js
npm init -y
```

目录变成了这样:

```js
.
├── ./dist
├── ./package.json
└── ./src
    └── ./src/index.js
```

原来初始化包都会有一个package.json,这个文件包含了这个包的入口及其信息
在src目录下面存放功能代码`index.js`,dist目录下面则存放打包后的文件`xieyezi-storage.js`
一切都已经准备就绪,我开始寻找一个打包工具.

### webpack

在众多的打包工具中,我第一个想到的打包工具就是webpack,于是先安装(在根目录):


```
npm i webpack webpack-cli --save-dev
```

然后靠着自己对webpack的浅薄知识,含泪写下了配置文件(webpack.config.js):

```js
const path = require('path');
module.exports = {
entry: './src/index.js',
output: {
    filename: 'xieyezi-storage.js',
    publicPath: '/dist/',
    path: path.resolve(__dirname, 'dist')
    }
};

```


于是打包之后,生成了`xieyezi-storage.js`的文件,于是我将此文件复制到我的项目目录里面进行引入使用:
```js
import storage from 'common/js/xieyezi-storage'
```
结果是我成功地引入了文件并进行了使用.但是我这是ES6规范,并不能支持commonJS模式,说到这个,有如下标准:

- amd – 异步模块定义,用于像RequireJS这样的模块加载器
- cjs – CommonJS,适用于 Node 和 Browserify/Webpack 例如`require('xieyezi-storage')`
- es – 将软件包保存为ES模块文件 例如 `import storage from 'xieyezi-storage'`.
- iife – 一个自动执行的功能,适合作为`<script>`标签.（如果要为应用程序创建一个捆绑包,您可能想要使用它,因为它会使文件大小变小.）
- umd – 通用模块定义,以amd,cjs 和 iife 为一体,umd是amd和CommonJS的糅合,umd先判断是否支持Node.js的模块（exports）是否存在,存在则使用Node.js模块模式.

所以我打包的文件无法通过commonJS方式来引入.

### libraryTarget

libraryTarget就是问题的关键,通过设置该属性,这是可以控制 library 如何以不同方式暴露的选项.
```js
const path = require('path');
module.exports = {
entry: './src/index.js',
output: {
    filename: 'xieyezi-storage.js',
    publicPath: '/dist/',
    libraryTarget: 'umd'
    path: path.resolve(__dirname, 'dist')
    }
};

```
这样子,我们打包的文件就会支持各种规范了.这样子我以为就算完了,但是事实并非如此.我看了一下,打包之后的文件大小居然有2k.这么大？？

### rollup

在前面的考察中,我在选择打包工具的时候,我看见了Vue框架和React用的是什么打包工具,结果我发现,居然他们两都不是用的webpack,而是用的是一个叫做 `rollup` 的东西.于是我去查阅了rollup的官网:
>Rollup 是一个 JavaScript 模块打包器,可以将小块代码编译成大块复杂的代码,例如 library 或应用程序.Rollup 对代码模块使用新的标准化格式,这些标准都包含在 JavaScript 的 ES6 版本中,而不是以前的特殊解决方案,如 CommonJS 和 AMD.ES6 模块可以使你自由、无缝地使用你最喜爱的 library 中那些最有用独立函数,而你的项目不必携带其他未使用的代码.

所以说,rollup就是专门用来打包library的,而webpack大多是用来打包应用程序的.

于是我愉快的开始了rollup的学习使用:
先安装:

```js
npm install --global rollup
```
在项目根目录新建一个rollup.config.js:

```js
export default {
    input: './src/index.js',
    output: {
        file: './dist/xieyezi-storage.js',
        format: 'umd',
        name:'xieyezi-storage'
    }
};
```
然后就是执行 `rollup c` ,成功打包.而且经过我的测试,能正常引入使用.我一看,才1k😂,开心的笑了.
然后我就打算用我们的`uglify`进行代码压缩:
```js
npm i rollup-plugin-uglify -D
```
在rollup.config.js配置引入:
```js
import { uglify } from 'rollup-plugin-uglify';
    export default {
    input: './src/index.js',
    output: {
        file: './dist/xieyezi-storage.js',
        format: 'umd',
        name:'xieyezi-storage'
    },
    plugins: [
        uglify()
    ]
};
```
然后重新运行 `rollup c` 进行打包,结果直接报错

![IMG_0665.JPG](https://i.loli.net/2019/03/28/5c9c69facbebb.jpg)

我上去就是一顿谷歌加百度,原来uglify插件只支持es5的压缩.看来我只能另寻出路.我看见了 ` terser` 这个插件,这个插件也能对代码进行压缩,支持es6.
```js
npm i rollup-plugin-terser -D
```
在rollup.config.js配置引入:
```js
import { terser } from 'rollup-plugin-terser';
    export default {
    input: './src/index.js',
    output: {
        file: './dist/xieyezi-storage.js',
        format: 'umd',
        name:'xieyezi-storage'
    },
    plugins: [
        terser()
    ]
};
```
再次进行打包,成功打包！！！可是我们打包之后对代码只支持es6,我们还需要用 `babel` 进行转义:
```js
//package.json
"devDependencies": {
"babel-core": "^6.9.1",
"babel-loader": "^6.2.4",
"babel-plugin-add-module-exports": "^0.2.1",
"babel-plugin-transform-es2015-modules-umd": "^6.12.0",
"babel-plugin-transform-object-assign": "^6.22.0",
"babel-plugin-transform-runtime": "^6.9.0",
"babel-polyfill": "^6.22.0",
"babel-preset-env": "^1.5.1",
"babel-preset-es2015": "^6.9.0",
"babel-preset-stage-2": "^6.5.0",
"rollup-plugin-babel": "^3.0.7",
"rollup-plugin-terser": "^4.0.4"
}
```
再进行`npm install`
这里要注意,要使用babel,在rollup里面,必须安装完它所需对依赖,不能只安装 `rollup-plugin-babel`.必须安装完所有babel所需依赖.

完整的rollup.config.js:
```js
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
export default {
    input: './src/index.js',
    output: {
        file: './dist/xieyezi-storage.js',
        format: 'umd',
        name:'xieyezi-storage'
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        terser()
    ]
};
```
在项目根目录新建.babelrc:
```
{
    "presets": [
        [
            "env",
            {
                "modules": false
            }
        ]
    ],
    "plugins": [
        "transform-object-assign"
    ]
}
```
执行打包,打包成功
完整的package.json:
```json
{
"name": "xieyezi-storage",
"version": "1.0.4",
"description": "a package that encapsulates localStorage and sessionStorage",
"main": "dist/xieyezi-storage.js",
"module": "dist/xieyezi-storage.esm.js",
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
},
"keywords": [
    "web",
    "localStorage",
    "sessionStorage"
],
"author": "xieyezi",
"license": "ISC",
"git":{
    "url":"https://github.com/xieyezi/webStorage"
},
"devDependencies": {
    "babel-core": "^6.9.1",
    "babel-loader": "^6.2.4",
    "babel-plugin-add-module-exports": "^0.2.1",
    "babel-plugin-transform-es2015-modules-umd": "^6.12.0",
    "babel-plugin-transform-object-assign": "^6.22.0",
    "babel-plugin-transform-runtime": "^6.9.0",
    "babel-polyfill": "^6.22.0",
    "babel-preset-env": "^1.5.1",
    "babel-preset-es2015": "^6.9.0",
    "babel-preset-stage-2": "^6.5.0",
    "rollup-plugin-babel": "^3.0.7",
    "rollup-plugin-terser": "^4.0.4"
}
}
```
最后的项目结构如下:
```js
.
├── ./README.md
├── ./dist
│   ├── ./dist/xieyezi-storage.esm.js
│   └── ./dist/xieyezi-storage.js
├── ./package-lock.json
├── ./package.json
├── ./rollup.config.js
├── ./babelrc
└── ./src
    └── ./src/index.js
```
我按照 `es` 和 `umd` 打包了两次.
### 将包上传至npm

先去npm注册一个账号,然后进入到根目录进行登录:
```
$ npm login
Username: xieyezi
Password: 
Email: (this IS public) 1435398529@qq.com
Logged in as xieyezi on https://registry.npmjs.org/.
```
注:输入密码的时候不会显示,只要最后显示Logged in as your nickName即可.
然后输入:
```
npm publish
```
它会提示你成功发布,并会给你发邮件.
进入到npm官网进行搜索我们发布的包,如果成功搜索到,则发布成功:
![QQ20190328-155257@2x.png](https://i.loli.net/2019/03/28/5c9c7d748441f.png)

好了,接下来,进入到我自己的毕业设计的根目录:
```js
npm install xieyzi-storage
```
在node_moudules里面查找 `xieyezi-storage` :
![QQ20190328-155537@2x.png](https://i.loli.net/2019/03/28/5c9c7e592c74c.png)
成功找到,引入项目,成功地进行了引入✌️

### 总结

完成上面的这些工作,我花了前前后后差不多5天的时间,前期主要是在学习,后面才开始动手做.做的过程中遇到了很多 `error` 和 `bug` ,但是都是慢慢的解决了困难.我觉得最大的收获就是:很多时候,不是我们不会,只是我们不愿意主动去做而已.所以朋友吧,遇到自己不会的东西,撸起袖子就是干吧！！







 









   



    