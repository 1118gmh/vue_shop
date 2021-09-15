<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: `/${path}` }">{{
      first
    }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ second }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ third }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  props: ['first', 'second', 'third', 'path']
}
</script>

<style lang="stylus" scoped>
.el-breadcrumb
  font-size 12px
</style>
