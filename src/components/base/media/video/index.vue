<template>
  <video
    :width="width"
    :height="height"
    muted
    autoplay
    class="videoBox"
    controls
    @error="onError"
    @ended="onEnded">
    <source :src="src" type="video/mp4">
    <source :src="src" type="video/ogg">
    <source :src="src" type="video/webm">
    <object :src="src" :width="width" :height="height">
      <embed :src="src" :width="width" :height="height">
    </object>
    您的浏览器不支持 HTML5 video 标签。
  </video>
</template>

<script  type="text/ecmascript-6">
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 500
    },
    height: {
      type: Number,
      default: 500
    }
  },
  mounted() {
    if (this.src) {
      this.$el.load()
      this.$el.play()
    } else {
      this.$el.load()
      this.$el.pause()
    }
  },
  watch: {
    src(val) {
      if (val) {
        this.$el.load()
        this.$el.play()
      } else {
        this.$el.load()
        this.$el.pause()
      }
    }
  },
  methods: {
    onEnded() {
      this.$emit('on-end')
    },
    onError() {
      console.log('err')
    }
  }
}
</script>

<style  lang="stylus" rel="stylesheet/stylus" scoped>
.videoBox
  margin auto
  border-radius: 4px
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  background #2b2b2b
</style>
