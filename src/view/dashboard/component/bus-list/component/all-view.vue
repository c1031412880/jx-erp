<template>
  <el-row class="all-view">
    <el-col :span="12" v-for="(item,index) in data" :key="index">
      <div class="content-item">
        <div class="item-top">
          <count-to class="item-top-num" :start-val="0" :end-val="item.value" :duration="2600"/>
          <span class="item-top-class">{{ item.class }}</span>
        </div>
        <div class="item-bottom">{{ item.title }}</div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import countTo from 'vue-count-to'

export default {
  name: 'all-view',
  components: {countTo},
  data() {
    return {
      data: [
        {title: '员工', value: 0,class: '人'},
        {title: '公交车辆', value: 0,class: '辆'},
        // {title: '自行车', value: 0,class: '辆'},
        {title: '线路', value: 0,class: '条'},
        {title: '站点', value: 0,class: '个'},
        // {title: '自行车站点', value: 0,class: '个'},
      ]
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.$client.GetBusData().then(res => {
        if (res.head.result == '200') {
          let overView = res.context.bus_overview || {}
          this.data[0].value = overView.user_count
          this.data[1].value = overView.vehicle_count
          this.data[1].value = 1166
          // this.data[2].value = overView.line_count
          this.data[2].value = 186
          this.data[3].value = overView.station_count
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
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.all-view {
  height: 100%;
  .content-item {
    margin: 10px * $NumWidth;
    padding: 20px * $NumWidth 0;
    background: #F2F7FB;
    display: flex;
    flex-direction: column;
    align-items: center;
    .item-top {
      display: flex;
      .item-top-num {
        font-family: DIN, DIN;
        font-weight: bold;
        font-size: 32px * $NumWidth;
        color: #333333;
      }
      .item-top-class {
        font-size: 12px * $NumWidth;
        font-family: Source Han Sans CN, Source Han Sans CN;
        color: #333333;
        padding-top: 20px * $NumWidth;
      }
    }
    .item-bottom {
      padding-top: 10px * $NumWidth;
      font-size: 14px * $NumWidth;
      font-family: Source Han Sans CN, Source Han Sans CN;
      font-weight: 400;
      color: #333333;
    }
  }
}
</style>