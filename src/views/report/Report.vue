<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width:1100px;height:400px;"></div>
    </el-card>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import { getData } from '../../api/report'
import _ from 'lodash'
export default {
  data() {
    return {
      // 需要合并的数据（服务器返回的数据不完整，需要合并）
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods: {},
  created() {
    // 获取图表数据
  },
  async mounted() {
    // 元素渲染完毕，在mounted中可以获取dom
    var myChart = echarts.init(document.getElementById('main'), null, {
      renderer: 'svg'
    })
    // 获取服务器的返回的报表数据
    const res = await getData()
    if (res.meta.status !== 200) {
      return this.$message.error(res.meta.msg)
    }
    // 服务器返回的数据不完整，需要合并配置项
    const reportData = _.merge(res.data, this.options)
    myChart.setOption(reportData)
  }
}
</script>
<style lang="stylus" scoped></style>
