---
title: vuex4都beta了，vuex5还会远吗？
---

# vuex4都beta了，vuex5还会远吗？


相信随着`vue3`的出现，`vue`社区的其他核心包都进行了对于`vue3`的的支持，例如`vue-router`、`vuex`等。`vuex`有了哪些变化呢？今天我们一起来聊聊`vuex`。

我们知道`vue3`比较核心的两个升级点:`composition-api`和 更好的 `typescript` 支持。那么`vuex4`呢？
我们试着来创建一个 `vue3` + `vuex4` 的项目：
> 这里使用 `vite` 的方式来创建

```
yarn create @vitejs/app
cd my-vite-app
yarn
yarn vuex@next 
```

我们得到如下目录:
```
➜
.src
├── App.vue
├── assets
│   └── logo.png
├── components
│   └── HelloWorld.vue
└── main.ts
```

我们来使用一下`vuex4`:
在`src`目录下新建`store`目录，在`store`下面新建 `index.ts`

```ts
import { createStore, createLogger } from 'vuex'
import config from '../config'

const store = createStore({
	state: {},
	mutations: {},
	actions: {},
	strict: config.isDev,
	plugins: config.isDev ? [createLogger()] : []
})

export default store
```
vuex4 为我们提供了 `createStore`方法，通过该方法，我们可以创建一个`store`，并将其暴露出去，在`main.ts`里面引用它：

```ts
import { createApp } from 'vue'
import store from './store'
import router from './router'
import App from './App.vue'

const app = createApp(App)

app.use(store)
app.use(router)
app.mount('#app')
```
这里和 `vue2` 变得有些不一样了，我们都是通过`app.use`将`store`注入.
我们不可能直接在根`state`创建变量，所以这时候我们想到了`module`的方式,在store目录下面创建modules目录,在modules目录下面创建`home` 和 `about` 两个目录，分别创建`state`并导出:

```ts
// store/modules/home.index.ts
export interface HomeState {
	homeInfo: string
}

const state: HomeState = {
	homeInfo: 'info from home state model'
}
const getters = {}
const mutations = {}
const actions = {}

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}

```

```ts
// store/modules/about.index.ts
export interface AboutState {
	aboutInfo: string
}

const state: AboutState = {
	aboutInfo: 'info from about state model'
}
const getters = {}
const mutations = {}
const actions = {}

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
}
```
我们在`modules`目录下面再创建一个`index.ts`,将这些`module`一起合并导出:

```ts
// store/modules/index.ts
import home from './home'
import about from './about'

const modules = {
    home,
    about
}
console.log('modules',modules)

export default modules
```
