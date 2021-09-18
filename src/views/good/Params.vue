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
      <el-tabs v-model="activeName">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled"
            >添加参数</el-button
          >

          <!-- 动态参数表格 -->
          <el-table :data="manyParams" stripe border v-if="!isBtnDisabled">
            <el-table-column type="expand"></el-table-column>

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
                  @click="clickEditManyParamsButton(scope.row)"
                >
                  修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="clickDeleteManyParamsButton(scope.row)"
                >
                  删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyParams" stripe border v-if="!isBtnDisabled">
            <el-table-column type="expand"></el-table-column>

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
                  @click="clickEditOnlyParamsButton(scope.row)"
                >
                  修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="clickDeleteOnlyParamsButton(scope.row)"
                >
                  删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getCategories, getCateParams } from '../../api/goods'
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
      onlyParams: [],
      manyParams: [],
      // 当前选中的的选项卡名，默认第一个first
      activeName: 'many'
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 点击修改静态属性按钮
    clickEditOnlyParamsButton(attr) {
      console.log(attr)
    },
    // 点击删除静态属性按钮
    clickDeleteOnlyParamsButton(attr) {
      console.log(attr)
    },
    // 点击修改动态参数按钮
    clickDeleteManyParamsButton(attr) {
      console.log(attr)
    },
    // 点击删除动态参数按钮
    clickEditManyParamsButton(attr) {
      console.log(attr)
    },
    // 点击页签
    // handleClickTab() {
    //   console.log(this.activeName)
    // },
    // 点击触发事件
    async handleChange() {
      if (this.selectCateKeys.length !== 3) {
        this.selectCateKeys = []
        return this.$message.error('请选择三级分类')
      }
      // 获取静态属性
      const res1 = await getCateParams(this.selectCateKeys[2], 'only')
      if (res1.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.onlyParams = res1.data
      // 获取动态参数
      const res2 = await getCateParams(this.selectCateKeys[2], 'many')
      if (res2.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.manyParams = res2.data
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
