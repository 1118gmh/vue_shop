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
          ><el-button type="primary" @click="goodCategoriesDialog = true"
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
        <template v-slot:operation>
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
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
      <!-- <el-form
        ref="goodCategoriesForm"
        label-width="80px"
        :model="goodCategoriesInfo"
        :rules="rolesRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form> -->

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
  </div>
</template>
<script>
import BreadCrumb from '../../components/BreadCrumb.vue'
import { getCategories } from '../../api/goods'
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
      goodCategoriesInfo: {
        cat_name: '',
        cat_pid: ''
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
    resetgoodCategoriesDialog() {
      this.$refs.goodCategoriesForm.resetFields()
    },
    changeCurrentPage(currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getCategories()
    },
    changePageSize(pagesize) {
      this.queryInfo.pagesize = pagesize
      this.getCategories()
    },
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
