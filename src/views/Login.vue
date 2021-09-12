<template>
  <div class="login">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="logo" class="avatar_img" />
      </div>
      <el-form label-width="0" class="login_form">
        <!-- 用户名 -->
        <el-form-item>
          <el-input></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item>
          <el-input></el-input>
        </el-form-item>
        <!-- 登录 注册-->
        <el-form-item class="btns">
          <el-button type="primary">登录</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {

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
