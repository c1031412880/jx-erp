<template>
  <div style="width: 100%;height: 100%">
     <!-- 丽水新闻资讯  -->
    <!-- <newsInformationLs ref="newsInformationLs" v-if="printUrl_appid === 'ls'"/> -->

    <!--  通用新闻资讯  -->
    <!-- <newsInformationAll ref="newsInformationAll" v-else/> -->
    <yard-tation-manage/>
  </div>
</template>

<script>
import newsInformationLs from './news-information-ls'
import newsInformationAll from './news-information-all'
export default {
  name: "news-information",
  components:{
    newsInformationLs,
    newsInformationAll,
  },
  data(){
    return{
      printUrl_appid: window.newHttpConfig.printUrl_appid,
    }
  },
  mounted() {
    this.$nextTick(() => {
      // this.setHead()
      // window.eventOn.$on('view-resize' + this.$route.fullPath, () => this.setHead());
    })
  },
  methods:{
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        if(this.$refs.newsInformationLs) this.$refs.newsInformationLs.setHead(maxh);
        if(this.$refs.newsInformationAll) this.$refs.newsInformationAll.setHead(maxh);
      }, 60);
    },
  }
}
</script>

<style scoped>

</style>
