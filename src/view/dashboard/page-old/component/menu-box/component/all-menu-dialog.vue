<template>
  <el-dialog :visible="dialogBool" :before-close="dialogClose"  :append-to-body="appendToBody" :fullscreen="true">
    <div class="div-dialog">
      <div class="dialog-content">
        <div class="dialog-title">
          <span :span="24">常用功能</span>
          <el-button @click="editUserMenu" size="mini" type="text" style="margin-left: 15px">编辑</el-button>
          <el-button @click="saveMenuData" v-show="isShowDel" size="mini" type="text">保存</el-button>
          <el-button @click="cancelDelMenu" v-show="isShowDel" size="mini" type="text">取消</el-button>
        </div>
        <el-row :gutter="20">
          <el-col class="dialog-menu" :span="2" v-for="(item, index) in userData" :key="item.code">
            <div class="dialog-img">
              <div v-show="isShowDel">
                <el-image 
                  class="del-font" 
                  @click="delUserMenu(index)"
                  :src="require('@/assets/approverStepIcon/liuchen5.png')">
                </el-image>
              </div>
              <safe-image :imgUrl="item.menu_icon ? item.menu_icon : require('@/assets/home-image/modular-9.png')" :authToken="token"></safe-image>
              <!-- <el-image :src="item.menu_icon ? item.menu_icon : require('@/assets/home-image/modular-9.png')"></el-image> -->
            </div>
            <p class="dialog-name">{{item.title}}</p>
          </el-col>
        </el-row>
      </div>
      <el-divider></el-divider>
      <div class="dialog-bottom" :style="{'height': contentHeight + 'px'}" v-loading="loading">
        <div class="dialog-content" v-for="(item, index) in allData" :key="item.name + item.title">
          <div class="dialog-title">
            <span :span="24">{{item.title}}</span>
          </div>
          <el-row :gutter="20">
            <el-col 
            class="dialog-menu dialog-menu-bottom" 
            :span="2" 
            v-for="(el, sing) in item.children" 
            :key="sing" 
            @click.native="openMenuOrAddUserMenu(el, sing)"
            :style="{'background': el.color}">
              <div class="dialog-img">
                <safe-image v-if="el.menu_icon"  :imgUrl="el.menu_icon" :authToken="token"></safe-image>
                <!-- <el-image v-if="el.menu_icon" :src="el.menu_icon"></el-image> -->
                <el-image v-else :src="require('@/assets/home-image/modular-8.png')"></el-image>
              </div>
              <p class="dialog-name">{{el.title}}</p>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { getUser, getSession } from '@/utils/auth';
import safeImage from "@/components/image-box/component/safe-image"
export default {
  components: {
    safeImage,
  },
  props: {
    dialogBool: Boolean,
    appendToBody:{
      type: Boolean,
      default: false
    },
    userId:{
      type: Number,
      default: 0
    },
    menuListMap:{
      type: Object,
      default: () => {}
    },
  },
  mounted() {
    this.token = getSession()
    // this.loadData()
  },
  data() {
    return {
      contentHeight: 400,
      userData: [],
      allData: [],
      newRoutes:[],
      isShowDel: false,
      loading: false,
      token: '',
      link_title: [
        '驾驶员安全学习','服务质量监控大屏','平阳客流展示大屏','电子站牌管理','导乘屏管理'
      ]
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else {
        this.$nextTick(() => {
          this.setHead()
          this.userData = [...this.$parent.$parent.data]
        })
        this.loadDataCenter()
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 获取所有功能列表    中台菜单接口
    loadDataCenter() {
      let params = {
        tenant_id: window.newHttpConfig.TenantId,
        id: JSON.parse(getUser()).user_id,
        app_key: 'erp-web'
      }
      this.loading = true
      this.$client.getMunePermission(params)
        .then(res => {
          this.loading = false
          if (res.errcode === 200) {
            let menuList = res.data[0].trees
            this.newRoutes = []
            this.buildRoutes(menuList, this.addRouter)
            console.log('=======',JSON.parse(JSON.stringify(this.newRoutes)));
            this.getAllMenuData()
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }

        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // // 获取所有功能列表
    // loadData() {
    //   let params = {
    //     enable: 1 // 已启用菜单
    //   };
    //   this.loading = true
    //   this.$client.getMenuRecordsSysMenu(params)
    //     .then(res => {
    //       this.loading = false
    //       if (res.head.result == "200") {
    //         let menuList = res.context;
    //         this.newRoutes = []
    //         this.buildRoutes(menuList, this.addRouter)
    //         this.getAllMenuData()
    //         // console.log('回显数据', this.allData);
    //         // console.log('后台获取', menuList)
    //         // console.log('前端初始化', this.newRoutes)
    //         // console.log('路由map', this.menuListMap) 
    //       } else {
    //         this.$message({
    //           showClose: true,
    //           message: res.head.describle,
    //           type: "error",
    //         });
    //       }
    //     }).catch(err => {
    //       console.log(err);
    //        this.$message({
    //         showClose: true,
    //         message: err.body.message,
    //         type: "error",
    //       });
    //     })
    // },
    // 判断是否存在路由code
    isHasRouterCode(code) {
      return this.menuListMap.hasOwnProperty(code)
    },
    // 构建显示菜单路由
    buildRoutes(list, callback) {
      list.forEach((item,index) => {
        if(!!item.code && this.isHasRouterCode(item.code)) {
          let routeObj = {};
          routeObj = this.menuListMap[item.code]
          // 更换第一级菜单名字 图标 等操作
          if(!!routeObj.meta) {
            routeObj.meta.title = item.name;
          }
          // if(!!item.funcs && item.funcs.length > 0) {
          //   routeObj.funcs = item.funcs
          // }
          this.newRoutes.push(routeObj)
          typeof(callback) === 'function' && callback(item,routeObj);
        }

      });
    },
    // 构建显示菜单路由回调函数
    addRouter(item,routeObj) {
      if(item.type == 1 && !!item.child && item.child.length > 0) {
        // console.log(item,routeObj)
        routeObj.children = [];
        item.child.forEach(obj => {
          if(!!obj.code && this.isHasRouterCode(obj.code)) {
            let secondRouteObj = this.menuListMap[obj.code]
            // 更换第一级下面所有字菜单名字 图标 等操作
            if(!!secondRouteObj.meta) {
              secondRouteObj.meta.title = obj.name;
            }
            // if(!!obj.funcs && obj.funcs.length > 0) {
            //   secondRouteObj.funcs = obj.funcs
            // }

            if (!!obj.path) {
              secondRouteObj.path = obj.path;
            }
            if (obj.menu_icon) {
              secondRouteObj.menu_icon = obj.menu_icon
            }
            routeObj.children.push(this.menuListMap[obj.code])
            this.addRouter(obj, secondRouteObj)
          }

        });
      }
    },
    // 构建回显列表
    getAllMenuData() {
      this.allData = []
      this.newRoutes.forEach(item => {
        if(!!item.children && item.children.length) {
          let obj = {
            code: item.code,
            title: item.meta.title,
            name: item.name,
            menu_icon: item.menu_icon,
            children: []
          }
          item.children.forEach(one => {
            if(!!one.children && one.children.length) {
              one.children.forEach(two => {
                let path_name = this.link_title.indexOf(two.meta.title) > -1 ? two.path : two.name
                let info = {
                  code: two.code,
                  title: two.meta.title,
                  name: path_name,
                  menu_icon: two.menu_icon,
                  color: ''
                }
                obj.children.push(info)
              })
            }else {
              let path_name = this.link_title.indexOf(one.meta.title) > -1 ? one.path : one.name
              let info = {
                code: one.code,
                title: one.meta.title,
                name: path_name,
                menu_icon: one.menu_icon,
                color: ''
              }
              obj.children.push(info)
            }
          })
          this.allData.push(obj)
        }
      })
    },
    // 编辑常用功能
    editUserMenu() {
      this.isShowDel = true
      // this.allData.forEach(item => {
      //   // console.log(item);
      //   item.children.forEach(el => {
      //     let index = this.userData.indexOf(it => {
      //       el.code === it.code
      //     })
      //     if(index > -1) {
      //       el.color = '#CCCCCC'
      //     }
      //   })
      // })
    },
    // 删除常用功能
    delUserMenu(index) {
      this.userData.splice(index, 1)
    },
    // 取消
    cancelDelMenu() {
      this.userData = [...this.$parent.$parent.data]
      this.isShowDel = false
    },
    // 点击列表
    openMenuOrAddUserMenu(item) {
      if(this.isShowDel) {
        if(this.userData.length > 9) {
          this.$message.error('最多添加10个常用功能')
          return
        }
        let index = this.userData.find(it => {
          return it.code === item.code
        })
        if(!index) {
          this.userData.push(item)
        }
        // item.color = '#CCCCCC'
      }else {
        if(this.link_title.indexOf(item.title) === -1) {
          this.$router.push({
            name: item.name,
            params:{}
          })
        }else {
          window.open(item.name)
        }
      }
    },
    // 保存
    saveMenuData() {
      let params = {
        context: {}
      }
      params.context.user_id = this.userId
      params.context.menu_codes = this.userData.map(item => {
        return {
          menu_code: item.code,
          menu_icon: item.menu_icon
        }
      })
        console.log('-------',params);
      this.$client.BatchAddUserMenuSysMenu(params)
        .then(res => {
          if(res.head.result == '200') {
            this.$emit('on-update')
            this.cancelDelMenu()
            this.$message({type: 'success', message: res.head.describle})
          }else{
            this.$message({type: 'error', message: res.head.describle})
          }
        }).catch(err => {
          console.log(err);
          this.$message({type: 'error', message: '服务错误'})
        })
    },
    // 计算高度
    setHead() {
      let hit = this.$el.offsetHeight;
      this.contentHeight = hit - 270
      console.log(hit, this.contentHeight);
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.dialog-content {
  .dialog-title {
    margin: 34px 0 7px 0;
    span {
      font-size: 20px;
      font-weight: bold;
      color: #333333;
    }
  }
  .dialog-menu {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 8px 0 11px 0;
    padding: 8px 0 0 0;
    border-radius: 3px;
  }
  .dialog-menu-bottom {
    &:hover{
      cursor:pointer;
      background: #F2F6FC;
    }
  }
  .dialog-img {
    width: 46px;
    height: 46px;
    position: relative;
    display: grid;
    border-radius: 3px;
    box-shadow: 0 2px 2px rgba(0, 0, 0, .075);
    .del-font {
      cursor:pointer;
      position: absolute;
      width: 16px;
      height: 16px;
      right: -8px;
      top: -8px;
      z-index: 999;
    }
  }
  .dialog-name {
    // width: 100%;
    line-height: 12px;
    font-size: 12px;
    margin: 12px 0 8px 0;
    white-space:nowrap;/* 规定文本是否折行 */
    overflow: hidden;/* 规定超出内容宽度的元素隐藏 */
    text-overflow: ellipsis;
  }
}
.dialog-bottom {
  overflow: scroll;
}

::-webkit-scrollbar {
  display: none;
}
</style>
