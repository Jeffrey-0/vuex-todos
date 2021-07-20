import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 所有的任务列表
    list: [],
    // 文本框的内容
    inputValue: '',
    // 下一个id
    nextId: 4,
    viewKey: 'all'
  },
  mutations: {
    initList (state, list) {
      state.list = list
    },
    // 为store中的inputValue赋值
    setInputValue (state, val) {
      state.inputValue = val
    },
    // 添加列表项
    addItem (state) {
      const obj = {
        id: state.nextId,
        info: state.inputValue.trim(),
        done: false
      }
      state.nextId ++
      state.list.push(obj)
      state.inputValue = ''
    },
    // 根据id删除对应的事项
    removeItem (state, id) {
      // 根据id查看对应项的索引
      const i = state.list.findIndex(x => x.id === id)
      // 根据索引，删除对应元素
      if (i !== -1) {
        state.list.splice(i, 1)
      }
    },
    // 改变某一项的状态
    changeItem (state, id) {
      console.log('id', id)
      state.list.map(item => {
        if (item.id === id) {
          item.done = !item.done
        }
      })
    },
    // 清除已完成的任务
    cleanDone (state) {
      state.list = state.list.filter(x => !x.done)
    },
    // 切换视图的关键字
    changeViewKey (state, key) {
      state.viewKey = key
    }
  },
  actions: {
    getList (context) {
      axios.get('./list.json').then( ({ data }) => {
        console.log(data)
        context.commit('initList', data)
      })
    }
  },
  modules: {
  },
  getters: {
    // 统计未完成的任务的条数
    unDoneLength (state) {
      return state.list.filter(x => x.done === false).length
    },
    // 显示列表
    infoList (state) {
      if (state.viewKey === 'all') {
        return state.list
      } else if (state.viewKey === 'undone') {
        return state.list.filter(item => !item.done)
      } else if(state.viewKey === 'done'){
        return state.list.filter(item => item.done)
      } else {
        return state.list
      }
    }
  }
})
