<template>
  <vue-draggable-resizable
    v-if="item.width"
    :w="width * rate"
    :h="height * rate"
    :x="x * rate"
    :y="y * rate"
    :min-width="1"
    :min-height="1"
    :parent="true"
    :grid="[1, 1]"
    class-name="dragging1"
    @dragging="onDrag"
    @resizing="onResize"
    @activated="onActivated"
    @deactivated="onDeactivated">
  <slot :data="item"></slot>
  </vue-draggable-resizable>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    rate: {
      type: Number,
      default: 1
    },
    width: {
      type: Number,
      default: 50
    },
    height: {
      type: Number,
      default: 50
    },
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    index: {
      type: Number,
      default: -1
    }
  },
  watch: {
    width(val){
      this.item.width = val
    },
    height(val){
      this.item.height = val
    },
    x(val){
      this.item.x = val
    },
    y(val){
      this.item.y = val
    },
    rate(val){
      this.rate =val
    }
  },
  data() {
    return {
      item: {
        width: 0,
        height: 0,
        x: 0,
        y: 0,
      }
    }
  },
  mounted() {
    this.item.height = this.height
    this.item.width = this.width
    this.item.x = this.x
    this.item.y = this.y
  },
  methods: {
    // 尺寸变化时
    onResize (x, y, width, height) {
      this.item.x = x / this.rate;
      this.item.y = y / this.rate;
      // this.item.width = width / this.rate;
      // this.item.height = height / this.rate;
      this.$emit('on-resize',this.index, this.item)
    },
    // 位置改变时
    onDrag: function (x, y) {
      this.item.x = x / this.rate;
      this.item.y = y / this.rate;
      this.$emit('on-resize',this.index, this.item)
    },
    // 选中事件
    onActivated() {
      this.$emit('activated', this.index)
    },
    // 取消选中
    onDeactivated() {
      this.$emit('deactivated', this.index)
    }
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.dragging1 {
  position:absolute
  border: 1px dashed #000000;
}
</style>
