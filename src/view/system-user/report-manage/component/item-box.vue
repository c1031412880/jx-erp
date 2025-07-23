<template>
  <div class="item-box">
    <el-card>
      <div class="title">
        <div class="car"></div>
        <div class="text">{{title}}</div>
        <el-button
          style="margin-left: 10px;margin-top: -6px"
          type="text"
          @click="contentShow = !contentShow">{{contentShow ? '收缩' : '展开'}}</el-button>
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
      this.$emit('on-title')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.item-box{
  width: 100%;
  margin-bottom: 20px;
  .title{
    display: flex;
    margin-bottom: 10px;
    .car{
      margin-right: 8px;
      margin-top: 5px;
      width: 5px;
      height: 15px;
      background: #409EFF;
    }
    .text{
      line-height: 25px;
      font-size: 18px;
      font-weight: 500;
      color: #303133;
    }
  }
  .context{
    width: 100%;
  }
}
</style>
