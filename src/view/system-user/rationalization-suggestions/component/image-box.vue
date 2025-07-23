<template>
  <div class="image-box">
    <div class="image">
      <img :src="src" >
    </div>
    <div class="mongolia" v-show="mongolia">
      <div class="box">
        <i class="el-icon-view" @click="dialogVisible = true"></i>
        <el-popover
          style="margin-left: 10px"
          placement="top"
          width="160"
          v-model="popoverEl"
          v-if="!disabled"
        >
          <p>确定删除此条数据吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" @click="popoverEl = false">取消</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="onDelete"
            >确定</el-button>
          </div>
          <i class="el-icon-delete" style="margin-left: 10px" slot="reference"></i>
        </el-popover>
      </div>
    </div>
    <el-dialog
      append-to-body
      :visible.sync="dialogVisible"
      width="40%">
      <img :src="src" width="100%">
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import {on} from '@/utils/dom'
  export default {
    props: {
      src: {
        type: String,
        default: ''
      },
      id: {},
      disabled:{
        type:Boolean,
        default: false
      }
    },
    data() {
      return {
        referenceElm: null,
        mongolia: false,
        dialogVisible: false,
        popoverEl: false
      }
    },
    mounted() {
      this.referenceElm = this.$el;
      on(this.referenceElm, 'mouseenter', this.show);
      on(this.referenceElm, 'mouseleave', this.hide);
    },
    methods: {
      // 显示
      show() {
        this.mongolia = true
      },
      // 隐藏
      hide() {
        this.mongolia = false
      },
      // 删除
      onDelete() {
        this.popoverEl = false
        this.$emit('on-delete', this.id)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.image-box
  position relative
  width: 100%
  height: 100%
  background #1f2d3d
  .image
    width 100%
    height 100%
    display:flex;
    align-items:center;
    justify-content:center;
    overflow hidden
    img
      width: 100%
      height auto
  .mongolia
    position: absolute
    left: 0
    top 0
    width 100%
    height 100%
    z-index: 2
    background:hsla(240,100%,10%,.3) border-box;
    box-shadow:0 0 0 1px hsla(0,0%,100%,.3) inset,0 .5em 1em rgba(0,0,0,0.6);
    text-shadow:0 1px 1px hsla(0,0%,100%,.3);
    .box
      width 100%
      height 100%
      line-height: 160px
      text-align: center
      color #fff
      font-size 22px
      font-weight: 600
      i:hover
        color: #409EFF !important
        cursor: pointer
  .mongolia::before
    content:'';
    position:absolute;
    top:0;
    right:0;
    bottom:0;
    left:0;
    margin:-30px;
    z-index:-1;
    -webkit-filter:blur(20px);
    filter:blur(20px);
</style>
