<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="users" stripe border>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="" label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="180px">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>

            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfor.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfor.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getUsers, setUserState } from '../../api/user'
export default {
  data() {
    return {
      queryInfor: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      users: [],
      total: 0
    }
  },
  created() {
    this.getUsers()
  },
  methods: {
    async userStateChange(userInfo) {
      const res = await setUserState(userInfo)
      if (res.meta.status !== 200) {
        // 更新失败时，让页面的状态恢复
        userInfo.mg_state = !userInfo.mg_state
        this.$message.error(res.meta.msg)
        return
      }
      this.$message.success(res.meta.msg)
    },
    handleSizeChange(newsize) {
      this.queryInfor.pagesize = newsize
      this.getUsers()
    },
    handleCurrentChange(currentpage) {
      this.queryInfor.pagenum = currentpage
      this.getUsers()
    },
    async getUsers() {
      const res = await getUsers(this.queryInfor)
      if (res.meta.status !== 200) {
        this.$message.error(this.meta.message)
        return
      }
      this.total = res.data.total
      this.users = res.data.users
    }
  }
}
</script>
<style lang="stylus" scoped>
.el-card
  box-shadow 0 1px 1px rgba(0,0,0,.1) !important
  .el-table
    margin 15px 0
    font-size 12px
</style>
