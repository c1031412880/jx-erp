<template>
  <el-menu
    class="navbar"
    :default-active="defaultActive"
    background-color="#242729"
    text-color="#e6e4e1"
    active-text-color="red"
    mode="horizontal"
    @select="menuSelect"
  >
    <logo class="top-logo" :collapse="false"></logo>
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
    />
    <show-drawer @click="$emit('show-drawer')" class="hamburger-container" />
    <div class="router-bar">
      <menu-item-scroll ref="scrollPane" class="menu-item-warpper">
        <el-menu-item
          class="menu-item"
          ref="tag"
          v-for="(solid, i) in routerList"
          :key="i"
          :index="solid.path"
        >
          <span slot="title">{{ solid.name }}</span>
        </el-menu-item>
      </menu-item-scroll>
    </div>
    <!--    <breadcrumb />-->
    <div class="right-menu show-flex-box-r show-flex-center">
      <el-badge
        :value="onLines"
        class="item show-flex-box-r show-flex-center"
        style="margin-right: 20px"
      >
        <div
          class="on-line show-flex-box-r show-flex-center"
          style="cursor: pointer; height: 50px; line-height: 50px"
          @click="openToPath('/online-number')"
        >
          <el-tooltip class="item" effect="light" content="在线人数" placement="top">
            <i class="el-icon-s-custom" alt="" style="color: #e6e4e1; font-size: 20px"></i>
            <!-- <span style="color: #e6e4e1; font-size: 14px; font-weight: 400">在线人数</span> -->
          </el-tooltip>
        </div>
      </el-badge>
      <!-- <div
        class="show-flex-box-r show-flex-center"
        style="margin-right: 10px; height: 35px; line-height: 35px"
      >
        <div class="show-flex-box-r news-icon" @click="openToPath('/download-center')">
          <el-tooltip class="item" effect="light" content="下载中心" placement="top">
            <img src="@/assets/home-image/nav-1.png" alt="" />
          </el-tooltip>
        </div>
      </div> -->
      <el-badge
        :value="newCount + lookMsg"
        :hidden="!(newCount + lookMsg)"
        style="margin: 0 20px 0 7px; height: 50px; line-height: 50px"
        class="item show-flex-box-r show-flex-center"
      >
        <!-- <router-link :to="{path: '/news-core'}" class="news-icon"><i class="el-icon-bell"></i></router-link> -->
        <div class="show-flex-box-r news-icon" @click="openToPath('/news-core')">
          <el-tooltip class="item" effect="light" content="通知消息" placement="top">
            <img src="@/assets/home-image/nav-2.png" alt="" />
          </el-tooltip>
        </div>
      </el-badge>
      <el-badge
        :value="todoCount"
        :hidden="!todoCount"
        style="margin: 0 20px 0 7px; height: 50px; line-height: 50px"
        class="item show-flex-box-r show-flex-center"
      >
        <div class="show-flex-box-r news-icon" @click="goTodo">
          <el-tooltip class="item" effect="light" content="待办事项" placement="top">
            <img src="@/assets/home-image/nav-3.png" alt="" />
          </el-tooltip>
        </div>
      </el-badge>
      <!-- <div style="margin-right: 10px;height: 35px;line-height: 35px;margin-top: 7px;">
        <router-link :to="{path: '/import-export'}" class="news-icon"><i class="el-icon-s-promotion" style="color:#409EFF"></i></router-link>
      </div> -->
      <!-- <div
        class="show-flex-box-r show-flex-center"
        style="margin-right: 10px; height: 35px; line-height: 35px"
        @click="openToPath('/import-export')"
      >
        <div class="show-flex-box-r news-icon">
          <el-tooltip class="item" effect="light" content="导入记录" placement="top">
            <img src="@/assets/home-image/nav-3.png" alt="" />
          </el-tooltip>
        </div>
      </div> -->
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar" class="user-avatar" /> -->
          <p class="user-name">{{ getTime() }}{{ userName() }}</p>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link class="inlineBlock" to="/">
            <el-dropdown-item>主页</el-dropdown-item>
          </router-link>
          <router-link class="inlineBlock" to="/change-password">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </router-link>
          <div @click="openRationalizationSuggestions()">
            <el-dropdown-item>
              <span>合理化建议</span>
            </el-dropdown-item>
          </div>
          <el-dropdown-item divided v-if="!isShow">
            <span style="display: block" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div>
      <!-- 系统公告 -->
      <system-announcement-popup
        ref="systemAnnouncementPopup"
        :dialogBool.sync="systemAnnouncementPopupShow"
      ></system-announcement-popup>
      <!-- 合理化建议 -->
      <!-- <rationalization-suggestions-popup
        ref="rationalizationSuggestionsPopup"
        :dialogBool.sync="isShowRationalizationSuggestions"
        @subimit-suggestions="subimitSuggestions"
      ></rationalization-suggestions-popup> -->
      <fixed-form-body
        ref="fixedFormBody"
        :formId="6700"
        :formName="'合理化意见反馈表'"
        :isAgain="false"
        :isCommit="false"
        :dialogBool.sync="isShowRationalizationSuggestions"
      ></fixed-form-body>
      <!-- 工作通知 -->
      <work-notice ref="workNotice" :dialogBool.sync="workNoticeShow"></work-notice>
      <!-- 公司公告 -->
      <info-dialog ref="infoDialog" :dialogBool.sync="infoDialogShow"></info-dialog>

      <new-dialog
        ref="newInfoDialog"
        :isAudit="false"
        :dialogBool.sync="isShowNewDialog"
      ></new-dialog>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo.vue'
import ScreenFull from '@/components/Screenfull'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger/new-fold'
import showDrawer from '@/components/Hamburger/show-drawer'
import menuItemScroll from './menu-item-scroll'
import { getUser, getSession } from '@/utils/auth'
import systemAnnouncementPopup from '@/view/system-user/system-announcement-managemnet/component/system-announcement/system-announcement-popup'
import workNotice from '@/view/system-user/system-announcement-managemnet/component/work-notice/system-announcement-popup'
import rationalizationSuggestionsPopup from '@/view/system-user/rationalization-suggestions/component/information-dialog'
import newDialog from '@/view/main-Interface-entrance/news-management/component/new-dialog'
import infoDialog from '@/view/system-user/system-announcement-managemnet/component/company-announcement/info-dialog'
import modelObj from '@/view/main-Interface-entrance/news-core/modelObj'
import fixedFormBody from '@/view/main-Interface-entrance/launch-affair/component/all-box/fixed-form-body'
// import p1 from "@/assets/home-image/header-1.png";
// import p2 from "@/assets/home-image/header-2.png";
import mp3 from '@/assets/mp3/notice.wav'

export default {
  inject: ['reload'],
  components: {
    Breadcrumb,
    Hamburger,
    showDrawer,
    ScreenFull,
    systemAnnouncementPopup,
    rationalizationSuggestionsPopup,
    workNotice,
    newDialog,
    infoDialog,
    Logo,
    menuItemScroll,
    fixedFormBody
  },
  data() {
    return {
      isUnNum: 0,
      lookMsg: 0,
      onLines: 0,
      isOpen: true,
      routerList: [
        {
          path: '/dashboard',
          name: '首页'
        }
      ],
      menuRoutes: [],
      typeObj: {
        1: '待办消息',
        2: '到期消息',
        3: '系统消息',
        5: '导入导出提醒'
      },
      routerModelMap: {
        42: {
          router: 'vehicle-yearly-inspection',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        43: {
          router: 'passenger-server-management',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        46: {
          router: 'goods-information-management',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        2001: {
          router: 'repairs-management',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        2010: {
          router: 'workorder-management',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        2030: {
          router: 'material-query',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        2040: {
          router: 'material-query',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        2020: {
          router: 'completion-management',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        3000: {
          router: 'contract-management',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        3001: {
          router: 'contract-management',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        3002: {
          router: 'expiration-reminder',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        3010: {
          router: 'contract-management',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        3030: {
          router: 'schedule-todo',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        6040: {
          router: 'passenger-server-management',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        5221: {
          router: 'check-management',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        5222: {
          router: 'assessment-score',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        5223: {
          router: 'my-assessment',
          model: 'ids',
          isPopup: false //是否为弹窗
        },
        10000: {
          router: 'router',
          model: 'ids',
          isPopup: true //是否为弹窗
        },
        10001: {
          router: 'router',
          model: 'ids',
          isPopup: true //是否为弹窗
        },
        10002: {
          router: 'router',
          model: 'ids',
          isPopup: true //是否为弹窗
        },
        10005: {
          router: 'router',
          model: 'ids',
          isPopup: true //是否为弹窗
        },
        10006: {
          router: 'router',
          model: 'ids',
          isPopup: true //是否为弹窗
        },
        10009: {
          router: 'news-management',
          model: 'id',
          isPopup: false //是否为弹窗
        },
        10100: {
          router: 'import-export',
          model: 'id',
          isPopup: false //是否为弹窗
        }
      },
      messageList: [],
      systemAnnouncementPopupShow: false,
      isShowRationalizationSuggestions: false,
      workNoticeShow: false,
      infoDialogShow: false,
      isShow: false, // token 免登不能主动退出
      isShowNewDialog: false
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'todoCount', 'newCount']),
    defaultActive() {
      const list = this.filterMenuRoutes(this.menuRoutes, x => this.$route.path.includes(x.path))
      this.moveToCurrentTag()
      if (list.length) {
        const target = list[0]
        const selectArr = ['/launch-affair']
        if (
          target.children &&
          target.children.length &&
          selectArr.includes(target.children[0].path)
        ) {
          return target.children[0].path
        }
        return target.path
      } else {
        const item = this.routerList.find(x => this.$route.path.includes(x.path))
        return item ? item.path : this.$route.path
      }
    }
  },
  watch: {
    systemAnnouncementPopupShow() {
      if (!this.systemAnnouncementPopupShow) {
        location.reload() // 为了重新实例化vue-router对象 强制刷新页面
      }
    }
  },
  created() {
    this.isShow = JSON.parse(localStorage.getItem('FreeLogin'))
  },
  mounted() {
    this.$nextTick(() => {
      if (!window.SignalDom.outConnId()) {
        console.log(getSession(), '1235')
        window.SignalDom.init(getSession())
        window.SignalDom.start()
        window.SignalDom.on('ConnectSuc', data => {
          console.log('连接ID', data)
        })
      }
      window.SignalDom.on('IsUnReadMessage', req => {
        console.log('角标推送：未读消息', req)
        // this.isUnNum = req.msg
        this.$store.dispatch('SetNewCount', req.msg)
      })
      window.SignalDom.on('OnUserCount', req => {
        console.log('角标推送：在线人数', req)
        this.onLines = req.msg
        // window.eventOn.$emit('load-onLine-tree')
      })
      window.SignalDom.on('SendUnReadMessage', req => {
        console.log('通知推送：弹窗消息', req)
        this.lookMsg = this.lookMsg + 1

        this.messageList = [req.msg, ...this.messageList]
        if (this.messageList.length) {
          this.voiceBroadcast()
        }
        this.outOpen()
      })
      // window.SignalDom.on('UpdateToken', req => {
      //   console.log('更新token', req)
      //   this.updateToken(req.msg)
      //   // alert(JSON.stringify(req))
      // })
      this.loadOnLine()
      this.loadMessageRead()
      this.loadMessageWarn()
    })
  },
  methods: {
    getTime() {
      let now = new Date()
      let hour = now.getHours()
      let time = '您好!'
      if (hour < 6) {
        time = '凌晨好！'
      } else if (hour < 9) {
        time = '早上好！'
      } else if (hour < 12) {
        time = '上午好！'
      } else if (hour < 14) {
        time = '中午好！'
      } else if (hour < 17) {
        time = '下午好！'
      } else if (hour < 19) {
        time = '傍晚好！'
      } else if (hour < 22) {
        time = '晚上好！'
      } else {
        time = '夜里好！'
      }
      return time
    },
    // 打开路由跳转
    openToPath(path) {
      this.$router.push({
        path: path
      })
    },
    outOpen() {
      if (!this.isOpen) {
        if (this.messageList.length > 10) {
          this.messageList = this.messageList.slice(this.messageList.length - 5)
          this.lookMsg = 5
        }
        return false
      }
      if (this.lookMsg && this.messageList.length) {
        this.isOpen = false
        setTimeout(() => {
          this.openNotification(this.messageList[this.messageList.length - 1])
          this.messageList.splice(this.messageList.length - 1, 1)
          this.lookMsg--
          this.isOpen = true
          this.outOpen()
        }, 2000)
      }
    },
    // 获取未读
    loadMessageRead() {
      this.$client
        .ListMessageCenter({
          state: 1
        })
        .then(req => {
          if (req.head.result === '200') {
            // this.isUnNum = req.context.total
            this.$store.dispatch('SetNewCount',  req.context.total)
          }
        })
    },
    // 获取未提醒
    loadMessageWarn() {
      this.$client
        .ListMessageCenter({
          warn: 1
        })
        .then(req => {
          if (req.head.result === '200') {
            this.messageList = [...req.context.list, ...this.messageList]
            this.lookMsg = this.lookMsg + req.context.total
            if (this.messageList.length) {
              this.voiceBroadcast()
            }
            this.outOpen()
          }
        })
    },
    voiceBroadcast() {
      var voiceContent = new Audio(mp3)
      voiceContent.volume = 0.1
      voiceContent.src = mp3
      voiceContent.play()
    },
    openNotification(item) {
      console.log('发通知', item, item.title)
      // content: null
      // created_date: "2022-04-12T16:38:20.8732546+08:00"
      // created_id: 2000033
      // ex_state: "未读"
      // ex_type: null
      // id: 1233572
      // model: 100
      // object_id: "1233571"
      // send_id: 2001881
      // state: 1
      // title: "您有一条新的车辆报修记录 车牌号为浙CC7690,报修类型为大修"
      // type: 3
      // update_date: null
      // warn: null
      if (
        item.type === 3 &&
        (item.model === 10000 || item.model === 10001 || item.model === 10002)
      ) {
        // 查询消息通知是否为强制弹窗
        this.reqLatestSysVersion(item.object_id, true)
      }
      // 工作通知
      if (item.type === 3 && item.model === 10005) {
        // 查询消息通知是否为强制弹窗
        this.GetByIdWorkMessage(item.object_id, true)
      }
      const h = this.$createElement
      let title = `${this.typeObj[item.type]}:${modelObj[item.model]}`
      let notift = this.$notify({
        title: this.typeObj[item.type] || '通知',
        duration: 15000,
        message: h('a', {
          style: {
            color: '#409EFF'
          },
          on: {
            click: () => {
              notift.close()
              this.$client.ReadMessageMessageCenter({ context: [item.id] }).then(() => {
                this.loadMessageRead()
              })
              // 如果有其他跳转就走配置路径
              if (this.routerModelMap[item.model]) {
                // 跳转路由
                if (!this.routerModelMap[item.model].isPopup) {
                  let params = {}
                  // 如果是当前页的跳转消息通知   用强制刷新
                  params[this.routerModelMap[item.model].model] = item.object_id
                  if (this.$route.name == this.routerModelMap[item.model].router) {
                    // 添加一个唯一字段 来确保监听成立
                    params.uuid = new Date().getTime()
                    this.$router.replace(
                      {
                        name: this.routerModelMap[item.model].router,
                        query: params
                      },
                      () => {
                        this.reload() //刷新页面
                      }
                    )
                  } else {
                    this.$router.push({
                      name: this.routerModelMap[item.model].router,
                      params: params
                    })
                  }
                } else {
                  // 打开弹窗类型消息
                  switch (item.model) {
                    case 10000: //系统公告
                    case 10001: //系统公告
                    case 10002: //系统公告
                      this.reqLatestSysVersion(item.object_id, false)
                      break
                    case 10005: //工作通知
                      this.GetByIdWorkMessage(item.object_id, false)
                      break
                    case 10006: //公司公告
                      this.GetByIdCompanyMessage(item.object_id)
                      break
                      break
                    default:
                      break
                  }
                }
              } else {
                let object_id = ''
                switch (item.model) {
                  // '^&' 多条记录id查询的标示符号
                  case 110:
                    object_id = item.object_id + '^&'
                    break

                  default:
                    object_id = item.object_id
                    break
                }
                this.$router.push({
                  path: `/news-details/${object_id}/${title}/${item.model}`
                })
              }
            }
          },
          domProps: {
            innerHTML: item.title
          }
        })
      })
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    userName() {
      if (getUser()) {
        return JSON.parse(getUser()).user_name
      }
      return ''
    },
    // 查询公告是否为强制弹窗
    reqLatestSysVersion(id, isPopover) {
      this.$client
        .GetDetailSysVersion({ id: id })
        .then(res => {
          if (res.head.result == '200') {
            if (!!res.context) {
              let info = res.context
              // 自动强制弹窗
              if (info.is_popover === 1 && isPopover) {
                this.$client.ReadMessageMessageCenter({ context: [info.id] }).then(() => {
                  this.loadMessageRead()
                })
                this.markedRead(info)
              }
              // 点击通知消息进入
              if ((info.is_popover === 1 || info.is_popover === 2) && !isPopover) {
                this.markedRead(info)
              }
            }
          } else {
            this.loading = false
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'error'
            })
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: 'error'
          })
        })
    },
    // 公告标记为已读
    markedRead(info) {
      let params = {
        context: [info.id]
      }
      this.$client.AddSignSysVersion(params).then(res => {
        if (res.head.result == '200') {
          this.$refs.systemAnnouncementPopup.setData(info)
          this.systemAnnouncementPopupShow = true
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    // 查询工作通知详情
    GetByIdWorkMessage(id, isPopover) {
      this.$client
        .GetByIdWorkMessage({ context: id })
        .then(res => {
          if (res.head.result == '200') {
            if (!!res.context) {
              let info = res.context
              // 自动强制弹窗
              if (info.message_box === 1 && isPopover) {
                this.$client.ReadMessageMessageCenter({ context: [info.id] }).then(() => {
                  this.loadMessageRead()
                })
                this.AddSignWorkMessage(info)
              }
              // 点击通知消息进入
              if ((info.message_box === 1 || info.message_box === 0) && !isPopover) {
                this.AddSignWorkMessage(info)
              }
            }
          } else {
            this.loading = false
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'error'
            })
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: 'error'
          })
        })
    },
    // 工作通知为已读
    AddSignWorkMessage(info) {
      let params = {
        context: info.id
      }
      this.$client.AddSignWorkMessage(params).then(res => {
        if (res.head.result == '200') {
          this.$refs.workNotice.setData(info)
          this.workNoticeShow = true
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },

    // 查询公司公告详情
    GetByIdCompanyMessage(id) {
      this.$client
        .GetByIdCompanyMessage({ id })
        .then(res => {
          if (res.head.result == '200') {
            if (!!res.context) {
              let info = res.context
              this.AddSignCompanyMessage(info)
            }
          } else {
            this.loading = false
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'error'
            })
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: 'error'
          })
        })
    },
    // 公司公告为已读
    AddSignCompanyMessage(info) {
      let params = {
        context: [info.id]
      }
      this.$client.AddSignCompanyMessage(params).then(res => {
        if (res.head.result == '200') {
          this.$refs.infoDialog.setData(info)
          this.infoDialogShow = true
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    //  打开合理化建议弹窗
    openRationalizationSuggestions() {
      this.isShowRationalizationSuggestions = true
    },
    // 提交建议
    subimitSuggestions(form) {
      delete form.id
      this.$client.AddOrEditAdviceRecord({ context: form }).then(res => {
        if (res.head.result == '200') {
          this.isShowRationalizationSuggestions = false
          this.$message({
            showClose: true,
            message: '感谢您留下宝贵的建议，我们会努力做的更好！',
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    // 更新用户token
    updateToken(code) {
      this.$store
        .dispatch('updateToken', code)
        .then(req => {})
        .catch(err => {
          this.$message({ type: 'error', message: err })
        })
    },
    // 获取在线用户人数
    loadOnLine() {
      this.$client.GetListOnLineUser({ state: 1 }).then(res => {
        if (res.head.result == '200') {
          this.onLines = res.context.list.length
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    // 查询新闻详情
    // GetByIdNewsMessage(id) {
    //   this.$client.GetErpNewManage({id}).then(res => {
    //     if (res.head.result == "200") {
    //       if(!!res.context.list) {
    //         let info = res.context.list
    //         this.AddReadNewsMessage(info);
    //       }
    //     } else {
    //       this.loading = false;
    //       this.$message({
    //         showClose: true,
    //         message: res.head.describle,
    //         type: "error",
    //       });
    //     }
    //   }).catch(err => {
    //     this.$message({
    //       showClose: true,
    //       message: err.body.message,
    //       type: "error",
    //     });
    //   })
    // },
    AddReadNewsMessage() {},
    menuSelect(index) {
      this.$emit('menuSelect', index)
    },
    filterMenuRoutes(data, predicate) {
      return data
        .map(node => {
          const newNode = { ...node }
          if (node.children) {
            newNode.children = this.filterMenuRoutes(node.children, predicate)
          }
          const isMatchingLeaf = !node.children && predicate(node)
          const hasMatchingDescendants = newNode.children && newNode.children.length
          return isMatchingLeaf || hasMatchingDescendants ? newNode : null
        })
        .filter(x => x)
    },
    moveToCurrentTag() {
      this.$nextTick(() => {
        const tags = this.$refs.tag
        for (const tag of tags) {
          if (tag.index === this.defaultActive) {
            this.$refs.scrollPane.moveToTarget(tag)
            break
          }
        }
      })
    },
    goTodo() {
      this.$router.push({
        name: 'launch-affair',
        params: {
          activeName: '待处理'
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  flex: 1;
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  overflow: hidden;
  //background: linear-gradient(90deg,#1d1e23,#3f4045);
  background: #f6f6f6;
  display: flex;
  .router-bar {
    display: flex;
    line-height: initial;
    flex: 1;
    min-width: 70px;
    .menu-item-warpper {
      width: 100%;
      .menu-item {
        line-height: 50px;
        height: 50px;
        font-size: 14px;
        /deep/ span {
          font-family: 黑体;
        }
        //border-bottom: 3px solid #f6ca9d;
        border-bottom: 3px solid #c61d29;
        display: inline-block;
      }
      .menu-item:hover {
        //background: rgba(246,202,157,.1) !important;
        // background: #fef6f7 !important;
        background: #c61d29 !important;
        color: #e6e4e1 !important;
      }
    }
  }
  .hamburger-container {
    line-height: 55px;
    height: 50px;
    width: 50px;
    float: left;
  }
  .top-logo {
    width: 220px;
    height: 50px;
    float: left;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    height: 100%;
    clear: right;
    display: flex;
    margin-left: 10px;
    &:focus {
      outline: none;
    }
    .on-line {
      &:hover {
        cursor: pointer;
        transform: scale(1.1);
      }
    }
    .news-icon {
      // font-size: 25px;
      color: #e6e4e1;
      // line-height: 35px;
      width: 15px;
      height: 15px;
      flex-shrink: 0;
      &:hover {
        cursor: pointer;
        transform: scale(1.2);
      }
      img {
        flex-shrink: 0;
        height: 100%;
        // width: 100%;
        object-fit: cover;
      }
    }
    .el-icon-s-tools {
      cursor: pointer;
      // color: #5a5e66;
      color: #e6e4e1;
      font-size: 20px;
    }
    .right-menu-item {
      margin: 0 8px;
    }
    .screenfull {
      height: 100%;
      line-height: 54px;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      // margin-left: 15px;
      margin-right: 25px;
      .avatar-wrapper {
        margin-top: 7px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 35px;
          height: 35px;
          border-radius: 20px;
        }
        .user-name {
          //color: #f6ca9d;
          // color: #333;
          color: #e6e4e1;
          margin-left: 8px;
          float: right;
          line-height: 40px;
          font-size: 15px;
        }
        .user-name:hover {
          cursor: pointer;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.navbar /deep/ .el-badge__content.is-fixed {
  top: 10px;
}
.el-notification {
  top: 85px !important;
}
</style>
