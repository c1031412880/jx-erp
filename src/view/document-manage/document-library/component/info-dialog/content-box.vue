<template>
  <div class="content-box">
    <el-form :inline="true" size="mini">
      <!-- <el-form-item>
        <el-button type="primary" @click="upLoadFile">上传正文</el-button>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="onDow">下载</el-button>
      </el-form-item>
    </el-form>
    <iframe class="iframe-box"
            v-if="content"
            :src="content"
            frameborder="0"
            ref="iframe"
            allowfullscreen="true" allowtransparency="true"/>
      <el-empty v-else description="请上传正文"></el-empty>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "content-box",
  data() {
    return {
      content: '',
      content_url: '',
      url: 'http://view.xdocin.com/xdoc?_pdf=true&_xdoc='
    }
  },
  methods: {
    onDow() {
      if (!this.content) {
        this.$message({
          message: '请上传正文',
          type: 'warning'
        });
        return false
      }
      window.location.href = this.content_url
      this.$message({type: 'success', message: '下载成功'})
    },
    upLoadFile() {
      let input = document.createElement("input");
      input.type = "file";
      input.onchange = () => {
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        reader.onload = (ev) => {
          input = undefined;
        };
        let params = new FormData
        params.append('file', file)
        this.$client.uploadPicture({file: params}, '/api/ERPWeb/DataBase/UploadOnlineFile').then((req) => {
          // console.log(req);
          if (req.head.result === "200") {
            this.content = req.context
          }
        });
      };
      input.click();
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.content-box{
  width 100%
  height 100%
  .iframe-box{
    width: 100%;
    height: calc(100% - 65px);
    padding: 0;
    margin: 0;
    border: none;
  }
}
</style>
