<template>
    <div class="client-entry-exit-details">
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
    name: "client-entry-exit-details",
    data() {
      return {
        url: null,
        dispatch_url: window.dispatch_system.dispatch_url,
        dispatch_path: window.dispatch_system.dispatch_path
      }
    },
    created() {
      this.url = `${this.dispatch_url}${this.dispatch_path}/client-entry-exit-details`
    },
  }
  </script>
  <style lang="stylus" rel="stylesheet/stylus" scoped>
  .client-entry-exit-details {
    height: 100%;
  }
  </style>