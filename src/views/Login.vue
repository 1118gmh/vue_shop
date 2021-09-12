<template>
  <div class="login">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="logo" class="avatar_img" />
      </div>
      <el-form
        :model="loginFrom"
        :rules="loginFromRules"
        label-width="0"
        class="login_form"
        ref="loginFromRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginFrom.username"
            placeholder="用户名"
            prefix-icon="iconfont icon-icon"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginFrom.password"
            type="password"
            placeholder="密码"
            prefix-icon="iconfont icon-mima"
          ></el-input>
        </el-form-item>
        <!-- 登录 注册-->
        <el-form-item class="btns">
          <el-button type="primary" @click="submitForm('loginFromRef')"
            >登录</el-button
          >
          <el-button type="info" @click="resetForm('loginFromRef')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { login } from '../api/login'
export default {
  data() {
    return {
      // 登录表单的数据对象
      loginFrom: {
        username: 'admin',
        password: '123456'
      },
      loginFromRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      // 表单校验
      this.$refs[formName].validate(async valid => {
        if (!valid) {
          return false
        }
        const res = await login(
          this.loginFrom.username,
          this.loginFrom.password
        )
        // 登录失败
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败')
        }
        // 登录成功
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="stylus" scoped>
.login
  position relative
  background #2b4b6b
  height 100%
  .login_box
    position absolute
    top 50%
    left 50%
    transform translate(-50%,-50%)
    width 450px
    height 300px
    background #fff
    border-radius 10px
    .avatar_box
      box-sizing border-box
      margin 0 auto
      transform translateY(-50%)
      padding 10px
      height 130px
      width 130px
      background #fff
      border-radius 50%
      .avatar_img
        width 100%
        height 100%
        background #eee
        border-radius 50%
    .login_form
      position absolute
      bottom 0
      box-sizing border-box
      padding 0 10px
      width 100%
      .btns
        display flex
        justify-content flex-end
</style>
