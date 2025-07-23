<template>
  <div class="work-list">
    <el-row class="content-top">
      <el-col 
        :span="8"
        @click.native="lookWorkRouter(item)"
        v-for="(item, index) in workData" 
        :key="index">
        <el-image :src="item.img"></el-image>
        <div class="item-title">{{item.title}}</div>
        <count-to :start-val="0" :end-val="index === 1 ? newCount : item.num" :duration="2600" class="card-panel-num"/>
      </el-col>
    </el-row>
    <el-row class="content-middle"> 
      <!-- <el-col :span="24">
        <el-image :src="require('@/assets/home-image/work-4.png')"></el-image>
        <span>工作待办</span>
      </el-col>
      <el-col class="remind-list" :span="24">
        <div class="remind-list-item" v-for="item in todoData" :key="item.title">
          <el-badge :value="item.value">
            <span class="item-title">{{ item.title }}</span>
          </el-badge>
        </div>
      </el-col> -->
      <el-col :span="24">
        <el-image :src="require('@/assets/home-image/work-5.png')"></el-image>
        <span>提前提醒</span>
      </el-col>
      <el-col class="remind-list" :span="24">
        <div class="remind-list-item" v-for="item in remindData" @click="lookRemindRouter(item)" :key="item.title">
          <el-badge :value="item.value">
            <span class="item-title">{{ item.title }}</span>
          </el-badge>
        </div>
      </el-col>
    </el-row>
    <el-row class="content-bottom">
      <el-col 
        :span="8"
        @click.native="lookWorkRouter(item)"
        v-for="(item) in fileData" 
        :key="item.title" >
        <el-image :src="item.img"></el-image>
        <div class="item-title">{{item.title}}</div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import countTo from 'vue-count-to'
export default {
  name: 'work-list',
  components: {countTo},
  data() {
    return {
      workData: [
        { title: '待办事项', num: 0, img: require('@/assets/home-image/work-1.png')},
        { title: '消息提醒', num: 0, img: require('@/assets/home-image/work-2.png')},
        { title: '包车通知', num: 0, img: require('@/assets/home-image/work-6.png')},
      ],
      fileData: [
        { title: '共享文件', img: require('@/assets/home-image/work-7.png')},
        { title: '联系人', img: require('@/assets/home-image/work-8.png')},
        { title: '日程待办', img: require('@/assets/home-image/work-3.png')},
        // { title: '公司规则', img: require('@/assets/home-image/work-9.png')},
      ],
      todoData: [],
      remindData: [ 
        {title: '员工生日', value: 0},
        {title: '员工合同', value: 0},
        {title: '退休提醒', value: 0},
        {title: '员工离职', value: 0},
        {title: '企业合同', value: 0},
        // {title: '员工生发', value: 0},
        // {title: '员工你同', value: 0},
        // {title: '退是提醒', value: 0},
        // {title: '员工离你', value: 0},
        // {title: '啊业合同', value: 0},
        // {title: '员工我发', value: 0},
        // {title: '员工额同', value: 0},
      ],
      isUnNum: 0,
      lookMsg: 0,
    };
  },
  computed: {
    newCount() {
      return this.$store.state.sidebarMain.newCount
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 监听待办事项数量
      window.SignalDom.on('AppWaitCount', res => {
        this.workData[0].num = res.msg
      })
      // 监听消息
      window.SignalDom.on('IsUnReadMessage', req => {
        this.workData[1].num = res.msg
      })
      this.getWaitCount()  // 待办事项
      // this.getMessageCount()  // 消息提醒
      // 日程待办
      // this.getWorkCount()  // 工作待办
      this.getRemindCount()  // 提前提醒
      this.getChartCount()  // 包车通知
      console.log('work-list mounted', this.$store.state.sidebarMain.newCount);
      
    });
  },
  methods: {
    // 查看全部
    lookWorkRouter(val) {
      if(val.title === '工作待办' || val.title === '提前提醒' || val.title === '公司规则') return false
      let name = 'Dashboard',params = {}
      switch (val.title) {
        case '待办事项':
          name = 'launch-affair',
          params = {activeName: '待处理'}
          break;
        case '消息提醒':
          name = 'news-core'
          params = {activeName: '未读'}
          break;
        case '日程待办':
          name = 'schedule-todo'
          break;
        case '包车通知':
          name = 'car-charter-filling'
          break;
        case '共享文件':
          name = 'download-center'
          break;
        case '联系人':
          name = 'address-book'
          break;
      
        default:
          break;
      }
      this.$router.push({
        name: name,
        params: params
      })
    },
    // 提前提醒跳转
    lookRemindRouter(val) {
      let str = val.title === '企业合同' ? 'expiration-reminder' : 'employee-care'
      this.$router.push({
        name:str,
        params:{
          name: val.title
        }
      })
    },
    // 获取待办事项数量
    getWaitCount() {
      try {
      this.$client.getWaitFlowRecord().then(res => {
          this.workData[0].num = res.context.total ? res.context.total : 0
        })
      } catch (error) {
        console.log(error)
      }
    },
    // 获取消息数量
    getMessageCount() {
      try {
        // 获取未读
        this.$client.ListMessageCenter({ state: 1})
          .then(req => {
            if (req.head.result === '200') {
              this.workData[1].num = req.context.total ? req.context.total : 0
            }
          })
      } catch (error) {
        console.log(error)
      }
    },
    // // 工作待办
    // getWorkCount() {
    //   try {
    //     this.$client.GetHomePageWaitDoErpUserCare().then(res => {
    //       if (res.head.result === '200') {
    //         this.workData[3].num = res.context ? res.context.length : 0
    //       }
    //     })
    //   } catch (error) {}
    // },
    // 提前提醒
    getRemindCount() {
      try {
        this.$client.GetHomePageRemindErpUserCare().then(res => {
          if (res.head.result === '200') {
            // let data = [
            //   {type: 1, title: '员工生日'},
            //   {type: 2, title: '员工合同'},
            //   {type: 3, title: '退休提醒'},
            //   {type: 4, title: '员工离职'},
            //   {type: 5, title: '企业合同'},

            //   {type: 1, title: '员工生日'},
            //   {type: 2, title: '员工合同'},
            //   {type: 3, title: '退休提醒'},
            //   {type: 4, title: '员工离职'},
            //   {type: 5, title: '企业合同'},

            //   {type: 1, title: '员工生日'},
            //   {type: 2, title: '员工合同'},
            //   {type: 3, title: '退休提醒'},
            //   {type: 4, title: '员工离职'},
            //   {type: 5, title: '企业合同'},

            //   {type: 1, title: '员工生日'},
            //   {type: 2, title: '员工合同'},
            //   {type: 3, title: '退休提醒'},
            //   {type: 4, title: '员工离职'},
            //   {type: 5, title: '企业合同'},

            //   {type: 1, title: '员工生日'},
            //   {type: 2, title: '员工合同'},
            //   {type: 3, title: '退休提醒'},
            //   {type: 4, title: '员工离职'},
            //   {type: 5, title: '企业合同'},

            //   {type: 1, title: '员工生日'},
            //   {type: 2, title: '员工合同'},
            //   {type: 3, title: '退休提醒'},
            //   {type: 4, title: '员工离职'},
            //   {type: 5, title: '企业合同'},

            //   {type: 1, title: '员工生日'},
            //   {type: 2, title: '员工合同'},
            //   {type: 3, title: '退休提醒'},
            //   {type: 4, title: '员工离职'},
            //   {type: 5, title: '企业合同'},

            //   {type: 1, title: '员工生日'},
            //   {type: 2, title: '员工合同'},
            //   {type: 3, title: '退休提醒'},
            //   {type: 4, title: '员工离职'},
            //   {type: 5, title: '企业合同'},

            //   {type: 1, title: '员工生日'},
            //   {type: 2, title: '员工合同'},
            //   {type: 3, title: '退休提醒'},
            //   {type: 4, title: '员工离职'},
            //   {type: 5, title: '企业合同'},

            //   {type: 1, title: '员工生日'},
            //   {type: 2, title: '员工合同'},
            //   {type: 3, title: '退休提醒'},
            //   {type: 4, title: '员工离职'},
            //   {type: 5, title: '企业合同'},

            // ]
            this.remindData = Object.assign({}, this.remindData)
            let arr = res.context ? res.context : []
            arr.forEach(item => {
              let num = Number(item.type)
              switch (num) {
                case 1:
                  this.remindData[0].value = item.count
                  break;
                case 2:
                  this.remindData[1].value = item.count
                  break;
                case 3:
                  this.remindData[2].value = item.count
                  break;
                case 4:
                  this.remindData[3].value = item.count
                  break;
                case 5:
                  this.remindData[4].value = item.count
                  break;
                default:
                  break;
              }
            })
          }
        })
      } catch (error) {}
    },
    // 包车通知
    getChartCount() {
      try {
        this.$client.GetHomePageReminderChariotManage().then(res => {
          if (res.head.result === '200') {
            const count = res.context ? res.context.length : 0
            this.$set(this.workData[2], 'num', count)
          }
        })
      } catch (error) {}
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.work-list {
  width: 100%;
  height: 100%;
  .content-top, .content-bottom {
    padding: 10px * $NumWidth;
    background: #A0BEFF;
    display: flex;
    justify-content: space-between;
    .el-col {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px * $NumWidth 0;
      z-index: 1;
      &:hover {
        cursor: pointer;
        background: #f2f6fc;
      }
      .item-title {
        font-size: 16px * $NumWidth;
        font-weight: 400;
        font-family: Source Han Sans CN, Source Han Sans CN;
        margin-right: 5px * $NumWidth;
        flex-shrink: 0;
      }
      .card-panel-num {
        font-family: DIN, DIN;
        font-weight: bold;
        font-size: 22px * $NumWidth;
        color: #333333;
      }
      .el-image {
        width: 32px * $NumWidth;
        height: 32px * $NumWidth;
        flex-shrink: 0;
        margin-right: 10px * $NumWidth;
      }
    }
  }
  .content-bottom {
    background: #F6F7FD ;
    .el-col:hover {
      background: #A0BEFF;
    }
  }
  .content-middle {
    height: 150px * $NumWidth;
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    margin: 10px * $NumWidth 0;
    padding: 10px * $NumWidth;
    background: #F6F7FD ;
    .el-col {
      font-size: 18px * $NumWidth;
      color: #333333;
      font-weight: bold;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .el-image {
        width: 32px * $NumWidth;
        height: 32px * $NumWidth;
        margin-right: 10px * $NumWidth;
        flex-shrink: 0;
      }
    }
    .remind-list {
      display: flex;
      padding: 10px * $NumWidth 15px * $NumWidth 10px * $NumWidth 10px * $NumWidth;
      .remind-list-item {
        padding: 10px * $NumWidth;
        margin-left: 10px * $NumWidth;
        &:hover {
          cursor: pointer;
          background: #A0BEFF;
        }
        .item-title {
          font-size: 14px * $NumWidth;
        }
        /deep/ .el-badge__content.is-fixed {
          top: -5px * $NumWidth;
          right: 5px * $NumWidth;
        }
      }
    }
  }
}
</style>