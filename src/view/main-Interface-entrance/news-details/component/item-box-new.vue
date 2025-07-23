<template>
  <div class="item-box">
    <el-card>
      <div class="title">
        <div class="car"></div>
        <div class="text">{{title}}</div>
        <el-button
          style="margin-left: 8px; margin-top: -6px"
          type="text"
          size="mini"
          @click="clickTitle()">{{contentShow ? '收缩' : '展开'}}</el-button>
      </div>
      <el-collapse-transition>
        <div class="context" v-show="contentShow">
          <slot></slot>
        </div>
      </el-collapse-transition>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "item-box",
  data() {
    return {
      contentShow: true
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    clickTitle() {
      this.contentShow = !this.contentShow
      this.$emit('on-title',this.contentShow)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.item-box{
  width: 100%;
  margin-bottom: 8px;
  .title{
    display: flex;
    margin-bottom: 17px;
    .car{
      width: 3px;
      height: 13px;
      background: #3399FE;
    }
    .text{
      font-size: 14px;
      // font-family: Source Han Sans SC-Bold, Source Han Sans SC;
      font-weight: bold;
      color: #333333;
      margin-left: 8px;
    }
  }
  .context{
    width: 100%;
  }
}
/deep/ .el-card__body {
  padding: 15px 23px;
}
</style>
