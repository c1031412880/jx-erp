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
            v-if="content_file"
            :src="content_file"
            frameborder="0"
            ref="iframe"
            allowfullscreen="true" allowtransparency="true"/>
      <el-empty v-else description="请上传正文"></el-empty>
  </div>
</template>

<script type="text/ecmascript-6">
import {download} from '@/utils/updateFilename'
import {getUser, getSession} from '@/utils/auth'
export default {
  name: "content-box",
  data() {
    return {
      url: 'http://122.225.198.118:5000/api/ERPWeb/Upload/DownLoadFile?url',
      content_file: '',
      content: '',
      content_url: '',
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
      let arr = this.content.split("/")
      let fileName = arr[arr.length - 1].slice(10)
      download(this.content, fileName)
      // this.getBlob(this.content).then((blob) => {
      //   this.saveAs(blob, fileName) 
      // })
      // this.$message({type: 'success', message: '下载成功'})
      // window.open(this.content)
    },
    getBlob(url) {
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET',url, true)
        xhr.responseType = 'blob'
        xhr.onload = () => {
          if(xhr.status === 200) {
            resolve(xhr.response)
          }
        }
        xhr.send()
      })
    },
    saveAs(blob, fileName) {
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileName
      link.click()
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
            // this.content_file = 'http://124.221.93.130:11053/onlinePreview?url='+encodeURIComponent(this.$Base64.encode(req.context))
            this.content = req.context
            this.content_url = req.context
            let userInfo = JSON.parse(getUser())
            let token = getSession()
            let file_extension = (req.context.split('.')).pop().toLowerCase()
            let url = ''
            if(file_extension == 'rar' || file_extension == 'zip') {
              url = newHttpConfig.previewUrl +  '/onlinePreview?url='+encodeURIComponent(this.$Base64.encode(this.content))
            }else {
              url = newHttpConfig.previewFile + '/index.html' + `?isEdit=true&user=${userInfo.user_id}&token=${token}&file_id=${this.file_id}&type=${file_extension}`
            }
            this.content_file = url
          }
        });
      };
      input.click();
    },
    setData() {
      Object.assign(this.$data, this.$options.data());
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
