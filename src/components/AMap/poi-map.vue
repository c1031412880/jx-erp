<template>
  <div class="poi-map"></div>
</template>

<script type="text/ecmascript-6">
import AMap from 'AMap'
import AMapUI from 'AMapUI'
export default {
  name: "poi-map",
  data(){
    return {
      AMap: null,

    }
  },
  methods: {
    initMap() {
      this.AMap = new AMap.Map(this.$el, {
        zoom: 11
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.poi-map {
  width 100%
  height 100%
}
</style>
