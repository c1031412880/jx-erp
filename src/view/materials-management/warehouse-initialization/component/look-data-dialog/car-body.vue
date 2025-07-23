<template>
  <div class="car-body" :style="{height: `${height}px`}">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "car-body",
  props: {
    height: {
      type: Number,
      default: 510
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.car-body{
  width 100%
  overflow auto
}
</style>
