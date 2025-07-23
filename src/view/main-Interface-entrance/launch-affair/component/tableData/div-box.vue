<template>
  <div class="div-box">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import {on} from '@/utils/dom'
  export default {
    mounted() {
      this.referenceElm = this.$el;
      on(this.referenceElm, 'mouseenter', this.show);
      on(this.referenceElm, 'mouseleave', this.hide);
    },
    methods: {
      // 显示
      show() {
        this.$emit('on-show')
      },
      // 隐藏
      hide() {
        this.$emit('on-hide')
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
