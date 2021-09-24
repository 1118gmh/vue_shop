<template>
  <!-- 使用element-ui组件、stylus预编译器 -->
  <div id="shortcuts">
    <el-popover placement="bottom" trigger="click" v-model="popoverVisible">
      <ul class="shortList" @click="clickLi">
        <li v-for="(item, index) in shortList" :key="index">
          {{ item }}
        </li>
      </ul>
      <el-button slot="reference" type="primary"> 快捷回复词</el-button>
    </el-popover>
    <el-input
      v-model="input"
      placeholder="请输入内容"
      @input="changeInput"
    ></el-input>
  </div>
</template>
<script>
export default {
  props: {
    shortList: {
      type: Array
    }
  },
  data() {
    return {
      input: '',
      popoverVisible: false
    }
  },
  methods: {
    clickLi(event) {
      this.input = event.target.innerHTML
      this.popoverVisible = false
      this.$emit('getValue', this.input)
    },
    changeInput(value) {
      this.$emit('getValue', this.input)
    }
  }
}
</script>
<style lang="stylus" scoped>
ul,li
  list-style none
  margin 0
  padding 0
#shortcuts
  display flex
.el-button
  margin-right 10px
.shortList li:hover
  cursor pointer
  background lightblue
#el-popover-2467
  background blue
</style>
