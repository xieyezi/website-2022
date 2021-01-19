---
title: vuex4都beta了，vuex5还会远吗？
---

# vuex4都beta了，vuex5还会远吗？


相信随着`vue3`的出现，`vue`社区的其他核心包都进行了对于`vue3`的的支持，例如`vue-router`、`vuex`等。`vuex`有了哪些变化呢？今天我们一起来聊聊`vuex`。

我们知道`vue3`比较核心的两个升级点:`composition-api`和 更好的 `typescript` 支持。那么`vuex4`呢？
### vuex4 + vue3 的基本使用
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
接着`vuex4`为我们提供了 `useStore` 方法来获取`state`.
> 本篇文章主要基于`composition-api`，所以暂不介绍`mapState`、`mapGetters`、`mapActions`等的用法

我们试着来用一下：
```ts
<template>
	<div class="home">
		<img alt="Vue logo" src="../assets/logo.png" />
		<p>{{ homeInfo }}</p>
	</div>
</template>

<script lang="ts">
import { useStore } from 'vuex'
import { computed,defineComponent } from 'vue'
import HelloWorld from '../components/HelloWorld.vue'
import styles from './example.module.css'

export default defineComponent({
	name: 'Home',
	setup() {
		const store = useStore()
		const homeInfo = computed(() => store.state.home.homeInfo)

		return {
			homeInfo
		}
	}
})
</script>
```
到目前为止，我们已经实现了配置`vuex4+ vue3` 的基本使用.假设现在需要在`home.vue`取很多个state里面的数据呢？那么就会变成这样的：
```ts
...
const store = useStore()
const homeInfo = computed(() => store.state.home.homeInfo)
const value1 = computed(() => store.state.home.value1)
const value2 = computed(() => store.state.home.value2)
const value3 = computed(() => store.state.home.value3)
...
```
貌似重复代码很多，对不对.我们可以自定义一个`hooks`来代替这些重复操作:

```ts
import { computed } from 'vue'
import { useStore } from 'vuex'

const useVuexValue = (moduleName: string, storeKeys: Array<string>) => {
	let values: any = []
	const moduleNames = moduleName.split('/')
	const state = useCurry(moduleNames)
	storeKeys.forEach((storeKey) => {
		const value = computed(()=>state[storeKey])
		values.push(value ? value : null)
	})
	return values
}

const useCurry = (moduleNames: Array<string>) => {
	const store = useStore()
	let state = store.state
	moduleNames.forEach((moduleName) => {
		state = state[moduleName]
	})
	return state
}

export default useVuexValue
```

然后我们取state的变量的方法就变成了:
```ts
import { useVuexValue } from '../hooks'

...
setup() {
    const [homeInfo,value1, value2] = useVuexValue('home', ['homeInfo','value1', 'value2'])
    return {
        value1,
        value2,
        homeInfo
    }
}
...
```
假如`home module` 下面还有`detail`、`list` 等等子`module`，那我们取数据的方式就应该是:
```ts
...
setup() {
    const [value1, value2] = useVuexValue('home/detail', ['value1', 'value2'])
    return {
        value1,
        value2
    }
}
...
```
是不是看上去有点眼熟，对的就是类似于`mapState`的方式，不过是我们自定义的方式，同样的思路，可以封装我们自己的`mutation`、`action`等.

