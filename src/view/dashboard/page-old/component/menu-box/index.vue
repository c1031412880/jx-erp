<template>
  <el-card class="menu-box">
    <div slot="header" class="clearfix">
      <el-image :src="require('@/assets/home-image/modular-1.png')"></el-image>
      <span style="color: #333333;font-size: 14px;font-weight: 400;">常用功能</span>
    </div>
    <el-row :gutter="20">
      <el-col :span="4" v-for="(item) in data" :key="item.menu_code" @click.native="openMenu(item)">
        <!-- <el-image :src="item.menu_icon ? item.menu_icon : require('@/assets/home-image/modular-9.png')"></el-image> -->
        <safe-image :imgUrl="item.menu_icon" :authToken="token"></safe-image>
        <p class="title">{{item.title}}</p>
      </el-col>
      <el-col :span="4" @click.native="allMenuDialogShow = true">
        <el-image :src="require('@/assets/home-image/common-2.png')"></el-image>
        <span class="title">添加常用</span>
      </el-col>
    </el-row>
    <all-menu-dialog @on-update="loadData" :userId="user_id" :menuListMap="menuListMap" ref="allMenuDialog" :dialogBool.sync="allMenuDialogShow"></all-menu-dialog>
  </el-card>
</template>

<script type="text/ecmascript-6">
import {getUser, getSession} from '@/utils/auth'
import allMenuDialog from './component/all-menu-dialog'
import safeImage from "@/components/image-box/component/safe-image"
export default {
  name: 'menu-box',
  components: {
    safeImage,
    allMenuDialog
  },
  created() {
    if(getUser()) {
      this.token = getSession()
      let userInfo = JSON.parse(getUser());
      this.user_id = Number(userInfo.user_id);
      this.loadData()
    }
  },
  data() {
    return {
      user_id: 0,
      routesList:[],
      menuListMap:{},
      link_title: [
        '驾驶员安全学习','服务质量监控大屏','平阳客流展示大屏','电子站牌管理','导乘屏管理'
      ],
      allMenuDialogShow: false,
      data: [],
      token: ''
    }
  },
  methods: {
    // 获取用户常用功能列表
    loadData() {
      this.routesList = this.$router.options.routes;
      this.bulidRoutesMap(this.routesList);
      this.$client.GetUserCommonMenuSysMenu({user_id: this.user_id})
        .then(res => {
          if (res.head.result == "200") {
            let info = res.context;
            let arr = []
            info.forEach(item => {
              // console.log(item, this.menuListMap[item.menu_code]);
              if(this.menuListMap[item.menu_code]) {
                let obj = {}
                let title = this.menuListMap[item.menu_code].meta.title
                obj.code = item.menu_code,
                obj.menu_icon = item.menu_icon,
                obj.title = title,
                obj.name = this.link_title.indexOf(title) > -1 ? this.menuListMap[item.menu_code].path : this.menuListMap[item.menu_code].name
                arr.push(obj)
              }
            })
            this.data = arr
            this.$refs.allMenuDialog.userData = [...this.data]
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
        })
    },
    // 加载全部路由
    bulidRoutesMap(list) {
      list.forEach(item => {
        if(!!item.meta && !!item.meta.code) {
          this.menuListMap[item.meta.code] = {
            path: item.path,
            name: item.name,
            meta: item.meta,
            component: item.component,
            code: item.meta.code,
            hidden: item.hidden || false
          }
          if(item.alwaysShow) {
            this.menuListMap[item.meta.code].alwaysShow = item.alwaysShow
          }
          if(!!item.children && item.children.length > 0) {
            this.bulidRoutesMap(item.children)
          }
        }
      });
    },
    openMenu(item) {
      if(this.link_title.indexOf(item.title) === -1) {
        this.$router.push({
          name: item.name,
          params:{}
        })
      }else {
        window.open(item.name)
      }
    },
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.menu-box {
  .clearfix {
    display: flex;
    align-items: center;
    .el-image {
      flex-shrink: 0;
      margin-right: 10px * $NumWidth;
    }
  }
  /deep/ .el-card__header{
    padding: 12px 20px * $NumWidth;
  }
  /deep/ .el-card__body{
    padding: 12px 20px * $NumWidth;
  }
  .el-row{
    height: 144px;
    overflow-y: auto;
    .el-col {
    display: flex;
    // justify-content: center;
    align-items: center;
    padding: 10px;
    margin: 5px 0;
    &:hover{
      cursor:pointer;
      background: #F2F6FC;
      border-radius: 3px;
    }
    .el-image {
      height: 42px;
      width: 42px;
      flex-shrink: 0;
      margin-right: 10px;
      border-radius: 3px;
      box-shadow: 0 2px 2px rgba(0, 0, 0, .075);
    }
    .title {
      font-weight: 400;
      font-size: 13px;
      color: #333333;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  }
  ::-webkit-scrollbar {
    display: none;
  }
  
}
</style>