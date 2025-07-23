<template>
  <el-card class="address-book">
    <div slot="header" class="clearfix">
      <div class="header-left">
        <el-image :src="require('@/assets/home-image/modular-7.png')"></el-image>
        <span style="color: #000; font-size: 15px; font-weight: 400; font-family: 黑体">
          通讯录
        </span>
      </div>
      <div class="header-right">
        <el-button @click="lookRouter" type="text" style="padding: 5px 0">
          查看全部
          <i class="el-icon-arrow-right"></i>
          <i style="margin-left: -5px" class="el-icon-arrow-right"></i>
        </el-button>
      </div>
    </div>
    <div class="content-box">
      <div class="filter-item">
        <el-input
          @change="getData"
          v-model="content"
          size="mini"
          placeholder="请输入关键字"
        ></el-input>
      </div>
      <el-tabs v-model="activeName" class="tab-box">
        <el-tab-pane
          v-for="(item, i) in listData"
          :key="i"
          :name="item.ref"
          :label="item.label"
          lazy
        >
          <div class="content-tab">
            <!-- <el-skeleton v-if="dataObj[item.loadKey].loading" /> -->
            <list-box :ref="item.ref" :loadKey="item.loadKey"></list-box>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>

<script type="text/ecmascript-6">
import listBox from "./component/list-box"
export default {
  name: 'address-book',
  components: {
    listBox
  },
  data() {
    return {
      content: '',
      activeName: 'GetCompanyCommunicateSysMenu',
      listData: [
        {
          label: '公司联系人',
          ref: 'GetCompanyCommunicateSysMenu',
          loadKey: 'GetCompanyCommunicateSysMenu'
        },
        {
          label: '公共联系人',
          ref: 'GetCommunicateBookSysMenu',
          loadKey: 'GetCommunicateBookSysMenu'
        }
      ],
      dataObj: {
        GetCommunicateBookSysMenu: {
          loading: false,
          data: []
        },
        GetCompanyCommunicateSysMenu: {
          loading: false,
          data: []
        },
      },
    }
  },
  mounted() {

  },
  methods: {
    // 查看全部
    lookRouter() {
      this.$router.push({
        path: '/address-book'
      })
    },
    getData() {
      this.$refs[this.activeName][0].form = {content: this.content}
      this.$refs[this.activeName][0].loadData()
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.address-book {
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
    padding: 6px 20px * $NumWidth 12px;
  }
  .content-box {
    position: relative;
    .filter-item {
      position: absolute;
      right: 0;
      top: 6px;
      z-index: 999;
      .el-input {
        width: 180px * $NumWidth;
      }
      /deep/ .el-tabs__content {
        padding: 0;
      }
      /deep/ .el-tabs__header {
        padding: 0;
      }
    }
    .content-tab {
      height: 312px;
      width: 100%;
    }
  }
}
</style>
