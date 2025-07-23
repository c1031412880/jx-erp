<template>
  <div class="print-template">
    <iframe :src="url" width="100%" height="100%"></iframe>
  </div>
</template>

<script>
export default {
  props:["url"],
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style style rel="stylesheet/scss" lang="scss" scoped>
.print-template {
  width: 100%;
  height: 100%;
}
</style>
