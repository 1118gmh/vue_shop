<template>
  <el-container>
    <el-header>
      <div class="header_box">
        <img src="../assets/logo.png" alt="" style="height:60px;margin-left:10px;margin-ringht:20px;" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isColleapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">| | |</div>
        <el-menu
          :router="true"
          :collapse-transition="false"
          :collapse="isColleapse"
          :unique-opened="true"
          :default-active="activePath"
          class="el-menu-vertical-demo"
          background-color="#313743"
          text-color="#fff"
          active-text-color="#359BFF"
        >
          <template v-for="item in menus">
            <!-- 一级菜单 -->
            <el-submenu :index="item.id + ''" :key="item.id">
              <template slot="title">
                <i :class="iconList[item.id]" class="iconFont"></i>
                <span>{{ item.authName }}</span>
              </template>
              <template v-for="item2 in item.children">
                <!-- 二级菜单 -->
                <el-menu-item :index="'/' + item2.path" :key="item2.id" @click="activeChangePath('/' + item2.path)">
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{ item2.authName }}</span>
                  </template>
                </el-menu-item>
              </template>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <!-- main -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenus } from '../api/home'
export default {
  data() {
    return {
      menus: [],
      iconList: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠
      isColleapse: false,
      // 激活的路由路径
      activePath: ''
    }
  },
  watch: {
    $route(to, from) {
      this.activePath = to.path
    }
  },
  async created() {
    this.getMenus()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    activeChangePath(activePath) {
      this.activePath = activePath
      window.sessionStorage.setItem('activePath', activePath)
    },
    toggleCollapse() {
      this.isColleapse = !this.isColleapse
    },
    logout() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getMenus() {
      const res = await getMenus()
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
        return
      }
      this.menus = res.data
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-container
  height 100%
.el-header
  background #363D40
  display flex
  justify-content space-between
  align-items center
  padding-left 0
  color #fff
  font-size 20px
  .header_box
    display flex
    align-items center
    span
      margin-left 10px
.el-aside
  background #313743
  .el-menu
    border none
.el-main
  background #E9EDF1
.iconFont
  margin-right 10px
.toggle-button
  height 20px
  background #495163
  text-align center
  color #fff
  font-size 12px
  line-height 20px
  cursor pointer
</style>
