<template>
  <div>
    <!-- 面包屑导航 -->
    <BreadCrumb
      first="首页"
      second="商品管理"
      third="编辑商品"
      path="home"
    ></BreadCrumb>
    <el-card>
      <el-form
        :model="editGoodInfo"
        :rules="editGoodFormRules"
        ref="editFormRef"
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
              <el-input v-model="editGoodInfo.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="editGoodInfo.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="editGoodInfo.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="editGoodInfo.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="editGoodInfo.goods_cat"
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
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :file-list="fileList"
              list-type="picture"
              :headers="headerObj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              ref="myQuillEditor"
              v-model="editGoodInfo.goods_introduce"
            />
            <!-- 添加商品的按钮 -->
            <el-button
              type="primary"
              style="margin-top:15px;"
              @click="finishEdit"
              >提交</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import BreadCrumb from '../../components/BreadCrumb.vue'
import {
  getGoodById,
  getCategories,
  getCateParams,
  editGood
} from '../../api/goods'
import _ from 'lodash'
export default {
  data() {
    return {
      // 编辑商品的参数
      editGoodInfo: {},
      // 表单规则
      editGoodFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', tirgger: 'blur' }
        ],
        goods_price: [{ required: true, message: '请输入商品价格' }],
        goods_weight: [{ required: true, message: '请输入商品重量' }],
        goods_number: [{ required: true, message: '请输入商品数量' }],
        goods_cat: [{ required: true, message: '请选择商品分类' }]
      },
      activeIndex: '0',
      // 商品分类列表
      cateList: [],
      // 级联选择器的配置项
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      goodOnlyParams: [],
      goodManyParams: [],
      fileList: [],
      pics: [],
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
  created() {
    this.getCate()
    this.getData()
  },
  methods: {
    // 完成提交
    async finishEdit() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('验证不通过')
        }
      })
      const form = _.cloneDeep(this.editGoodInfo)
      // 让提交的good_cats变为字符串
      form.goods_cat = form.goods_cat.join(',')
      form.attrs = []
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
      console.log(form.attrs)
      this.pics.forEach(item => {
        form.pics.push({ pic: item.pic })
      })
      const formInfo = {
        goods_name: form.goods_name,
        goods_price: form.goods_price,
        goods_number: form.goods_number,
        goods_weight: form.goods_weight,
        goods_cat: form.goods_cat,
        goods_introduce: form.goods_introduce,
        pics: form.pics,
        attrs: form.attrs
      }
      const res = await editGood(this.$route.params.id, formInfo)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.$router.push('/goods')
    },
    // 上传图片成功后触发
    handleSuccess(response) {
      console.log(response)
      this.fileList.push({
        url: response.data.url,
        pic: response.data.tmp_path
      })
      this.pics.push({
        url: response.data.url,
        pic: response.data.tmp_path
      })
    },
    // 处理移除图片操作
    handleRemove(file) {
      console.log(file)
      // 获取图片路径
      const filePath = file.pic
      // 找到表单中的图片数组中对应图片的下表
      const i = this.fileList.findIndex(item => item.pic === filePath)
      // 移除那一项
      this.fileList.splice(i, 1)
    },
    // 级联选择器选中项变化，会触发这个函数
    handleChange() {
      if (this.editGoodInfo.goods_cat.length !== 3) {
        this.editGoodInfo.goods_cat = []
        return this.$message.error('请选择三级分类')
      }
    },
    // 在tab切换之前判断，如果没有选中三级分类，就通过before-leave属性阻断切换
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.editGoodInfo.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 点击tab触发
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
    // 获取编辑的商品的信息
    async getData() {
      const res = await getGoodById(this.$route.params.id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      res.data.goods_cat = res.data.goods_cat.split(',')
      res.data.goods_cat = res.data.goods_cat.map(item => item - 0)
      res.data.pics.forEach(item => {
        this.fileList.push({
          url: item.pics_big_url,
          pic: item.pics_big
        })
      })
      this.editGoodInfo = res.data
      console.log(this.editGoodInfo)
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
      if (this.editGoodInfo.goods_cat.length === 3) {
        return this.editGoodInfo.goods_cat[2]
      }
      return null
    }
  },
  components: {
    BreadCrumb
  }
}
</script>
