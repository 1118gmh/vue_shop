<template>
  <div id="rights">
    <!-- 面包屑 -->
    <BreadCrumb
      first="首页"
      second="权限管理"
      third="权限列表"
      path="home"
    ></BreadCrumb>
    <!-- 卡片 -->
    <el-card>
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="info" v-if="scope.row.level === '2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import BreadCrumb from '../../components/BreadCrumb.vue'
import { getRights } from '../../api/rights'
export default {
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.getRights()
  },
  methods: {
    // 获取所有权限，列表显示
    async getRights() {
      const res = await getRights('list')
      if (res.meta.status !== 200) {
        this.$message.error('获取权限列表失败')
        return
      }
      this.tableData = res.data
    }
  },
  components: {
    BreadCrumb
  }
}
</script>

<style lang="stylus" scoped></style>
