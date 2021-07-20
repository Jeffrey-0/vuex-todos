<template>
  <div id="app">
    <a-input placeholder="请输入任务" class="my_ipt" :value="inputValue" @change="handlerInputChange"></a-input>
    <a-button type="primary" @click="addItemToList">添加事项</a-button>

    <a-list bordered :dataSource="infoList" class="dt_list">
      <a-list-item slot="renderItem" slot-scope="item">
        <!-- <a-checkbox :checked="item.done" @change="(e, item) => {cbStatusChanged(e, item)}">{{item.info}}</a-checkbox> -->
        <a-checkbox :checked="item.done" @change="(e) => {cbStatusChanged(e, item.id)}">{{item.info}}</a-checkbox>
        <a slot="actions" @click="removeItemById(item.id)">删除</a>
      </a-list-item>

      <!-- footer区域 -->
      <div class="footer" slot="footer">
        <span>{{unDoneLength}}条剩余</span>
        <a-button-group>
          <a-button :type="viewKey === 'all' ? 'primary' : 'default'" @click="changeList('all')">全部</a-button>
          <a-button :type="viewKey === 'undone' ? 'primary' : 'default'" @click="changeList('undone')">未完成</a-button>
          <a-button :type="viewKey === 'done' ? 'primary' : 'default'" @click="changeList('done')">已完成</a-button>
        </a-button-group>
        <a @click="clean">清除已完成</a>
      </div>
    </a-list>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'app',
  components: {
    
  },
  data () {
    return {
    }
  },
  created () {
    this.$store.dispatch('getList')
  },
  computed: {
    ...mapState(['list', 'inputValue', 'viewKey']),
    ...mapGetters(['unDoneLength', 'infoList']),
  },
  methods: {
    // 监听文本框变化
    handlerInputChange (e) {
      console.log(e.target.value)
      this.$store.commit('setInputValue', e.target.value)
    },
    // 向列表中新增item项
    addItemToList () {
      if (this.inputValue.trim().length <= 0) {
        return this.$message.warning('文本框内容不能为空')
      } else {
        this.$store.commit('addItem')
      }
    },
    // 根据id删除对应的事项
    removeItemById (id) {
      this.$store.commit('removeItem', id)
    },
    // 监听复选框选中状态变化
    cbStatusChanged (e, id) {
      // console.log(e.target, id)
      this.$store.commit('changeItem', id)
    },
    // 清除已完成的任务
    clean () {
      this.$store.commit('cleanDone')
    },
    // 修改页面的切换
    changeList (key) {
      this.$store.commit('changeViewKey', key)
    }
  }
}
</script>

<style lang="scss">
#app {
  padding: 10px;
  .my_ipt {
    width: 500px;
    margin-right: 10px;
  }
  .dt_list {
    width: 500px;
    margin-top: 10px;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
