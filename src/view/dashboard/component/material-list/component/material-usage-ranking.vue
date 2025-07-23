<template>
  <div class="material-usage-ranking">
    <div class="select-box">
      <el-radio-group @change="loadData" v-model="type" size="mini">
        <el-radio-button :label="1">月</el-radio-button>
        <el-radio-button :label="2">年</el-radio-button>
      </el-radio-group>
      <el-date-picker
        v-model="month"
        type="month"
        style="width: 110px;"
        size="mini"
        format="yyyy-MM"
        value-format="yyyy-MM"
        v-show="type === 1"
        @change="loadData"
        placeholder="选择月">
      </el-date-picker>
    </div>
    <ul class="table-header">
      <li class="table-header-item" v-for="item in headerData" :key="item">
        {{ item }}
      </li>
    </ul>
    <ul class="table-content">
      <li class="table-content-item" v-for="(item, index) in tableData" :key="index">
        <div class="table-content-item-box">
          <el-image v-if="index < 3" :src="!index ? require('@/assets/home-image/no1.png') : index === 1 ? require('@/assets/home-image/no2.png') : require('@/assets/home-image/no3.png')"></el-image>
          <span class="table-content-item-box-num" v-else>{{ index + 1 }}</span>
        </div>
        <div class="table-content-item-box">{{ item.material_name }}</div>
        <div class="table-content-item-box">{{ item.material_type }}</div>
        <div class="table-content-item-box">{{ item.count }}</div>
        <div class="table-content-item-box">{{ item.fee }}</div>
        <div class="table-content-item-box">
          <el-image :src="require('@/assets/home-image/down-1.png')" v-if="(item.change && item.change.includes('-'))"></el-image>
          <el-image :src="require('@/assets/home-image/up-1.png')" v-else></el-image>
          <span :style="{'color': (item.change && item.change.includes('-')) ? '#0F8CFF' : '#C61D29'}">{{ item.change || 0 }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import {formatTime} from '@/utils/index'
export default {
  name: 'material-usage-ranking',
  components: {},
  data() {
    const nowMonth = formatTime(new Date(),'yyyy-MM').slice(0,7);
    return {
      type: 2,
      month: nowMonth,
      headerData: ['排名','材料名称','类型','使用数量','金额','变化'],
      tableData: [],
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      let params = {
        type: this.type,
      }
      if(this.type === 1) {
        params.month = this.month
      }
      this.$client.GetMateriarStatistic(params).then(res => {
        console.log('res',res)
        if (res.head.result == '200') {
          this.tableData = res.context
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.material-usage-ranking {
  height: 100%;
  width: 100%;
  position: relative;
  .select-box {
    position: absolute;
    top: -53px;
    right: 0;
    /deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner {
      background-color: #FFF1F2;
      border: 1px solid #C61D29;
      color: #C61D29;
      -webkit-box-shadow: -1px 0 0 0 #C61D29;
      box-shadow: -1px 0 0 0 #C61D29;
    }
    /deep/ .el-radio-button__inner:hover {
        color: #ee6069;
    }
  }
  .table-header {
    display: flex;
    background: #EBECF0;
    line-height: 18px * $NumWidth;
    .table-header-item {
      padding: 8px * $NumWidth 0;
      font-family: Source Han Sans CN, Source Han Sans CN;
      font-weight: bold;
      font-size: 14px * $NumWidth;
      color: #333333;
      flex-shrink: 0;
      text-align: center;
      border-right: 1px solid #DBDEE2;
    }
    .table-header-item:nth-child(1) {
      width: 15%;
    }
    .table-header-item:nth-child(2) {
      width: 25%;
    }
    .table-header-item:nth-child(3) {
      width: 15%;
    }
    .table-header-item:nth-child(4) {
      width: 15%;
    }
    .table-header-item:nth-child(5) {
      width: 15%;
      border-right: none;
    }
    .table-header-item:nth-child(6) {
      width: 15%;
      border-right: none;
    }
  }
  .table-content {
    height: 200px * $NumWidth;
    overflow: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    .table-content-item {
      display: flex;
      line-height: 18px * $NumWidth;
      .table-content-item-box {
        font-family: Source Han Sans CN, Source Han Sans CN;
        font-weight: 400;
        font-size: 14px * $NumWidth;
        color: #333333;
        flex-shrink: 0;
        text-align: center;
        padding: 8px * $NumWidth 0;
        display: flex;
        justify-content: center;
        align-items: center;
        
        .table-content-item-box-num {
          padding: 0 5px * $NumWidth;
          background-color: #A0BEFF;
          font-size: 16px * $NumWidth;
          line-height: 24px * $NumWidth;
          font-weight: 600;
          font-family: DIN;
          border-radius: 8px * $NumWidth;
        }
      }
      .table-content-item-box:nth-child(1) {
        width: 15%;
        .el-image {
          height: 24px * $NumWidth;
          width: 24px * $NumWidth;
          flex-shrink: 0;
        }
      }
      .table-content-item-box:nth-child(2) {
        width: 25%;
      }
      .table-content-item-box:nth-child(3) {
        width: 15%;
      }
      .table-content-item-box:nth-child(4) {
        width: 15%;
      }
      .table-content-item-box:nth-child(5) {
        width: 15%;
      }
      .table-content-item-box:nth-child(6) {
        width: 15%;
        .el-image {
          width: 12px * $NumWidth;
          height: 11px * $NumWidth;
          margin-right: 5px * $NumWidth;
        }
      }
    }
    斑马线效果
    .table-content-item:nth-child(odd) {
      background-color: #ffffff;
    }
    .table-content-item:nth-child(even) {
      background-color: #F7F7F9;
    }
  }
  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
}
</style>