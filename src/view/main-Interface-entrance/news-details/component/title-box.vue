<template>
  <div class="title-box">
    <el-card>
      <div class="title">
        <div class="text">{{title}}</div>
        <div class="btn">
          <slot name="head"></slot>
        </div>
      </div>
      <div class="content">
        <slot></slot>
      </div>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "title-box",
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.title-box{
  margin-bottom: 8px;
  display: block;
  .title{
    display: flex;
    line-height: 30px;
    .text{
      flex: 1;
      font-size: 20px;
      font-weight: 600;
    }
    .btn{
      text-align: right;
      flex: 1;
    }
  }
  .content{
    margin-top: 16px;
    width: 100%;
  }
}
</style>
