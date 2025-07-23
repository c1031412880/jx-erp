<template>
  <div class="content-box">
    <el-form :inline="true" size="mini">
      <el-form-item>
        <el-button type="primary" @click="upLoadFile">上传正文</el-button>
      </el-form-item>
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
      <!-- <ul v-if="!!this.upLoadFilesList.length">
        <li  v-for="(zItem,zIndex) in this.upLoadFilesList" :key="zIndex">
          <div>
            <i class="el-icon-document-remove"></i>
            <span>{{zItem.name || zItem.file_name}}</span>
            <i class="el-icon-view" style="color: #66b1ff;" @click="previewDocument(zItem,zIndex)"></i>
          </div>
          <div>
            <img :src="require('@/assets/approverStepIcon/liuchen5.png')" @click="deleteDocument(zItem)" v-if="isShowBox" alt="">
            <i class="el-icon-download" style="color: #66b1ff;margin-right:10px" @click="downloadDocument(zItem,zIndex)"></i>
            <i class="el-icon-view" style="color: #66b1ff;" @click="previewDocument(zItem,zIndex)"></i>
          </div>
        </li>
      </ul> -->
      <el-empty v-else description="请上传正文"></el-empty>
  </div>
</template>

<script type="text/ecmascript-6">
import {getUser, getSession} from '@/utils/auth'
import {download} from '@/utils/updateFilename'
export default {
  name: "content-box",
  data() {
    return {
      upLoadFilesList: [],
      content_file: '',
      content: '',
      content_url: '',
      file_id: 0
    }
  },
  methods: {
    resetData() {
      Object.assign(this.$data, this.$options.data())
    },
    onDow() {
      if(!this.content) {
        this.$message.warning('请先上传正文')
        return false
      }
      let arr = this.content.split("/")
      let fileName = arr[arr.length - 1].slice(10)
      download(this.content, fileName)
      // this.getBlob(this.content).then((blob) => {
      //   this.saveAs(blob, fileName) 
      // })
      // window.location.href = this.content_url
      // this.$message({type: 'success', message: '下载成功'})
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
        let fileName = input.files[0].name
        let size = input.files[0].size
        reader.onload = (ev) => {
          input = undefined;
        };
        let params = new FormData();
        params.append("file", file);
        this.$client.AddTxtfileUpload({file: params}).then((req) => {
          if (req.head.result === "200") {
            let fileObj = {
              name: fileName,
              url: req.context,
              size: size,
              file_id: req.file_id
            }
            this.upLoadFilesList.push(fileObj);
            this.content = req.context
            this.content_url = req.context
            this.file_id = req.file_id
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
            this.$message({
              showClose: true,
              message: "上传成功",
              type: "success"
            });
          }else{
            this.$message({
              showClose: true,
              message: req.head.describle,
              type: "error",
            });
          }
        });
      };
      input.click();
    },
    // 预览文件
    previewDocument(item,index) {
      let url = newHttpConfig.previewUrl
      window.open(url + '/onlinePreview?url='+encodeURIComponent(this.$Base64.encode(item.url)))
    },
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
    box-shadow: 0 0 13px 3px rgba(0, 0, 0, 0.2);
  }
}
</style>
