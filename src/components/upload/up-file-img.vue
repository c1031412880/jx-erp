<template>
  <el-upload
    class="upload-demo"
    ref="upload"
    action="string"
    :on-change="handlePreview"
    :on-remove="handleRemove"
    accept=".jpg,.png,.jpeg"
    :file-list="fileList"
    :limit="1"
    :disabled="disabled"
    :auto-upload="false">
    <el-button slot="trigger" size="small" type="primary" :disabled="disabled">选取文件</el-button>
    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过8M</div>
  </el-upload>
</template>

<script type="text/ecmascript-6">
  export default {
    props:{
      disabled:{
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        fileList: []
      }
    },
    methods: {
      // 回调文件列表
      handlePreview(file) {
        console.log(file)
        if (this.beforeUpload(file)) {
          this.$emit('on-file', file)
        } else {
          this.clearFile()
        }
      },
      // 删除文件 去掉预览图
      handleRemove(){
        this.$emit('on-reset')
      },
      // 清除列表
      clearFile() {
        this.fileList = []
      },
      // 判断文件大小
      beforeUpload (file) {
        const isLt1M = file.size / 1024 / 1024 < 8
        if (isLt1M) {
          return true
        }
        this.$message({type: 'error', message: '请不要上传大小超过8M的文件', showClose: true})
        return false
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
