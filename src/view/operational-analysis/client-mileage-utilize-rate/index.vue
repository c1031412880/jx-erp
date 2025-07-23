<template>
    <div class="client-mileage-utilize-rate">
      <iframe 
        v-if="url"
        id="iframe"
        :src="url" 
        frameborder="0"
        width="100%"
        style="background: #fff;height: calc(100% - 10px);"
      ></iframe>
    </div>
  </template>
  <script type="text/ecmascript-6">
  export default {
    name: "client-mileage-utilize-rate",
    data() {
      return {
        url: null,
        dispatch_url: window.dispatch_system.dispatch_url,
        dispatch_path: window.dispatch_system.dispatch_path
      }
    },
    created() {
      this.url = `${this.dispatch_url}${this.dispatch_path}/client-mileage-utilize-rate`
    },
  }
  </script>
  <style lang="stylus" rel="stylesheet/stylus" scoped>
  .client-mileage-utilize-rate {
    height: 100%;
  }
  </style>