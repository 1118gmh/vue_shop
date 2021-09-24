<template>
  <!-- 这个是测试shortcuts的地方 -->
  <div>
    <!-- shortList：字符串数组，用来绑定快捷键消息的数据的 -->
    <!-- getValue事件：可以获取input的值 -->
    <ShortCuts :shortList="list" @getValue="getValue"></ShortCuts>
  </div>
</template>
<script>
import ShortCuts from '../../components/ShortCuts.vue'
export default {
  data() {
    return {
      list: ['hahaha1', 'hahaha2', 'hahahahhfdskhfdusjl3']
    }
  },
  methods: {
    getValue(value) {
      console.log(value)
    }
  },
  components: {
    ShortCuts
  }
}
</script>
<style lang="stylus" scoped></style>
