<template>
  <el-dialog
    :title="title"
    :visible="dialogVisible"
    width="500px"
    :before-close="handleClose"
    :append-to-body="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    top="0vh"
  >
    <div ref="containerRef" class="container"></div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import Jigsaw from './jigsaw'
import './jigsaw.css'
export default {
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      title: '',
      jigsaw: null
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        const _this = this
        this.$nextTick(() => {
          this.jigsaw = new Jigsaw({
            el: _this.$refs.containerRef,
            width: 460, // 可选, 默认310
            height: 250, // 可选, 默认155
            onSuccess: function () {
              // _this.$message.success('验证成功')
              setTimeout(() => {
                _this.$emit('success-photo-valid')
              }, 1000)
            }
          })
          this.jigsaw.init()
        })
      } else {
        this.jigsaw.unmountDOM()
        this.jigsaw = null
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
    }
  },
  beforeDestroy() {}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
>>>.el-dialog {
  top: 30%;
  transform: translateY(-30%);

  .container {
    height: 300px;
    margin-bottom: 20px;
  }

  .el-dialog__header .el-dialog__headerbtn {
    top: 15px;
  }
}
</style>