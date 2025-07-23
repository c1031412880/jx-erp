<template>
  <div class="week-list">
    <div class="head-box">
      <span style="margin-right: 60px;">{{value.getFullYear()}}年{{value.getMonth() + 1}}月</span>
      <el-radio-group v-model="radio" size="mini">
        <el-radio-button label="last">昨天</el-radio-button>
        <el-radio-button label="this">今天</el-radio-button>
        <el-radio-button label="next">明天</el-radio-button>
      </el-radio-group>
    </div>
    <div class="content-list">
      <tr-table
        :data="data"
        :loading="loading"
        :indexShow="false"
        :selectionShow="false"
        :TableHeight="TableHeight"
        :isShowBottomOptions="false"
        :tableHeaderList="canRendererTableHeader">

      </tr-table>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {getWeekDataList, getYearWeek,formatTime} from '@/utils/index'
export default {
  props: {
    value: '',
    curSelectType: {
      type: String,
      default: 'week'
    }
  },
  components: {
    
  },
  data() {
    return {
      radio: 'this',
      data: [],
      loading: false,
      TableHeight: 500,
      canRendererTableHeader: null,
    }
  },
  mounted() {
    this.setTableHeader()
    // console.log('查询数据', this.value);
    this.$nextTick(() => {
      this.setHead()
    })
  },

  methods: {
    setTableHeader() {
      let week = '第' + getYearWeek(this.value) + '周'
      let title = this.value.getMonth() + 1 + '月' + this.value.getDate() + '日' + ' ' + this.strWeek[this.value.getDay()]
      this.canRendererTableHeader = [
        {
          id: 1,
          label: week,
          prop: "time",
          width: "60",
          align: "center",
          signIndex: 0,
          sortable: false,
          notTooltip: true,
        },
        {
          id: 2,
          label: title,
          prop: formatTime(this.value),
          width: "260",
          align: "center",
          signIndex: 1,
          notTooltip: true,
        },
      ]
    },
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        this.TableHeight = maxh - 73;
        // console.log(maxh);
      }, 60);
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.week-list {
  height: 100%;
  width: 100%;
  .head-box {
    padding: 12px 20px;
    border-bottom: 1px solid #ebeef5;
  }
  .content-list {
    height: calc(100% - 53px);
    padding: 10px 20px;
  }
}
  
</style>