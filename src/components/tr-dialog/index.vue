<template>
  <!-- 
    改装 el-dialog  加了一个全屏按钮 
    缺什么elementUI事件就在这里接着加
    用法基本不变   :before-close  变成 @before-close 
  -->
  <el-dialog
    ref="dialog-box"
    :title="title"
    :visible="visible"
    :close-on-click-modal="closeOnClickModal"
    :width="width"
    :class="dialogClass"
    :center="center"
    :top="top"
    :before-close="dialogClose"
    :fullscreen.sync="fullscreen"
    :append-to-body="appendToBody"
  >
  <slot name="title" slot="title">
    <div class="dialog-title">
      <span>{{title}}</span>
      <i @click="fullSwitch" class="el-icon-full-screen"></i>
    </div>
  </slot>
  <slot></slot>
  <slot slot="footer" name="footer" class="dialog-footer"></slot>
  
  </el-dialog>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      visible: {
        type: Boolean,
        default: false
      },
      closeOnClickModal: {
        type: Boolean,
        default: false
      },
      width: {
        type: String,
        default: '760px'
      },
      dialogClass: {
        type: String,
        default: 'dialog-box'
      },
      center: {
        type: Boolean,
        default: false
      },
      top: {
        type: String,
        default: '20px'
      },
      appendToBody: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        fullscreen: false
      }
    },
    mounted() {},
    methods: {
      dialogClose() {
        this.$emit("before-close");
      },
      fullSwitch() {
       this.fullscreen = !this.fullscreen
       this.$emit('change-full',this.fullscreen)
      },
    } 
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.dialog-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  color: #333;
  font-weight: 600;
  padding-right: 30px;
  .i {
    cursor: pointer;
  }
}
</style>
