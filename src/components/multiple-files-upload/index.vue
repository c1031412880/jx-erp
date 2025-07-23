<!--  -->
<template>
  <div class="multiple-files-upload" :class="{'none-multiple-files-upload': disabled}">
    <el-upload
      class="upload-demo"
      ref="uploadDocomnet"
      action="string"
      :on-change="handlePreview"
      :accept="acceptType"
      :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary" class="el-icon-upload" :disabled="disabled" v-if="!disabled">上传文件</el-button>
      <div slot="tip" class="el-upload__tip" v-if="!disabled">支持格式：{{acceptType}},单个文件不能超过{{maxUpLoadSize}}MB{{`${maxUpLoadNum>999?'':`，最多只能保存${maxUpLoadNum}个文件`}`}}</div>
    </el-upload>
    <ul class="document-content show-flex-box-c" v-loading="uploadDocumentLoading">
      <li class="show-flex-box-r" style="margin-bottom:10px;" v-for="(item,index) in upLoadFilesList" :key="index">
        <span class="show-flex-box-r" style="align-items: center;">
          <i class="el-icon-document-remove" style="margin-right:6px; font-size: 16px"></i>
          <span>{{item.name || item.file_name}}</span> 
        </span>
        <strong class="show-flex-box-r">
          <el-button type="text" @click="viewLoadDocument(item)">预览</el-button>
          <el-button type="text" @click="downloadDocument(item)">下载</el-button>
          <el-button type="text" @click="deleteDocument(item,index)" :disabled="disabled" v-if="!disabled">删除</el-button>
        
        </strong>
      </li>
    </ul>
  </div>
</template>

<script>
import {getUser, getSession} from '@/utils/auth'
export default {
  components: {},
  props:{
    // uploadDocumentLoading:{
    //   type: Boolean,
    //   default: false
    // },
    contentType: {
      type:[String,Number],
      default:'',
    },
    disabled:{
      type: Boolean,
      default: false
    },
    acceptType:{
      type: String,
      default: '.jpg,.jpeg,.png,.rar,.zip,.doc,.docx,.pdf,.xls,.xlsx'
    },
    filesList:{
      type: Array,
      default: () =>[]
    },
    maxUpLoadSize: {
      type: [Number,String],
      default: 10
    },
    maxUpLoadNum: {
      type: [Number,String],
      default: 5
    },
    isPreviewable: {
      type: Boolean,
      default: false
    },
    type: {  //type等于1是保留原文件名
      type: [Number,String],
      default: ''
    },
  },
  data() {
    return {
      uploadDocumentLoading: false,
      upLoadFilesList:[]
    };
  },
  computed: {},
  watch: {
    filesList: {
      deep: true,
    　handler(newValue, oldValue) {
        // console.log(newValue)
        if(newValue && newValue.length) {
          this.upLoadFilesList = [...newValue]
        }else{
          this.upLoadFilesList = []
        }
    　}
   },
  },
  mounted() {
    this.upLoadFilesList = [...this.filesList]
  },
  methods: {
    // 判断文件大小
    beforeFileUpload (file) {
      const isLt1M =  5 / 1024 < (file.size / 1024 / 1024) &&  (file.size / 1024 / 1024) < Number(this.maxUpLoadSize)
      if (isLt1M) {
        return true
      }
      this.$message({type: 'error', message: `请选择上传文件大小在5KB到${this.maxUpLoadSize}M之间的文件`, showClose: true})
      return false
    },
    // 判断文件类型
    beforeUploadFileType(file) {
      console.log(file)
      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase()
      if(this.acceptType.indexOf(fileSuffix) === -1) {
        this.$message({type: 'warning', message: `只能上传${this.acceptType}类型的文件`, showClose: true})
        return false
      }else{
        return true
      }
    },
    // 上传资料
    handlePreview(file) {
      
      if(this.upLoadFilesList.length > (this.maxUpLoadNum -1)) {
         this.$message({type: 'warning', message: `最多只能上传${this.maxUpLoadNum}个文件`, showClose: true})
        return
      }
      if (this.beforeFileUpload(file) && this.beforeUploadFileType(file)) {
        this.uploadAccidentDataFiles(file)
      }
    },
    // 上传相关资料文件
    uploadAccidentDataFiles(file) {
       // let parmas ={
      //   file: file.row
      // };
      console.log(file)
      let formData = new FormData();
      formData.append("file", file.raw);

      if(!!this.type) {
        formData.append("type", this.type);
      }

      let fileName = file.name;
      let size = (file.size /1024/1024).toFixed(2);
      if(!this.isPreviewable) {
        
        let params = {
          file: formData,
        };
        this.$client.AddTxtfileUpload(params).then(res => {
          if(res.head.result == "200") {
            let fileObj = {
              name: fileName,
              url: res.context,
              size: size,
              file_id: res.file_id
            }
            this.upLoadFilesList.push(fileObj);
            this.$emit('upload-update-success', this.upLoadFilesList, this.contentType)
  
            this.$message({
              showClose: true,
              message: "上传成功",
              type: "success"
            });
          }else{
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
      }else{
        this.$client.UploadOnlineFileDataBase(formData).then(res => {
          if(res.head.result == "200") {
            let fileObj = {
              name: fileName,
              url: res.context,
              size: size,
              file_id: res.file_id
            }
            this.upLoadFilesList.push(fileObj);
            this.$emit('upload-update-success', this.upLoadFilesList, this.contentType)
  
            this.$message({
              showClose: true,
              message: "上传成功",
              type: "success"
            });
          }else{
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
      }
    },
    viewLoadDocument(item) {
      let userInfo = JSON.parse(getUser())
      let token = getSession()
      let file_extension = (item.url.split('.')).pop().toLowerCase()
      let urlHttp = ''
      if(file_extension == 'rar' || file_extension == 'zip') {
        urlHttp = newHttpConfig.previewUrl +  '/onlinePreview?url='+encodeURIComponent(this.$Base64.encode(item.url))
      }else {
        urlHttp = newHttpConfig.previewFile + '/index.html' + `?isEdit=true&user=${userInfo.user_id}&token=${token}&file_id=${item.file_id}&type=${file_extension}`
      }
      window.open(urlHttp)
    },
    // 下载文件
    downloadDocument(item) {
      let arr = item.url.split("/")
      let fileName = arr[arr.length - 1].slice(10)
      this.download(item.url, fileName)
      this.$message({type: 'success', message: '下载成功'})
      // window.location.href = item.url
      // this.$message({type: 'success', message: '下载成功'})
    },
    download(url, fileName) {
      let token = getSession()
      var xml = new XMLHttpRequest()
      xml.open('GET', url, true)
      xml.setRequestHeader('Authorization', token)
      xml.responseType = 'blob'
      xml.onload = function() {
        var url = window.URL.createObjectURL(xml.response)
        var a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
      }
      xml.send()
    },
    // 删除文件
    deleteDocument(item,index) {
      this.upLoadFilesList.splice(index, 1)
      this.$refs.uploadDocomnet.uploadFiles.splice(index, 1)
      this.$emit('upload-update-success', this.upLoadFilesList, this.contentType)
    },
  },
};
</script>
<style lang='stylus' rel='stylesheet/stylus' scoped>
  .multiple-files-upload {

  }

  .document-content{
    padding: 5px 4px 40px;
  
  // width: 100%;
  >li{
    width: 100%;
    // padding: 8px 0;
    justify-content: space-between;
    align-items: center;
    border-bottom: 3px solid #19be6b;
  }
}
.multiple-files-upload /deep/ .el-upload-list{
  display: none
}
.none-multiple-files-upload /deep/ .upload-demo{
  display: none;
}
</style>