# Vuex笔记

> 学习视频：[Vuex从入门到实战](https://www.bilibili.com/video/BV1h7411N7bg?p=1)

## 概述

### 简介

Vuex是实现组件全局状态（数据）管理的一种机制，可以方便的实现组件之间的数据共享。

### 优点

* 能够在vuex中集中管理共享的数据，易于开发和后期维护
* 能够高效地实现组件之间的数据共享，提高开发效率
* 存储在vuex中的数据都是响应式的，能够实时保持数据与页面的同步

## 基本使用

1. 安装vuex依赖包

   ```shell
   npm i vuex --save
   ```

2. 导入vuex包

   ```js
   import Vuex from 'vuex'
   Vue.use(Vuex)
   ```

3. 创建store对象

   ```js
   const store = new Vuex.Store({
       // state 中存放的就是全局共享的数据
       state: {count: 0}
   })
   ```

4. 将store对象挂载到vue实例中

   ```js
   new Vue({
       el: '#app',
       render: h => h(app),
       router,
       // 将创建的共享数据对象，挂载到Vue实例中
       // 所有的组件，就可以直接从store中获取全局的数据了
       store
   })
   ```

## 核心概念

### State

State 提供唯一的公共数据源，所有共享的数据都要统一放到Store的State中存储。

```js
// 创建store数据源，提供唯一公共数据
const store = new Vuex.Store({
    state: { counte: 0 }
})
```

访问方式

* ```js
  this.$store.state.全局数据名称
  ```

* ```js
  // 1.从vuex中按需导入mapState函数
  import { mapState } from 'vuex'
  
  // 2.将全局数据，映射为当前组件的计算属性
  computed: {
      ...mapState(['count'])
  }
  ```

### Mutation（commit触发）

Mutation 用于变更 Store 中的数据。

```js
const store =  new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    add (state) {
        state.count++
    },
    addN (state, step) {
      // 变更状态
      state.count += step
    }
  }
})
```

触发mutation方法

* ```js
  // 利用commit进行触发
  methods: {
      addN () {
          this.$store.commit('addN', 5)
      }
  }
  ```

* ```js
  // 1.从vuex中按需导入 mapMutations 函数
  import { mapMutations } from 'vuex'
  
  // 2. 将指定的mutations函数，映射为当前组件的methods函数
  methods: {
      ...mapMutations(['add', 'addN'])
  }
  ```

### Action（dispatch触发)

Action用于处理异步任务，需要通过mutation的方式间接变更数据。

```js
const store =  new Vuex.Store({
  // ...省略
  mutations: {
    add (state) {
        state.count++
    }
  },
  actions: {
      addAsync (context) {
          setTimeout(() => {
              context.commit('add')
          }, 1000)
      }
  }
})
```

触发方法

* ```js
  // 利用dispatch触发
  methods: {
      handle () {
          this.$store.dispatch('addAsync')
      }
  }
  ```

* ```js
  // 1.从vuex中按需导入 mapMutations 函数
  import { mapActions } from 'vuex'
  
  // 2. 将指定的actions函数，映射为当前组件的methods函数
  methods: {
      ...mapActions(['addAsync'])
  }
  ```

### Getter

Getter 用于对Store中的数据进行加工处理形成新的数据，类似于Vue的计算属性。

```js
const store =  new Vuex.Store({
  state: {
    count: 0
  },
  getters: {
    showNum (state) {
        return '当前最新的数量是' + state.count
    }
  }
})
```

调用方法

* ```js
  this.$store.getters.showNum
  ```

* ```js
  // 1.从vuex中按需导入mapState函数
  import { mapGetters } from 'vuex'
  
  // 2.将全局数据，映射为当前组件的计算属性
  computed: {
      ...mapGetters(['showNum'])
  }
  ```

### Module

为了避免臃肿，将store分割成模块（module）。每个模块有自己的state、mutation、action、getter、甚至是嵌套子模块。

module模块文件：

```js
/* file:  moduleA.js */
const state = {
  number: 1
}
const mutations = {
  addOne (state) {
    state.number++
  }
}

const actions = {
  // state: 当前模块的state, rootState: 根的state
  addRoot ({ state, commit, rootState }) {
    rootState.count++
  }
}

const getters = {
  showNum (state, getters, rootState, rootGetters) {
    console.log(rootState, rootGetters)
    return state.number + rootState.count
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
```

store/index.js 主文件

```js
/* file: index.js */
import moduleA from './modules/moduleA'
const store =  new Vuex.Store({
  // ...省略
  modules: {
    	moduleA
	}
})
```

调用方法(namespaced为true的情况)：

* ```js
  // state调用方法
  this.$store.state.moduleA.number
  // getters调用方法
  this.$store.getters["moduleA/showNum"]
  // mutations调用方法
  this.$store.commit('moduleA/addOne')
  // actions调用方法
  this.$store.dispatch('moduleA/addRoot')
  ```

* ```js
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  methods: {
      ...mapMutations('moduleA', ['addOne']),
      ...mapActions('moduleA', ['addRoot']),
  }
  computed: {
      ...mapState('moduleA', {
        number: state => state.number
      }),
      ...mapGetters('moduleA', ['showNum'])
  }
  ```

