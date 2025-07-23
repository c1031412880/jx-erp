<template>
  <el-row :gutter="40" type="flex">
    <el-col   v-for="(item,i) in data" :key="i">
      <div class="card-panel" @click="onClick(item)">
        <div class="card-panel-icon-wrapper" :class="item.class">
          <i style="font-size: 48px" :class="item.icon"></i>
        </div>
        <div class="card-panel-description">
          <count-to :start-val="0" :end-val="toolData[item.label] || 0" :duration="2600" class="card-panel-num"/>
          <div class="card-panel-text">{{item.label}}</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script type="text/ecmascript-6">
import countTo from 'vue-count-to'
export default {
  components: {countTo},
  props: {
    toolData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      data: [
        {
          left:0,
          label: '事故总数',
          value: 0,
          class: 'icon-2',
          icon: 'el-icon-s-order'
        },
        {
          left: 1,
          label: '有责事故',
          value: 0,
          class: 'icon-1',
          icon: 'el-icon-s-finance'
        },
        {
          left: 1,
          label: '无责次数',
          value: 0,
          class: 'icon-5',
          icon: 'el-icon-s-release'
        },
        {
          left: 1,
          label: '人伤人数',
          value: 0,
          class: 'icon-4',
          icon: 'el-icon-s-custom'
        },
        {
          left: 1,
          label: '扣除安全里程',
          value: 0,
          class: 'icon-3',
          icon: 'el-icon-s-marketing'
        }
      ]
    }
  },
  mounted() {

  },
  methods: {
    // 点击
    onClick(item) {
      this.$emit('on-ok', item)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$NumWidth: 100vw / 1920px;
.el-row{
  .el-col{
    margin-bottom: 20px * $NumWidth;
    margin-top: 5px * $NumWidth;
    flex: 1;
    .card-panel{
      height: 108px * $NumWidth;
      cursor: pointer;
      font-size: 12px * $NumWidth;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      border-radius: 5px * $NumWidth;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      &:hover{
        .card-panel-icon-wrapper{
          color: #fff;
        }
        .icon-1{
          background: #40c9c6;
        }
        .icon-2{
          background: #36a3f7;
        }
        .icon-3{
          background: #f4516c;
        }
        .icon-4{
          background: rgb(109, 200, 236);
        }
        .icon-5{
          background: rgb(93, 112, 146);
        }
      }
      .icon-1{
        color: #40c9c6;
      }
      .icon-2{
        color: #36a3f7;
      }
      .icon-3{
        color: #f4516c;
      }
      .icon-4{
        color: rgb(109, 200, 236);
      }
      .icon-5{
        color: rgb(93, 112, 146);
      }
      .card-panel-icon-wrapper{
        float: left;
        margin: 14px * $NumWidth 0 0 14px * $NumWidth;
        padding: 16px * $NumWidth;
        transition: all 0.38s ease-out;
        border-radius: 6px * $NumWidth;
      }
      .card-panel-icon{
        float: left;
        font-size: 48px * $NumWidth;
      }
      .card-panel-description{
        float: right;
        font-weight: bold;
        margin: 26px * $NumWidth;
        margin-left: 0;
        .card-panel-text{
          line-height: 18px * $NumWidth;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px * $NumWidth;
          margin-top: 12px * $NumWidth;
        }
        .card-panel-num{
          font-size: 30px * $NumWidth;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
