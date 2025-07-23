<template>
  <div id="app">
    <router-view v-if="isReloadAlive"/>
  </div>
</template>

<script>
export default {
  provide() {
    return {
        reload: this.reload
    }
  },
  data(){
    return {
      isReloadAlive : true
    }
  },
  methods: {
      reload() {
        this.isReloadAlive = false
        this.$nextTick(() => {
          this.isReloadAlive = true;
        })
      }
  },
  mounted() {
    // const t = window.devicePixelRatio
    // const allWidth = window.document.body.offsetWidth
    // if (t !== 1) {
    //   document.body.style.zoom = 1 / t
    // } else {
    //   if (allWidth < 1920) {
    //     document.body.style.zoom = allWidth / 1920
    //   }
    // }
    // 固定pt 65
    // pt与px转换 px = pt / 72 * 96
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
html,body,#app
  height: 100%
.mark-icon{width:auto;font-size:10px;}
.mark-icon-txt-off{margin:4px;border:1px solid #2b2b2b;border-radius:5px;background:#ddd;white-space:nowrap;padding:3px;}
.mark-icon-txt-on {
margin: 4px;
border: 1px solid #2b2b2b;
border-radius: 5px;
background: #00b98d;
white-space: nowrap;
padding:3px;
color:#fff;
}
.mark-icon-txt-focus {
margin: 4px;
border: 1px solid #2b2b2b;
border-radius: 5px;
background: #2d2d2d;
white-space: nowrap;
color:#fff;
}
.mark-icon-line {
width: 2px;
height: 10px;
margin-left: calc((100% - 2px) / 2);
background:#2d2d2d;
margin-top:-4px;
}
.label-btndiv {
  padding: 2px;
  align-content: center;
  align-items: center ;
  background: #FFFFFF;
  display flex;
}
.label-p {
  padding: 10px;
  background: #FFFFFF;
  color: #2d2d2d
}
.label-btn {

  width: calc((100% - 4px) / 2);
  margin:1px;
}
.label-close {
  margin-left:calc(100%-20px);
  background: #2b2b2b;
  color: #999999
}
.label-divlbl {
  margin: 0px;
  background: #FFFFFF;
}
  #nprogress{
    .bar{
      background: #f6ca9d !important;
    }
    .spinner{
      .spinner-icon{
        border-top-color: #f6ca9d !important;
        border-left-color: #f6ca9d !important;
      }
    }
  }

  div,section
  &:focus
    outline 0
*, *::before, *::after
  box-sizing border-box
</style>
