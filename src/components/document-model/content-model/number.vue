<template>
  <div class="number">
    <p :style="{textAlign: type < 200 ? 'left' : 'center'}">
      <span style="margin-left: calc(11px * 1.23)"></span>
      {{font_number}}
    </p>
    <div class="qianfa" v-if="userName">签发人：{{userName}}</div>
    <div class="line" v-show="fiveType === 1"></div>
    <div class="fiveLine" v-show="fiveType === 0">
      <div class="line"></div>
      <div class="five">★</div>
      <div class="line"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "number",
  props: {
    font_number: {
      type: String,
      default: ''
    },
    type: {
      type: Number,
      default: 100
    },
    fiveType: {
      type: Number,
      default: 0
    },
    userName: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.number{
  width 100%
  margin-top calc(32px * 1.23)
  font-size calc(21.33px * 1.23)
  color #000000
  position relative
  //font-family '仿宋_GB2312'
  .qianfa{
    position absolute
    right calc(11px * 1.23)
    top 0
    font-size calc(21.33px * 1.23)
  }
  .line{
    width 100%
    margin-top calc(21.33px * 1.23)
    height 4px
    background red
  }
  .fiveLine{
    width 100%
    display flex
    font-size calc(29.33px * 1.23)
    line-height calc(29.33px * 1.23 * 1.5)
    color red
    .line{
      flex 1
      height 2px
    }
  }
}
</style>
