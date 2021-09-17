<template>
  <!-- 表单弹框插件 -->
  <el-dialog
    :title="title"
    :visible.sync="visibleDialog"
    width="50%"
    @close="resetDialog"
  >
    <el-form
      :ref="Form"
      label-width="80px"
      :model="formData"
      :rules="formRules"
    >
      <template v-for="(item, index) in itemProps">
        <el-form-item :label="item.label" :prop="item.prop" :key="index">
          <el-input v-model="formData[item.prop]"></el-input>
        </el-form-item>
      </template>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="quit">取 消</el-button>
      <el-button type="primary" @click="commit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    // 弹框标题
    title: {
      type: String,
      required: true,
      default: ''
    },
    // 弹框显隐
    visibleDialog: {
      type: Boolean,
      default: false
    },
    //
    Form: {
      type: String,
      required: true,
      default: ''
    },
    formData: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    },
    formRules: {
      type: Object
    },
    itemProps: {
      type: Array
    }
  },
  methods: {
    // 表单重置
    resetDialog() {
      this.$emit(close)
    },
    commit() {
      this.$emit('commit')
    },
    quit() {
      this.$emit('quit')
    }
  }
}
</script>

<style lang="stylus" scoped></style>
