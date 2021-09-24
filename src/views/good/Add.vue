<template>
  <div>
    <!-- 面包屑导航 -->
    <BreadCrumb
      first="首页"
      second="商品管理"
      third="添加商品"
      path="home"
    ></BreadCrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 消息提示 -->
      <el-alert title="添加商品信息" type="info" show-icon center> </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏 -->
      <!-- form表单：要包裹tab -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in goodManyParams"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item2"
                  v-for="(item2, index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in goodOnlyParams"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              :headers="headerObj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            />
            <!-- 添加商品的按钮 -->
            <el-button type="primary" style="margin-top:15px;" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="priviewVisible" width="50%">
      <img :src="priviewPath" style="width:100%;" />
    </el-dialog>
  </div>
</template>
<script>
import BreadCrumb from '../../components/BreadCrumb.vue'
import { getCategories, getCateParams, addGoods } from '../../api/goods'
import _ from 'lodash'
export default {
  data() {
    return {
      // 步骤条和tab栏对应的索引
      activeIndex: '0',
      // 添加商品表单
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的描述
        goods_introduce: '',
        attrs: []
      },
      // 表单规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', tirgger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', tirgger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', tirgger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', tirgger: 'blur' }
        ],
        goods_cat: [{ required: true, message: '请选择商品分类' }]
      },
      // 商品分类列表
      cateList: [],
      // 级联选择器的配置项
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数列表数据
      goodManyParams: [],
      // 静态属性列表数据
      goodOnlyParams: [],
      // 上传图片时，需要定义请求头，让其拥有token值
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片路径
      priviewPath: '',
      // 图片预览对话框
      priviewVisible: false
    }
  },
  methods: {
    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('验证失败')
        }
        // 深拷贝addForm对象，防止和表单双向绑定的数据冲突
        const form = _.cloneDeep(this.addForm)
        // 让提交的good_cats变为字符串
        form.goods_cat = form.goods_cat.join(',')
        this.goodManyParams.forEach(item => {
          form.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          })
        })
        this.goodOnlyParams.forEach(item => {
          form.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          })
        })
        const res = await addGoods(form)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    },
    // 上传图片成功后触发
    handleSuccess(response) {
      this.addForm.pics.push({ pic: response.data.tmp_path })
    },
    // 处理图片预览效果
    handlePreview(file) {
      this.priviewPath = file.response.data.url
      this.priviewVisible = true
    },
    // 处理移除图片操作
    handleRemove(file) {
      // 获取图片路径
      const filePath = file.response.data.tmp_path
      // 找到表单中的图片数组中对应图片的下表
      const i = this.addForm.pics.findIndex(item => item.pic === filePath)
      // 移除那一项
      this.addForm.pics.splice(i, 1)
    },
    // tab切换点击事件
    async tabClicked() {
      if (this.activeIndex === '1') {
        const res = await getCateParams(this.cateId, 'many')
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数失败')
        }
        // 将每一个attr_vals变为数组
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.goodManyParams = res.data
      } else if (this.activeIndex === '2') {
        const res2 = await getCateParams(this.cateId, 'only')
        if (res2.meta.status !== 200) {
          return this.$message.error('获取静态属性失败')
        }
        // 将每一个attr_vals变为数组
        // res.data.forEach(item => {
        //   item.attr_vals =
        //     item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        // })
        this.goodOnlyParams = res2.data
      }
    },
    // 在tab切换之前判断，如果没有选中三级分类，就通过before-leave属性阻断切换
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 级联选择器选中项变化，会触发这个函数
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        return this.$message.error('请选择三级分类')
      }
    },
    // 获取所有商品分类
    async getCate() {
      const res = await getCategories()
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cateList = res.data
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  created() {
    // 获取商品分类
    this.getCate()
  },
  components: {
    BreadCrumb
  }
}
</script>
<style lang="stylus" scoped>
.el-checkbox
  margin 0 5px 0 0
</style>
