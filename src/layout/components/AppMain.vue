<template>
  <section class="app-main">
    <div class="app-main-bg"></div>
    <keep-alive :include="cachedViews" ref="keepAlive">
      <router-view :key="key"/>
    </keep-alive>
<!--    <keep-alive :include="cachedViews">-->
<!--      <router-view :key="key"/>-->
<!--    </keep-alive>-->
<!--    <transition name="fade-transform" mode="out-in">-->
<!--      -->
<!--    </transition>-->
  </section>
</template>

<script>
import elementResizeDetectorMaker from 'element-resize-detector'
export default {
  name: 'AppMain',
  mounted() {
    this.$nextTick(() => {
      const erd = elementResizeDetectorMaker()
      erd.listenTo(this.$el, () => {
        console.log('event-size', 123)
        eventOn.$emit('view-resize' + this.$route.fullPath)
      })
    })
  },
  computed: {
    cachedViews() {
      console.log('缓存',this.$store.state.tagsView)
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      // console.log(this.$refs.keepAlive, this.$route.fullPath)
      return this.$route.fullPath
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  height: calc(100vh - 82px);
  padding: 10px;
  position: relative;
  overflow: auto;
  .app-main-bg{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: #dedfe3;
  }
  /* background: #F0F2F5; */
}
</style>
