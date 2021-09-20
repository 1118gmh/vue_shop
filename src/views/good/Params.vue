<template>
  <div>
    <!-- 面包屑导航 -->
    <BreadCrumb
      first="首页"
      second="商品管理"
      third="参数列表"
      path="home"
    ></BreadCrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 警告区 -->
      <el-alert
        title="注意：只允许三级分类设置参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_op">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区 -->
      <el-tabs v-model="activeName" @tab-click="handleClickTab">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            style="margin-bottom:15px;"
            @click="clickAddParams"
            >添加参数</el-button
          >

          <!-- 动态参数表格 -->
          <el-table :data="params" stripe border v-if="!isBtnDisabled">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(tag, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(scope.row, index)"
                  style="margin: 0 5px;"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  style="width:120px;"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else size="small" @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>

            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="clickEditParamsButton(scope.row)"
                >
                  修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="clickDeleteParamsButton(scope.row)"
                >
                  删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            style="margin-bottom:15px;"
            @click="clickAddParams"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="params" stripe border v-if="!isBtnDisabled">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(tag, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  style="margin: 0 5px;"
                >
                  {{ tag }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="clickEditParamsButton(scope.row)"
                >
                  修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="clickDeleteParamsButton(scope.row)"
                >
                  删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加动态参数对话框 -->
    <el-dialog
      :title="'添加' + paramsType"
      :visible.sync="paramsDialogVisible"
      width="50%"
      @close="closeParamsDialog"
    >
      <el-form ref="paramsForm" :model="paramsForm" :rules="paramsFormRules">
        <el-form-item
          :label="paramsType + '名称'"
          label-width="120px"
          prop="attr_name"
        >
          <el-input v-model="paramsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="paramsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitAddParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + paramsType"
      :visible.sync="editParamsDialogVisible"
      width="50%"
      @close="closeEditParamsDialog"
    >
      <el-form
        ref="editParamsForm"
        :model="editParamsForm"
        :rules="paramsFormRules"
      >
        <el-form-item
          :label="paramsType + '名称'"
          label-width="120px"
          prop="attr_name"
        >
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitEditParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCategories,
  getCateParams,
  deleteParams,
  addParams,
  editParams,
  getParamsById
} from '../../api/goods'
import BreadCrumb from '../../components/BreadCrumb.vue'
export default {
  data() {
    return {
      selectCateKeys: [],
      cateList: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      params: [],
      // onlyParams: [],
      // manyParams: [],
      // 当前选中的的选项卡名，默认第一个many
      activeName: 'many',
      // 动态参数对话框的显隐
      paramsDialogVisible: false,
      // 添加参数的表单属性
      paramsForm: {
        attr_name: ''
      },
      // 添加参数的表单的 规则
      paramsFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 修改参数对话框显示与隐藏
      editParamsDialogVisible: false,
      // 修改参数表单的属性
      editParamsForm: {}
      // 直接控制不行，因为所有的按钮和文本框都会公用这两个属性，应该给每个都添加这两个属性
      // 控制按钮和文本框的切换显示
      // inputVisible: true,
      // 文本框中输入的内容
      // inputValue: ''
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 点击“x”删除tag标签
    async handleClose(row, index) {
      row.attr_vals.splice(index, 1)
      const res = await editParams(row.cat_id, row.attr_id, {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('更新失败')
      }
      this.$message.success('设置成功')
    },
    // 点击按钮，让input显示
    showInput(row) {
      row.inputVisible = true
      // 显示之后的自动聚焦
      // 通过nextTick，在dom操作后，执行这个回调函数，可以获取到el-input元素，再找到原生的input上的focus事件
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 当点击enter键或者失去焦点时触发
    async handleInputConfirm(row) {
      // 无效内容则清空并退出
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      // 有效内容就需要发送请求
      const res = await editParams(row.cat_id, row.attr_id, {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('更新失败')
      }
      this.$message.success('设置成功')
      row.inputVisible = false
      row.inputValue = ''
    },
    // 提交修改参数表单
    commitEditParams() {
      this.$refs.editParamsForm.validate(async valid => {
        if (!valid) {
          return this.$message.error('表单验证失败')
        }
        const res = await editParams(
          this.editParamsForm.cat_id,
          this.editParamsForm.attr_id,
          {
            attr_name: this.editParamsForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.getParams()
        this.editParamsDialogVisible = false
        this.$message.success(res.meta.msg)
      })
      this.editParamsDialogVisible = false
    },
    // 关闭修改参数对话框
    closeEditParamsDialog() {
      this.$refs.editParamsForm.resetFields()
      this.editParamsForm = {}
    },
    // 点击修改属性按钮
    async clickEditParamsButton(attr) {
      const res = await getParamsById(
        attr.cat_id,
        attr.attr_id,
        this.activeName
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editParamsForm = res.data
      this.editParamsDialogVisible = true
    },
    // 提交添加参数表单
    commitAddParams() {
      this.$refs.paramsForm.validate(async valid => {
        if (!valid) {
          return this.$message.error('验证不通过')
        }
        const res = await addParams(this.cateId, {
          attr_name: this.paramsForm.attr_name,
          attr_sel: this.activeName
        })

        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getParams()
        this.paramsDialogVisible = false
      })
    },
    // 关闭添加参数对话框
    closeParamsDialog() {
      this.$refs.paramsForm.resetFields()
    },
    // 点击添加参数按钮
    clickAddParams() {
      this.paramsDialogVisible = true
    },
    // 点击修改静态属性按钮
    // clickEditOnlyParamsButton(attr) {
    //   console.log(attr)
    // },
    // 点击删除静态属性按钮
    clickDeleteParamsButton(attr) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await deleteParams(attr.cat_id, attr.attr_id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // this.getOnlyParams()
          this.getParams()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 点击删除动态参数按钮
    // clickDeleteManyParamsButton(attr) {
    //   this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(async () => {
    //       const res = await deleteParams(attr.cat_id, attr.attr_id)
    //       if (res.meta.status !== 200) {
    //         return this.$message.error(res.meta.msg)
    //       }
    //       this.getParams()
    //       this.$message({
    //         type: 'success',
    //         message: '删除成功!'
    //       })
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: 'info',
    //         message: '已取消删除'
    //       })
    //     })
    // },
    // 点击修改动态参数按钮
    // clickEditManyParamsButton(attr) {},
    // 点击页签,获取动态参数或者静态属性
    handleClickTab() {
      this.getParams()
    },
    // 获取属性
    async getParams() {
      const res = await getCateParams(this.cateId, this.activeName)
      if (res.meta.status !== 200) {
        return
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 添加inputVisible和inputValue
        item.inputVisible = false
        item.inputValue = ''
      })
      this.params = res.data
    },
    // 获取动态参数
    // async getManyParams() {
    //   const res2 = await getCateParams(this.cateId, this.activeName)
    //   if (res2.meta.status !== 200) {
    //     return this.$message.error('获取失败')
    //   }
    //   this.manyParams = res2.data
    // },
    // 点击触发事件
    async handleChange() {
      if (this.selectCateKeys.length !== 3) {
        this.selectCateKeys = []
        this.params = []
        return
      }
      this.getParams()
      // 获取静态属性
      // this.getOnlyParams()
      // 获取动态参数
      // this.getManyParams()
    },
    // 获取分类列表
    async getCateList() {
      const res = await getCategories()
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败')
      }
      this.cateList = res.data
    }
  },
  computed: {
    cateId() {
      return this.selectCateKeys[2]
    },
    paramsType() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    },
    isBtnDisabled() {
      if (this.selectCateKeys.length !== 3) {
        return true
      } else {
        return false
      }
    }
  },
  components: {
    BreadCrumb
  }
}
</script>

<style lang="stylus" scoped>
.cat_op
  margin 15px 0
</style>
