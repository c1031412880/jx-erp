<template>
  <div class="footer-tool">
    <span class="text-s">车辆总数:{{tool.veh_count}}</span>
    <span class="text-s">总屏数:{{tool.lcd_count}}</span>
    <span class="text-s">屏在线总数:{{tool.lcd_on_line_count}}</span>
    <span class="text-s">系统时间: {{dateTime}}</span>
  </div>
</template>

<script>
  export default {
    name: "footer-tool",
    data() {
      return {
        tool: {},
        dateTime: ''
      }
    },
    created() {
      this.loadData()
      setInterval(() => {
        this.loadData()
      }, 60000)
      setInterval(() => {
        this.dateTime = this.myDateTime()
      }, 1000)
    },
    methods: {
      myDateTime () {
        let datetime = new Date()
        return datetime.getFullYear() +
          '-' + (datetime.getMonth() + 1) +
          '-' + datetime.getDate() +
          ' ' + datetime.getHours() +
          ':' + (datetime.getMinutes() > 9 ? datetime.getMinutes() :'0' +  datetime.getMinutes()) +
          ':' + (datetime.getSeconds() > 9 ? datetime.getSeconds() :'0' +  datetime.getSeconds())
      },
      loadData () {
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.footer-tool
  padding 5px
  line-height 30px
  border-top: solid 1px #e6e6e6
  .text-s
    margin-right 10px
    font-size 14px
    color #666
</style>
