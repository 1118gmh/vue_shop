<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumb
      first="首页"
      second="权限管理"
      third="角色管理"
      path="home"
    ></BreadCrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 按钮：添加角色 -->
      <el-button type="primary" class="addRoles" @click="open"
        >添加角色</el-button
      >
      <!-- 表格：角色列表信息 -->
      <el-table :data="rolesData" border style="width: 100%">
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['topLine', 'vcenter', index1 === 0 ? 'noLine' : '']"
              v-for="(item1, index1) in scope.row.children"
              :key="index1"
            >
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="['topLine', 'vcenter', index2 === 0 ? 'noLine' : '']"
                  v-for="(item2, index2) in item1.children"
                  :key="index2"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="13">
                    <el-tag
                      v-for="(item3, index3) in item2.children"
                      :key="index3"
                      type="info"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="openDialog2(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showAuthDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="resetDialog"
    >
      <el-form
        ref="addRolesForm"
        label-width="80px"
        :model="rolesForm"
        :rules="rolesRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="dialogVisible2"
      width="50%"
      @close="resetDialog2"
    >
      <el-form
        ref="editRoleForm"
        label-width="80px"
        :model="rolesForm2"
        :rules="rolesRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesForm2.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rolesForm2.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="commitDialog2">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="authDialog"
      width="50%"
      @close="closeAuthDialog"
    >
      <!-- 树型结构，所有 权限 -->
      <el-tree
        ref="tree"
        :data="authData"
        show-checkbox
        node-key="id"
        :default-expanded-keys="defaultArray"
        :default-expand-all="true"
        :default-checked-keys="defaultArray"
        :props="defaultProps"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="authDialog = false">取 消</el-button>
        <el-button type="primary" @click="commitAuthDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import BreadCrumb from '@/components/BreadCrumb'
import {
  getRights,
  getRolesData,
  addRoles,
  getRoleById,
  editRole,
  deleteRole,
  deleteAuth,
  fixRoleRights
} from '@/api/rights'
export default {
  data() {
    return {
      // 角色数据
      rolesData: [],
      // 添加角色对话框
      dialogVisible: false,
      // 添加角色表单组件数据
      rolesForm: {
        roleName: '',
        roleDesc: ''
      },
      // 表单组件验证规则
      rolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      // 编辑角色对话框
      dialogVisible2: false,
      // 编辑角色表单数据
      rolesForm2: {},
      // 分配权限对话框
      authDialog: false,
      // 树形控件绑定的数据
      authData: [],
      // 树形控件属性绑定对象
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 树形控件默认绑定的数据(根据authData中的id来绑定默认选中的)
      defaultArray: [],
      // 当点击分配权限时的用户ID,用于用户授权
      roleId: ''
    }
  },
  created() {
    this.getRolesData()
  },
  components: {
    BreadCrumb
  },
  methods: {
    async commitAuthDialog() {
      // 全选的key
      const checkedRights = this.$refs.tree.getCheckedKeys()
      // 半选的key
      const halfCheckedRights = this.$refs.tree.getHalfCheckedKeys()
      const authString =
        checkedRights.join(',') + ',' + halfCheckedRights.join(',')
      console.log(this.roleId, authString)
      const res = await fixRoleRights(this.roleId, authString)
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success(res.meta.msg)
      this.authDialog = false
      this.getRolesData()
    },
    closeAuthDialog() {
      this.defaultArray = []
      this.roleId = ''
    },
    getAllAuthIDByRole(node, arr) {
      if (!node.children) {
        arr.push(node.id)
        return
      }
      node.children.forEach(item => this.getAllAuthIDByRole(item, arr))
    },
    async showAuthDialog(role) {
      // 获取所有权限数据
      const res = await getRights('tree')
      if (res.meta.status !== 200) {
        this.$message.error('获取数据失败')
        return
      }
      this.authData = res.data
      // 获取默认绑定的权限
      this.getAllAuthIDByRole(role, this.defaultArray)
      // if(res.meta.status !== 200){}
      // 打开对话框
      this.authDialog = true
      // 获取到roleId数据，用于角色授权
      this.roleId = role.id
    },
    // 根据id删除对应的权限，删除需要弹框提示
    removeRightById(role, authId) {
      this.$confirm('此操作将永久删除，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await deleteAuth(role.id, authId)
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg)
            return
          }
          this.$message.success(res.meta.msg)
          // 不建议重新获取用户权限列表，因为会刷新整个列表，下拉会闭合
          // this.getRolesData()
          // 应该这样，由于删除后返回的是新的权限数据，改变role的children，直接赋值就好
          role.children = res.data
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 删除角色
    deleteRole(id) {
      this.$confirm('此操作将永久删除，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await deleteRole(id)
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg)
            return
          }
          this.$message.success('删除成功!')
          this.getRolesData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 提交编辑角色表单
    commitDialog2() {
      // 表单验证
      this.$refs.editRoleForm.validate(async valid => {
        if (!valid) {
          this.$message.error('表单验证失败')
          return
        }
        const res = await editRole(this.rolesForm2)
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg)
          return
        }
        this.$message.success(res.meta.msg)
        this.dialogVisible2 = false
        this.getRolesData()
      })
    },
    // 打开编辑对话框时，让对话框显示，获取信息
    async openDialog2(id) {
      const res = await getRoleById(id)
      this.rolesForm2 = res.data
      this.dialogVisible2 = true
    },
    resetDialog2() {
      this.$refs.editRoleForm.resetFields()
    },
    // 提交添加用户的表单，先验证表单，在发送请求，若失败，就提示用户失败，若成功，提示用户成功、关闭对话框、更新列表
    commit() {
      this.$refs.addRolesForm.validate(async valid => {
        if (!valid) {
          this.$message.error('验证失败')
          return
        }
        const res = await addRoles(this.rolesForm)
        if (res.meta.status !== 201) {
          this.$message.error(res.meta.msg)
          return
        }
        this.$message.success(res.meta.msg)
        this.dialogVisible = false
        this.getRolesData()
      })
    },
    resetDialog() {
      this.$refs.addRolesForm.resetFields()
    },
    open() {
      this.dialogVisible = true
    },
    async getRolesData() {
      const res = await getRolesData()
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
        return
      }
      this.rolesData = res.data
    }
  }
}
</script>

<style lang="stylus" scoped>
.addRoles
  margin-bottom 15px
.el-tag
  margin 10px
.topLine
  border-top 1px solid #ccc
.noLine
  border-top none
.vcenter
  display flex
  align-items center
</style>
