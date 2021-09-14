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
          <el-input
            placeholder="请输入内容"
            v-model="queryInfor.query"
            clearable
            @clear="getUsers"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchUsers"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
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
          <template v-slot="scope">
            <!-- 编辑用户按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="clickFixUser(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteMessage(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
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
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="closeDialog"
    >
      <el-form
        label-width="70px"
        :model="addFrom"
        ref="addFromRef"
        :rules="addFromRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFrom.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="dialogVisible2"
      width="50%"
      @close="closeDialog2"
    >
      <el-form
        :model="fixForm"
        label-width="70px"
        ref="fixForm"
        :rules="addFromRules"
      >
        <el-form-item label="用户名">
          <el-input v-model="fixForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="fixForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="fixForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="fixUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUsers,
  setUserState,
  addOneUser,
  fixUser,
  getOneUser,
  deleteUser
} from '../../api/user'
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      var reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (!reg.test(value)) {
        callback(new Error('邮箱不合法'))
      }
      callback()
    }
    var checkMobile = (rule, value, callback) => {
      var reg = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/
      if (!reg.test(value)) {
        callback(new Error('手机号不合法'))
      }
      callback()
    }
    return {
      queryInfor: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      users: [],
      total: 0,
      dialogVisible: false,
      addFrom: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFromRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      dialogVisible2: false,
      fixForm: {}
    }
  },
  created() {
    this.getUsers()
  },
  methods: {
    // 删除用户提示，防止误操作
    deleteMessage(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteUser(id)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 删除用户
    async deleteUser(id) {
      const res = await deleteUser(id)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
        return
      }
      this.$message.success(res.meta.msg)
      this.getUsers()
    },
    // 当点击修改按钮时，跳出对话框，获取用户信息
    async clickFixUser(id) {
      // 获取当前用户信息
      const res = await getOneUser(id)
      if (res.meta.status !== 200) {
        this.$message.error('获取当前用户失败')
        return
      }
      this.fixForm = res.data
      // 打开对话框
      this.dialogVisible2 = true
    },
    // 修改用户信息
    fixUser() {
      this.$refs.fixForm.validate(async valid => {
        if (!valid) {
          return
        }
        const res = await fixUser({
          id: this.fixForm.id,
          email: this.fixForm.email,
          mobile: this.fixForm.mobile
        })
        if (res.meta.status !== 200) {
          this.$message.error('修改用户信息失败')
          return
        }
        this.$message.success(res.meta.msg)
        this.dialogVisible2 = false
        this.getUsers()
      })
    },
    // 关闭对话框时，重置表单
    closeDialog2() {
      this.$refs.fixForm.resetFields()
    },
    // 增加用户信息
    addUser() {
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) {
          return
        }
        const res = await addOneUser(this.addFrom)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        // 提示成功
        this.$message.success(res.meta.msg)
        // 关闭对话框
        this.dialogVisible = false
        // 重新获取用户信息
        this.getUsers()
      })
    },
    // 关闭对话框时，重置表单
    closeDialog() {
      // 关闭对话框时重置表单
      this.$refs.addFromRef.resetFields()
    },
    // 搜索用户信息
    searchUsers() {
      this.getUsers()
    },
    // 改变用户状态
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
    // 改变每页张数时重新获取用户信息
    handleSizeChange(newsize) {
      this.queryInfor.pagesize = newsize
      this.getUsers()
    },
    // 点击页码时重新获取用户信息
    handleCurrentChange(currentpage) {
      this.queryInfor.pagenum = currentpage
      this.getUsers()
    },
    // 获取用户信息
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
