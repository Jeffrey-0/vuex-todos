import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
    getList (context) {
      axios.get('./list.json').then( res => {
        console.log(res.data)
      })
    }
  },
  modules: {
  }
})
