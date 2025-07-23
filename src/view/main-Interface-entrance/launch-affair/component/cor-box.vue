<template>
  <div class="cor-box" :style="{height: `${height}px`}">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: "cor-box",
    props: {
      height: {
        type: Number,
        default: 400
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.cor-box{
  width: 100%;
  display: block;
}
</style>
