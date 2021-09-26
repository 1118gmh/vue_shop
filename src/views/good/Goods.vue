<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumb first="首页" second="商品管理" third="商品列表" path="home"></BreadCrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row style="margin-bottom:15px;">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="goodsInfo.query" clearable @clear="clearSearchInput">
            <template v-slot:append>
              <el-button icon="el-icon-search" @click="clickSearchButton"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4" style="margin-left:15px;">
          <el-button type="primary" @click="toAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="goods" stripe border>
        <el-table-column type="index" label="#" width="60px"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="120px"> </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80px"> </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="170px">
          <template v-slot="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="120px">
          <template v-slot="scope">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGood(scope.row.goods_id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGood(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsInfo.pagenum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="goodsInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top:15px;"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
import BreadCrumb from '../../components/BreadCrumb.vue'
import { getGoods, deleteGoods } from '../../api/goods'
export default {
  data() {
    return {
      // 获取商品的参数
      goodsInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品信息
      goods: [],
      // 总数据条数
      total: 0
    }
  },
  created() {
    this.getGoods()
  },
  methods: {
    // 编辑商品
    async editGood(goodsId) {
      this.$router.push(`/edit/${goodsId}`)
    },
    // 删除商品
    deleteGood(goodsId) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await deleteGoods(goodsId)
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败')
          }
          this.$message.success('删除成功')
          this.getGoods()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 清空searchInput
    clearSearchInput() {
      this.getGoods()
    },
    // 设置每页多少条
    handleSizeChange(val) {
      this.goodsInfo.pagesize = val
      this.getGoods()
    },
    // 设置当前页
    handleCurrentChange(val) {
      this.goodsInfo.pagenum = val
      this.getGoods()
    },
    // 点击添加商品,跳转添加商品页面
    toAddPage() {
      this.$router.push('goods/add')
    },
    // 点击搜索按钮
    clickSearchButton() {
      this.getGoods()
    },
    // 获取所有商品的信息
    async getGoods() {
      const res = await getGoods(this.goodsInfo)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品信息失败')
      }
      this.goods = res.data.goods
      this.total = res.data.total
    }
  },
  components: {
    BreadCrumb
  }
}
</script>
<style lang="stylus" scoped></style>
