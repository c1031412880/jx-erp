<template>
  <div class="header">
    <div class="number"></div>
    <div class="describe">
      <p v-if="secret_view === 0">{{secretObj[secret]}}</p>
      <p v-if="degree_view === 0">{{degreeObj[degree]}}</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    code: {
      type: String,
      default: '000001'
    },
    secret: {
      type: Number,
      default: 1
    },
    degree: {
      type: Number,
      default: 1
    },
    secret_view: {
      type: Number,
      default: 0
    },
    degree_view: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      degreeObj: {
        1: '平急',
        2: '加急',
        3: '特急'
      },
      secretObj: {
        1: '秘密',
        2: '机密',
        3: '绝密'
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.header{
  width 100%
  display flex
  //font-family '仿宋'
  .number{
    flex 1
    line-height 2
    font-size calc(21.33px * 1.23)
    color #000000
    text-align left
  }
  .describe{
    flex 1
    line-height 2
    font-size calc(21.33px * 1.23)
    font-weight 900
    color #000000
    text-align right
  }
}
</style>
