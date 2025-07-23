<template>
  <div class="handwritten-signature">
    <el-image :style="{width:width + 'px',height:height + 'px'}" :src="signSrc" @click.native="showPopup">
      <div slot="error" class="image-slot">
        <span>手写签字</span>
      </div>
    </el-image>
    <el-dialog
      title="签字"
      append-to-body
      :close-on-click-modal="false"
      width="700px"
      :visible.sync="dialogVisible">
      <div class="sign" ref="sign">
        <canvas class="canvas" ref="canvas"/>
        <div class="actions">
          <el-button @click="clear()">清屏</el-button>
          <el-button @click="getPNG()">保存</el-button>
          <el-button @click="cancel()">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SmoothSignature from "smooth-signature";
export default {
  props: {
    width: {
      type: [String,Number],
      default: 150
    },
    height: {
      type: [String,Number],
      default: 100
    }
  },
  data() {
    return {
      show: false,
      signature: null,
      // 横屏还是竖屏    默认竖屏
      HorV: false,
      signSrc: '',
      dialogVisible: false,
    };
  },
  mounted() {
  },
  methods: {
    showPopup() {
      this.dialogVisible = true
      this.$nextTick(() => {
        // const canvas = document.querySelector("canvas");
        const canvas = this.$refs.canvas
        this.signature =  new SmoothSignature(canvas, {
          width: 600,
          height: 400,
          scale: 2,
          minWidth: 4,
          maxWidth: 10,
          color: '#1890ff',
          bgColor: '#efefef'
        });
      })

    },
    // 清屏
    clear() {
      this.signature.clear()
    },
    // 取消
    cancel() {
      this.signature = null  
      this.dialogVisible = false 
    },
    getPNG() {
      if (this.signature.isEmpty()) {
        this.$emit('get-img','')
        this.dialogVisible = false 
        this.signature = null 
        this.signSrc = ''
        return
      }
      this.signSrc = this.signature.getPNG()
      this.$emit('get-img',this.signSrc)
      this.dialogVisible = false 
      this.signature = null 
    },
    // 清除图片 
    onClear() {
      this.signSrc = ''
    },
  },
};
</script>

<style lang="scss" scoped>
.sign {
  width: 100%;
  height: 100%;
  text-align: center;
  .actions {
    text-align: center;
    margin-top: 10px;
    button{
        margin-right: 20px;
    }
  }
}
.handwritten-signature {
 /deep/ .image-slot {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #000;
    vertical-align: middle;
    background-color: #e9e6e6;
  }
}

</style>
