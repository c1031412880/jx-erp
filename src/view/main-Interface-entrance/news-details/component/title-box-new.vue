<template>
  <div class="title-box">
    <el-card>
      <div class="title">{{title}}</div>
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
  display: block;
  margin-bottom: 8px;
  .title{
    font-size: 18px;
    font-weight: bold;
    color: #333333;
  }
  .content{
    width: 100%;
  }
}
/deep/ .el-card__body {
  padding: 15px 23px;
}
</style>
