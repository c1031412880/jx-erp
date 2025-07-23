<template>
  <div class="tr-page-header">
    <div class="header-left">
      <el-button style="margin-bottom: 3px" type="primary" size="mini" icon="el-icon-back" plain @click="back">返回</el-button>
    </div>
    <div class="header-content" :style="{textAlign: align}">{{content}}</div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: "trPageHeader",
    props: {
      content: [String],
      align: {
        type: String,
        default: 'center'
      }
    },
    methods: {
      back() {
        this.$emit('back')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.tr-page-header{
  display flex
  line-height 35px
  .header-left{
    flex 0 120px
    width 120px
  }
  .header-content{
    font-size 16px
    font-weight 700
    color #303133
    flex 0 calc(100% - 240px)
    width calc(100% - 240px)
  }
}
</style>
