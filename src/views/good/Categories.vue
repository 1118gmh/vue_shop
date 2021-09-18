<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumb
      first="首页"
      second="商品管理"
      third="商品分类"
      path="home"
    ></BreadCrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 添加分配按钮 -->
      <el-row style="margin-bottom:15px;">
        <el-col
          ><el-button type="primary" @click="clickAddCategories"
            >添加分类</el-button
          ></el-col
        >
      </el-row>
      <!-- 分类列表 -->
      <tree-table
        :data="categories"
        :columns="columns"
        :expand-type="false"
        :selection-type="false"
        :show-index="true"
        index-text="#"
        :show-row-hover="false"
        border
      >
        <template v-slot:isok="scope">
          <el-icon
            class="el-icon-success"
            v-if="scope.row.cat_level"
            style="color:lightgreen;"
          ></el-icon>
          <el-icon class="el-icon-error" v-else style="color:red;"></el-icon>
        </template>
        <template v-slot:sort="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="danger" v-if="scope.row.cat_level === 2">三级</el-tag>
        </template>
        <template v-slot:operation="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="clickEditCategoriesButton(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCurrentCategories(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="changePageSize"
        @current-change="changeCurrentPage"
        style="margin-top:15px;"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类弹框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="goodCategoriesDialog"
      width="50%"
      @close="resetgoodCategoriesDialog"
    >
      <el-form
        ref="goodCategoriesForm"
        label-width="80px"
        :model="goodCategoriesInfo"
        :rules="goodCategoriesRules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="goodCategoriesInfo.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="cat_pid">
          <el-cascader
            style="width:100%;"
            v-model="currentCategories"
            :options="twoGoodCategories"
            :props="cascaderProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加分类的表单弹框 -->
    <!-- <InputDialog
      :visibleDialog="goodCategoriesDialog"
      title="添加分类"
      Form="goodCategoriesForm"
      :formData="categoriesData"
      :itemProps="categoriesProps"
      @commit="goodCategoriesDialog = false"
      @quit="goodCategoriesDialog = false"
      @close="close"
    ></InputDialog> -->
    <!-- 编辑用户对话框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editCategoriesDialog"
      width="50%"
      @close="editCategoriesDialogClose"
    >
      <el-form
        ref="editCategoriesRef"
        :model="editCategoriesInfo"
        :rules="editCategoriesRules"
      >
        <el-form-item label="分类名称" prop="cat_name" label-width="80px">
          <el-input v-model="editCategoriesInfo.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCategoriesDialog = false">取 消</el-button>
        <el-button type="primary" @click="commitEditCategories"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import BreadCrumb from '../../components/BreadCrumb.vue'
import {
  getCategories,
  addCategories,
  queryCategoriesById,
  commitEditCategories,
  deleteCategories
} from '../../api/goods'
// import InputDialog from '../../components/InputDialog.vue'
export default {
  data() {
    return {
      // 指定每一列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 将列定义为模板列
          type: 'template',
          // 当列为模板列时，对应的作用域插槽名称
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation'
        }
      ],
      // 商品分类的数据
      categories: [],
      // 分页的参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总数
      total: 0,
      goodCategoriesDialog: false,
      // 添加分类表单的数据对象
      goodCategoriesInfo: {
        // 添加分类的名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的层级，默认一级
        cat_level: 0
      },
      // 添加分类表单的验证规则
      goodCategoriesRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 级联选择框当前选中的分类
      currentCategories: [],
      // 2层分类数据
      twoGoodCategories: [],
      // 级联选择器的配置项
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        checkStrictly: true
      },
      // 编辑分类对话框的显隐
      editCategoriesDialog: false,
      // 查询到的当前分类信息
      editCategoriesInfo: {},
      editCategoriesRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
      // goodCategoriesDialog: false,
      // categoriesData: {
      //   cat_name: '',
      //   cat_pid: ''
      // },
      // categoriesProps: [
      //   {
      //     label: '分类名称',
      //     prop: 'cat_name'
      //   },
      //   {
      //     label: '父级分类',
      //     prop: 'cat_pid'
      //   }
      // ]
    }
  },
  methods: {
    // 删除当前的分类
    deleteCurrentCategories(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await deleteCategories(id)
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败')
          }
          this.getCategories()
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
    // 提交编辑分类
    commitEditCategories() {
      this.$refs.editCategoriesRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('验证失败')
        }
        const res = await commitEditCategories(this.editCategoriesInfo)
        if (res.meta.status !== 200) {
          return this.$message.error('更新失败')
        }
        this.$message.success('更新成功')
        this.getCategories()
        this.editCategoriesDialog = false
      })
    },
    // 点击编辑分类对话框按钮时
    async clickEditCategoriesButton(id) {
      const res = await queryCategoriesById(id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editCategoriesInfo = res.data
      this.editCategoriesDialog = true
    },
    // 编辑分类对话框关闭
    editCategoriesDialogClose() {
      this.$refs.editCategoriesRef.resetFields()
      this.editCategoriesInfo = {}
    },
    // 提交添加分类请求
    commit() {
      this.$refs.goodCategoriesForm.validate(async valid => {
        if (!valid) {
          return this.$message.error('验证失败')
        }
        const res = await addCategories(this.goodCategoriesInfo)
        if (res.meta.status !== 201) {
          return this.$message.error('创建失败')
        }

        this.$message.success('创建成功')
        this.getCategories()
        this.goodCategoriesDialog = false
      })
    },
    // 当选择器值改变时，改变对应的参数，用于发送请求
    handleChange(value) {
      this.goodCategoriesInfo.cat_pid = value[value.length - 1]
      this.goodCategoriesInfo.cat_level = value.length
    },
    // 当点击添加分类按钮时
    async clickAddCategories() {
      const res = await getCategories({ type: 2 })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.twoGoodCategories = res.data
      this.goodCategoriesDialog = true
    },
    // 关闭添加分类对话框，表单重置，表单中数据重置
    resetgoodCategoriesDialog() {
      this.$refs.goodCategoriesForm.resetFields()
      this.currentCategories = []
      this.goodCategoriesInfo = {
        // 添加分类的名称currentCategories
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的层级，默认一级
        cat_level: 0
      }
    },
    // 点击页面时触发方法，获取当前页，重新请求数据
    changeCurrentPage(currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getCategories()
    },
    // 点击改变每页数据时，修改pagesize，重新获取数据
    changePageSize(pagesize) {
      this.queryInfo.pagesize = pagesize
      this.getCategories()
    },
    // 获取所有的分类数据
    async getCategories() {
      const res = await getCategories(this.queryInfo)
      if (res.meta.status !== 200) {
        return this.$message.error('获取列表数据失败 ')
      }
      this.total = res.data.total
      this.categories = res.data.result
    }
  },
  created() {
    this.getCategories()
  },
  components: {
    BreadCrumb
    // InputDialog
  }
}
</script>
<style lang="stylus" scoped></style>
