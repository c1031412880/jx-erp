<template>
  <el-card class="to-do-reminder">
    <div slot="header" class="clearfix">
      <div class="header-left">
        <el-image :src="require('@/assets/home-image/modular-13.png')"></el-image>
        <span style="color: #000; font-size: 15px; font-weight: 400; font-family: 黑体">
          工作事项
        </span>
      </div>
      <div class="header-right"
        v-show="activeName === 'companyContact' || 
        activeName === 'publicContact' || 
        activeName === 'sharedFile' || 
        activeName === 'charterNotice'">

        <el-button @click="lookRouter" type="text" style="padding: 5px 0">
          查看全部
          <i class="el-icon-arrow-right"></i>
          <i style="margin-left: -5px" class="el-icon-arrow-right"></i>
        </el-button>
      </div>
    </div>
    <div class="content-box">
      <el-tabs v-model="activeName" class="tab-box">
        <el-tab-pane
          v-for="(item, i) in listData"
          :key="i"
          :name="item.ref"
          :label="item.label"
          lazy
        >
          <span slot="label">
            <el-badge :value="item.value" :hidden="!item.value" :max="99" class="item">
              <span>{{ item.label }}</span>
            </el-badge>
          </span>
          <div class="content-tab">
            <shared-documents v-if="item.label === '共享文件'" :ref="item.ref" :boxName="item.label"></shared-documents>
            <list-box v-else :boxName="item.label" :ref="item.ref" :loadKey="item.loadKey"></list-box>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>

<script type="text/ecmascript-6">
  import listBox from "./component/list-box"
  import sharedDocuments from "./component/shared-documents"
export default {
  name: 'to-do-reminder',
  components: {
    listBox,
    sharedDocuments
  },
  data() {
    return {
      activeName: 'reminderToDo',
      listData: [
        {
          label: '提醒待办',
          ref: 'reminderToDo',
          loadKey: 'GetHomePageWaitDoErpUserCare',
          value: ''
        },
        {
          label: '提前提醒',
          ref: 'RemindInAdvance',
          loadKey: 'GetHomePageRemindErpUserCare',
          value: ''
        },
        {
          label: '包车通知',
          ref: 'charterNotice',
          loadKey: 'GetHomePageReminderChariotManage',
          value: ''
        },
        {
          label: '公司联系人',
          ref: 'companyContact',
          loadKey: 'GetCompanyCommunicateSysMenu',
          value: ''
        },
        {
          label: '公共联系人',
          ref: 'publicContact',
          loadKey: 'GetCommunicateBookSysMenu',
          value: ''
        },
        {
          label: '共享文件',
          ref: 'sharedFile',
        }
      ],
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.listData.forEach(item => {
        if(item.label === '提醒待办' || item.label === '提前提醒') {
          this.loadData(item.loadKey)
        }
      })
    })
  },
  methods: {
    loadData(loadKey) {
      let params = {
        menu_code: 3200000
      }
      this.$client[loadKey](params).then(res => {
        if (res.head.result === '200') {
          switch (loadKey) {
            case 'GetHomePageWaitDoErpUserCare': //待办事项
              this.listData[0].value = res.context.length ? res.context.length : ''
              break
            case 'GetHomePageRemindErpUserCare': //消息通知
              this.listData[1].value =  res.context.length ? res.context.length : ''
              break
            default:
              break
          }
        }
      })
    },
    // 查看全部
    lookRouter() {
      if(this.activeName === 'sharedFile') {
        this.$router.push({
          path: '/download-center'
        })
      }else if(this.activeName === 'charterNotice') {
        this.$router.push({
          path: '/car-charter-management/car-charter-filling'
        })
      }else {
        this.$router.push({
          path: '/address-book'
        })
      }
    },
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.to-do-reminder {
  height: calc(100% - 10px);
  margin-top: 10px;
  /deep/ .el-card__header {
    padding: 12px 20px * $NumWidth;
    .clearfix {
      display: flex;
      justify-content: space-between;
      .header-left {
        display: flex;
        align-items: center;
        .el-image {
          flex-shrink: 0;
          margin-right: 10px * $NumWidth;
        }
      }
      .header-right {
        justify-content: end;
      }
    }
    .clearfix:after {
      content: none;
    }
  }
  /deep/ .el-card__body {
    height: calc(100% - 50.67px);
    padding: 6px 20px * $NumWidth 12px;
  }
  .content-box {
    height: 100%;
    /deep/ .el-tabs__content {
      padding: 0;
    }
    /deep/ .el-tabs__header {
      padding: 0;
    }
    /deep/ .el-badge__content {
      top: 10px;
      right: 0;
      // padding: 0 2px;
    }
  }
  /deep/ .el-tabs {
    height: 100%;
  }
  /deep/ .el-tabs__content {
    height: calc(100% - 55px);
    padding: 0;
  }
  /deep/ .el-tab-pane {
    height: 100%;
    .content-tab {
      height: 100%;
      width: 100%;
    }
  }
  .content-tab {
    height: calc(100% - 55px);
    width: 100%;
  }
}
</style>
