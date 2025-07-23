<template>
  <div class="font-end">
    <p style="height: 44px"></p>
    <p class="text-right">{{gzname}}</p>
    <p class="text-right" v-if="posy_time_view === 0">{{ outTime(posy_time) }}</p>
    <p style="height: 44px"></p>
    <p class="text-left" v-if="keyword_view === 0">主题词:{{ keyword }} {{ typeObj[type] }}</p>
    <div class="line" v-if="keyword_view === 0"></div>
    <p class="text-left" v-if="main_department_view === 0">主送单位: {{main_department_name}}</p>
    <p class="text-left" v-if="copy_department_view === 0">抄送单位: {{copy_department_names}}</p>
    <div class="line" v-if="main_department_view === 0 || copy_department_view === 0"></div>
    <div style="display: flex">
      <p class="text-left">{{department_name_yf}}</p>
      <p class="text-right" style="flex:1" v-if="posy_time_view === 0">{{ outTime(posy_time) }}印发</p>
    </div>
    <div class="line" v-if="posy_time_view === 0"></div>
    <p class="text-right-mini" v-if="post_count_view === 0">共印{{ post_count }}份</p>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "font-end",
  props: {
    post_count: {
      type: Number,
      default: 0
    },
    posy_time: {
      type: String,
      default: ''
    },
    gzname: {
      type: String,
      default: ''
    },
    keyword: {
      type: String,
      default: ''
    },
    type: {
      type: Number,
      default: 8
    },
    // 主送部门
    main_department_name: {
      type: String,
      default: ''
    },
    // 抄送部门
    copy_department_names: {
      type: String,
      default: ''
    },
    // 印发部门
    department_name_yf: {
      type: String,
      default: ''
    },
    // 印发份数
    post_count_view: {
      type: Number,
      default: 0
    },
    // 主送部门
    main_department_view: {
      type: Number,
      default: 0
    },
    // 抄送部门
    copy_department_view: {
      type: Number,
      default: 0
    },
    posy_time_view: {
      type: Number,
      default: 0
    },
    keyword_view: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      typeObj: {
        100: '请示',
        101: '报告',
        102: '意见',
        200: '函',
        201: '议案',
        202: '公告',
        203: '通告',
        204: '通知',
        205: '纪要',
        206: '意见',
        300: '命令',
        301: '决议',
        302: '公报',
        303: '通报',
        304: '批复',
        305: '公告',
        306: '通告',
        307: '通知',
        308: '纪要',
        309: '意见',
      }
    }
  },
  methods: {
    outTime(time) {
      let out = ''
      if (time) {
        out = time.split(' ')[0]
        let arr_y = out.split('-')
        out = `${arr_y[0]}年${arr_y[1]}月${arr_y[2]}日`
      }
      return out
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.font-end{
  width 100%
  font-size calc(21.33px * 1.23)
  //font-family '仿宋'
  color #000000
  .text-right{
    text-align right
    line-height 2
  }
  .text-left{
    text-align left
    line-height 2
  }
  .line{
    background #000000
    height 2px
  }
  .text-right-mini{
    text-align right
    line-height 2
    font-size calc(12pt * 1.23)
  }
}
</style>
