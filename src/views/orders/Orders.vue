<template>
  <div>
    <!-- 面包屑导航 -->
    <BreadCrumb
      first="首页"
      second="订单管理"
      third="订单列表"
      path="home"
    ></BreadCrumb>
    <el-card>
      <!-- 搜索栏 -->
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="searchOrder"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchOrder"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="orderDate" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="300px">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template v-slot="scope">
            <el-tag v-if="scope.row.order_pay === '0'" type="danger"
              >未付款</el-tag
            >
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="170px">
          <template v-slot="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="120px">
          <template v-slot="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editOrderDialogVisible = true"
            ></el-button>
            <!-- 位置 -->
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="clickLocation(scope.row.order_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑订单对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editOrderDialogVisible"
      width="50%"
      @close="closeEditOrderDialog"
    >
      <el-form
        :model="addressForm"
        label-width="100px"
        ref="addressFormRef"
        :rules="addressFormRules"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityDate"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editOrderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOrderDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="processDialogVisible"
      width="50%"
      @close="closeProcessDialog"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in process"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import BreadCrumb from '../../components/BreadCrumb.vue'
import { getOrders } from '../../api/order'
import cityDate from './citydata'
import process from './process'
export default {
  data() {
    return {
      // 获取订单数据参数
      queryInfo: {
        pagenum: 1,
        pagesize: 10,
        query: ''
      },
      // 总数
      total: 0,
      // 订单列表数据
      orderDate: [],
      // 编辑订单对话框的显示隐藏
      editOrderDialogVisible: false,

      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: { required: true, message: '请选择省市区地址' },
        address2: { required: true, message: '请填写详细地址', trigger: 'blur' }
      },
      // 城市数据
      cityDate: cityDate,
      // 物流信息（这个由于服务端获取不到数据，所以提供假数据来实现）
      process: process,
      processDialogVisible: false
    }
  },
  created() {
    this.getOrders()
  },
  methods: {
    // 关闭物流进度对话框
    closeProcessDialog() {},
    // 点击位置
    async clickLocation(id) {
      // 服务器端错误，获取不到物流信息
      // const res = await getProcess(id)
      this.processDialogVisible = true
    },
    // 关闭编辑订单对话框触发
    closeEditOrderDialog() {
      this.$refs.addressFormRef.resetFields()
    },
    // 处理当前页跳转
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum
      this.getOrders()
    },
    // 处理每页获取多少数据
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize
      this.getOrders()
    },
    // 搜索订单
    searchOrder() {
      this.getOrders()
    },
    // 获取订单列表数据
    async getOrders() {
      const res = await getOrders(this.queryInfo)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.total = res.data.total
      this.orderDate = res.data.goods
    }
  },
  components: {
    BreadCrumb
  }
}
</script>
<style lang="stylus" scoped>
.el-table
  margin 15px 0
</style>
