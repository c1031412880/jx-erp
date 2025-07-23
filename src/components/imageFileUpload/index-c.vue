<template>
<!-- 批量上传图片文件 -->
  <div class="image-file-upload">
    <div class="upload-btn">
      <div class="no-upload" v-if="(!isShowBox && imagesList.length) || (!isShowBox && filesList.length)">图片和文件</div>
      <div class="on-upload show-flex-box-r" v-if="isShowBox">
        <p class="on-upload-title">上传文件和图片</p>
        <div class="show-flex-box-r" v-loading="loading">
          <el-upload
            ref="imagesUpload"
            action="string"
            multiple
            :on-change="imagesHandlePreview"
            :accept="imagesType"
            :auto-upload="false"
            :show-file-list="false"
            style="margin-right: 10px;">
            <el-button slot="trigger" size="small" icon="el-icon-folder-opened">图片</el-button>
          </el-upload>
          <el-upload
            ref="fileUpload"
            action="string"
            multiple
            :on-change="fileHandlePreview"
            :accept="fileType"
            :auto-upload="false"
            :show-file-list="false">
            <el-button slot="trigger" size="small" icon="el-icon-folder-opened">文件</el-button>
          </el-upload>
        </div>
      </div>
      
      <div class="upload-list">
        <ul class="image-list">
          <li class="image-item" v-for="(item, index) in imagesList" :key="index">
            <el-image
              :ref="'image' + index"
              :fit="'fill'"
              :preview-src-list="setSrcList(imagesList)"
              :src="!!item.thumbnail_url ? item.thumbnail_url : !!item.url ? item.url : item"
              ></el-image>
              
              <el-tooltip v-if="isShowBox" effect="light" content="删除" placement="top">
                <img 
                  class="del-font" 
                  :src="require('../../assets/approverStepIcon/liuchen5.png')" 
                  @click="deleteImage(index)" 
                  alt="">
              </el-tooltip>
              <div class="original-drawing" @click="showOriginal(item.url)" v-if="item.thumbnail_url && isShowOriginal">查看原图</div>
          </li>
          <el-progress v-show="isShowPer" type="circle" :percentage="imagePer" :width="56" :stroke-width="4" :color="'#5cb87a'" style="margin: 10px;"></el-progress>
        </ul>
        <ul class="file-list">
          <li class="file-item" v-for="(zItem,zIndex) in filesList" :key="zItem.url">
            <div>
              <i class="el-icon-document-checked" style="color: #09F91D;"></i>
              <span>{{setFileName((zItem.name || zItem.file_name))}}</span>
            </div>
            <div class="file-btn">
              <el-tooltip effect="dark" v-if="isShowBox" content="删除" placement="top">
                <i class="el-icon-delete" @click="deleteFile(zItem, zIndex)"></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="下载" placement="top">
                <i class="el-icon-download" @click="downloadFile(zItem,zIndex)"></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="预览" placement="top">
                <i class="el-icon-view" @click="previewFile(zItem,zIndex)"></i>
              </el-tooltip>
            </div>
          </li>
          <div style="margin: 10px 11px;" v-show="isShowFilePer">
            <i class="el-icon-document-checked"></i>
            <span>{{file_name}}</span>
            <el-progress :percentage="filePer" :color="'#5cb87a'" :stroke-width="2"></el-progress>
          </div>
        </ul>
      </div>
    </div>
    <el-image-viewer 
      v-if="showViewer" 
      :on-close="closeViewer" 
      :url-list="original_url">
    ></el-image-viewer>
  </div>
</template>

<script type="text/ecmascript-6">
import {getUser, getSession} from '@/utils/auth'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  components: {ElImageViewer},
  props: {
    isShowBox: {
      type: Boolean,
      default: true
    },
    fileType:{
      type: String,
      default: '.rar,.zip,.doc,.docx,.pdf,.ppt,.xls,.xlsx'
    },
    imagesType:{
      type: String,
      default: '.png,.jpg,.jpeg,.jpe,.gif,.dxf,.dwg,.jp2,.tif,.tiff,.bmp', //图片类型 'image/*'
    },
    maxUpLoadNum: { // 最大上传数量
      type: [Number,String],
      default: 20
    },
    maxUpLoadSize: {
      type: [Number,String],
      default: 100
    },
    images: {
      type: Array,
      default:() => []
    },
    files: {
      type: Array,
      default:() => []
    },
    isCompress:{    // 是否进行图片压缩    返回格式会不一样
      type: Boolean,
      default: false
    },
    isShowOriginal: {   // 是否显示 查看原图按钮
      type: Boolean,
      default: false
    },
    isEdit:{    // 文档是否可编辑
      type: Boolean,
      default: false
    },
    // type: {  //type等于1是保留原文件名
    //   type: [Number,String],
    //   default: ''
    // },
  },
  watch: {
    images: {
      deep: true,
      immediate: true,
      handler(newValue=[], oldValue) {
        // console.log(newValue)
        if(newValue && newValue.length) {
          this.imagesList = [...newValue]
        }else{
          this.imagesList = []
        }
      }
    },
    files: {
      deep: true,
      immediate: true,
      handler(newValue=[], oldValue) {
        // console.log(newValue)
        if(newValue && newValue.length) {
          this.filesList = [...newValue]
        }else{
          this.filesList = []
        }
      }
    }
  },
  data() {
    return {
      formType: 0, // 上传类型，0.图片 1.文件
      imagesList: [
        // {
        //   url: 'http://124.221.93.130:7000/Files/Enterprise/PartyConstruction/Images/1682424163微信图片_202211071710092.jpg',
        //   name: '111'
        // },
      ],
      filesList: [
        // {
        //   url: 'http://124.221.93.130:7000/Files/LocalFiles/1682424397主动安全云平台报错接口.xlsx',
        //   name: '111'
        // },
      ],
      eachSize: 1 * 1024 * 1024,  //切片大小
      loading: false, //上传loading
      isShowPer: false, 
      imagePer: 60, //图片上传进度

      file_name: '',
      isShowFilePer: false,
      filePer: 30,
      downLoading: false,
      showViewer: false,
      original_url: []
    }
  },
  mounted() {

  },
  methods: {
    closeViewer() {
      this.showViewer = false
    },
    showOriginal(url) {
      this.original_url = [url]
      this.showViewer = true
    },
    // 自定义上传图片
    async imagesHandlePreview(file) {
      this.formType = 0
      if(this.beforeUploadMax() && this.beforeUploadSize(file) && this.beforeUploadType(file)) {
        let splitUploadSize = 5 * 1024 * 1024;
        const { splitUpload, singleUpload } = this;
        const uploadFunc =
          file.size > splitUploadSize ? splitUpload : singleUpload;
        try {
          await uploadFunc(file);
        } catch (e) {
          console.log(e);
        }
      }
    },
    // 大图片文件分块上传
    splitUpload(file) {
      return new Promise(async (resolve, reject) => {
        try {
          const { eachSize } = this;
          const chunks = Math.ceil(file.size / eachSize);
          const fileChunks = this.splitFile(file, eachSize, chunks);
          let size = (file.size /1024/1024).toFixed(2);
          let currentChunk = 0;
          let imageName = file.name;
          this.loading = true
          // this.imagePer = 0
          // this.isShowPer = true
          for (let i = 0; i < fileChunks.length; i++) {
            if (currentChunk === i) {
              let formData = new FormData();
              formData.append("file", fileChunks[i]);
              formData.append("md5_code", file.uid);
              formData.append("merge_name", file.name);
              formData.append("index", i + 1);
              formData.append("total", fileChunks.length);
              if(i < fileChunks.length -1) {
                formData.append("is_last", false);
              }else{
                formData.append("is_last", true);
              }
              let res = await this.UpLoadFileBreakPointResumeUpload(formData); 
              if(res.head.result == "200") {
                  // console.log(res)
                  // let each = Math.round(100/chunks)
                  // if((this.imagePer + each) >= 100) {
                  //   this.imagePer = 100
                  // }else {
                  //   this.imagePer += each
                  // }
                  if(currentChunk == fileChunks.length -1) {
                    let fileObj
                    if (this.isCompress) {
                      fileObj = {
                        name: imageName,
                        url: res.context[0],
                        thumbnail_url: res.context[1],
                        size: size
                      }
                    } else {
                      fileObj = {
                        name: imageName,
                        url: res.context[0],
                        size: size
                      }
                    }
                    this.loading = false
                    // this.isShowPer = false
                    this.imagesList.push(fileObj)
                    this.$emit('images-update-success', this.imagesList)
                    this.$message({
                      showClose: true,
                      message: `该(${file.name})图片上传成功`,
                      type: "success"
                    });
                  }
                  currentChunk = i + 1;
                }else{
                  this.loading = false
                  this.$message({
                    showClose: true,
                    message: `该(${file.name})图片上传失败，请从新上传未上传成功的图片`,
                    type: "error",
                  });
                }
            }
          }
        } catch (e) {
          reject(e);
        }
      });
    },
    // 小图片文件直接上传
    singleUpload(file) {
      // console.log(file);
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          formData.append("file", file.raw);
          let imageName = file.name;
          let size = (file.size /1024/1024).toFixed(2);
          this.$client.uploadPicture({file: formData}, '/api/ERPWeb/PartyHonor/UploadPicture').then((req) => {
            if(req.head.result == "200") {
              let fileObj = {
                name: imageName,
                url: req.context,
                size: size
              }
              this.imagesList.push(fileObj);
              this.$emit('images-update-success', this.imagesList)
              this.$message({
                showClose: true,
                message: `该(${imageName})图片上传成功`,
                type: "success"
              });
            }else{
              this.$message({
                showClose: true,
                message: `该(${imageName})图片上传失败，请从新上传未上传成功的图片`,
                type: "error",
              });
            }
          });
        } catch (e) {
          reject(e);
        }
      });
    },
    // 自定义上传文件
    async fileHandlePreview(file) {
      this.formType = 1
      console.log(file);
      if(this.beforeUploadMax() && this.beforeUploadSize(file) && this.beforeUploadType(file)) {
        let splitUploadSize = 5 * 1024 * 1024;
        const { splitFileUpload, singleFileUpload } = this;
        this.loading = true
        // this.filePer = 0
        // this.isShowFilePer = true
        const uploadFunc =
          file.size > splitUploadSize ? splitFileUpload : singleFileUpload;
        try {
          await uploadFunc(file);
        } catch (e) {
          console.log(e);
        }
      }
    },
    // 大文件分块上传
    splitFileUpload(file) {
      return new Promise(async (resolve, reject) => {
        try {
          // console.log(1,file);
          const { eachSize } = this;
          const chunks = Math.ceil(file.size / eachSize);
          const fileChunks = this.splitFile(file, eachSize, chunks);
          let size = (file.size /1024/1024).toFixed(2);
          let currentChunk = 0;
          let imageName = file.name;
          this.loading = true
          for (let i = 0; i < fileChunks.length; i++) {
            if (currentChunk === i) {
              let formData = new FormData();
              formData.append("file", fileChunks[i]);
              formData.append("md5_code", file.uid);
              formData.append("merge_name", file.name);
              formData.append("index", i + 1); 
              formData.append("total", fileChunks.length);
              if(i < fileChunks.length -1) {
                formData.append("is_last", false);
              }else{
                formData.append("is_last", true);
              }
              let res = await this.UpLoadFileBreakPointResumeUpload(formData); 
              if(res.head.result == "200") {
                // let each = Math.round(100/chunks)
                // if((this.filePer + each) >= 100) {
                //   this.filePer = 100
                // }else {
                //   this.filePer += each
                // }
                if(currentChunk == fileChunks.length -1) {
                  let splitFile = res.context[0].split('.')
                  let splitFileName = res.context[0].split('/')
                  let fileObj = {
                    name: splitFileName[splitFileName.length - 1],
                    url: Array.isArray(res.context) ? res.context[0] : res.context,
                    size: size,
                    id: res.file_id,
                    file_extension: splitFile[splitFile.length - 1],
                  }
                  this.loading = false
                  // this.isShowFilePer = false
                  this.filesList.push(fileObj);
                  this.$emit('files-update-success', this.filesList)
                  this.$message({
                    showClose: true,
                    message: `该(${imageName})文件上传成功`,
                    type: "success"
                  });
                }
                currentChunk = i + 1;
              }else{
                this.loading = false
                this.$message({
                  showClose: true,
                  message: `该(${imageName})文件上传失败，请从新上传未上传成功的文件`,
                  type: "error",
                });
              }
            }
          }
        } catch (e) {
          reject(e);
        }
      });
    },
    // 小文件直接上传
    singleFileUpload(file) {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          formData.append("file", file.raw);
          let fileName = file.name;
          let size = (file.size /1024/1024).toFixed(2);
          this.loading = true
          this.$client.AddTxtfileUpload({file: formData}).then(res => {
            if(res.head.result == "200") {
              this.loading = false
              let splitFile = res.context.split('.')
              let splitFileName = res.context.split('/')
              let fileObj = {
                name: splitFileName[splitFileName.length - 1],
                url: res.context,
                size: size,
                id: res.file_id,
                file_extension: splitFile[splitFile.length - 1],
              }
              this.filesList.push(fileObj);
              this.$emit('files-update-success', this.filesList)
              this.$message({
                showClose: true,
                message: `该(${fileName})文件上传成功`,
                type: "success"
              });
            }else{
              this.loading = false
              this.$message({
                showClose: true,
                message: `该(${fileName})文件上传失败，请从新上传未上传成功的文件`,
                type: "error",
              });
            }
          })
        } catch (e) {
          reject(e);
        }
      });
    },
    // 文件分块,利用Array.prototype.slice方法
    splitFile(file, eachSize, chunks) {
      const fileChunk = [];
      for (let chunk = 0; chunks > 0; chunks--) {
        fileChunk.push(file.raw.slice(chunk, chunk + eachSize));
        chunk += eachSize;
      }
      return fileChunk;
    },
    // 调用切片上传接口
    UpLoadFileBreakPointResumeUpload(formData) {
      // for(let b of formData) {
      //   console.log(b);
      // }
     return this.$client.UpLoadFileBreakPointResumeUpload(formData).then(res => res)
    },
    // 上传数量限制
    beforeUploadMax() {
      let num = !this.formType ? this.imagesList.length : this.filesList.length
      let name = !this.formType ? '图片' : '文件'
      if(num > (this.maxUpLoadNum -1)) {
        this.$message({type: 'warning', message: `最多只能上传${this.maxUpLoadNum}个${name},已上传${num}个${name}`, showClose: true})
        return false
      }else {
        return true
      }
    },
    // 上传size大小限制
    beforeUploadSize(file) {
      const isLt1M =  5 / 1024 < (file.size / 1024 / 1024) &&  (file.size / 1024 / 1024) < Number(this.maxUpLoadSize)
      let name = !this.formType ? '图片' : '文件'
      if (!isLt1M) {
        this.$message({type: 'error', message: `请选择上传文件大小在5KB到${this.maxUpLoadSize}M之间的${name}, 该(${file.name})${name}超过限制`, showClose: true})
        return false
      }else {
        return true
      }
    },
    // 上传类型限制
    beforeUploadType(file) {
      let type = !this.formType ? this.imagesType : this.fileType
      let name = !this.formType ? '图片' : '文件'
      const fileSuffix = (file.name.substring(file.name.lastIndexOf(".") + 1)).toLowerCase()
      if(type.indexOf(fileSuffix) === -1) {
        this.$message({type: 'warning', message: `只能上传${type}类型的${name}, 该(${file.name})${name}类型不符`, showClose: true})
        return false
      }else{
        return true
      }
    },
    // 图片预览列表
    setSrcList(val) {
      let list = []
      val.forEach(item => {
        if (this.isCompress) {
          list.push(item.thumbnail_url ? item.thumbnail_url : item.url ? item.url : item)
        } else {
          list.push(item.url ? item.url : item)
        }
      })
      return list
    },
    // 删除某一张图
    deleteImage(index) {
      this.imagesList.splice(index, 1)
      this.$refs.imagesUpload.uploadFiles.splice(index, 1)
      this.$emit('images-update-success', this.imagesList)
    },
    // 删除文件
    deleteFile(item,index) {
      this.filesList.splice(index, 1)
      this.$refs.fileUpload.uploadFiles.splice(index, 1)
      this.$emit('files-update-success', this.filesList)
    },
    // 下载文件
    downloadFile(item,index) {
      if(this.downLoading) {
        this.$message({type: 'warning', message: '正在下载，请稍候'})
        return
      }
      this.downLoading = true
      this.$message({type: 'warning', message: '下载中，请稍候',duration: 0})
      let arr = item.url.split("/")
      let fileName = arr[arr.length - 1].slice(10)
      // let url = 'http://122.225.198.118:5000/wwwroot/Files/LocalFiles/1682477564%E4%B8%BD%E6%B0%B4.docx'
      this.download(item.url, fileName)
    },
    download(url, fileName) {
      var xml = new XMLHttpRequest()
      xml.open('GET', url, true)
      xml.responseType = 'blob'
      let that = this
      xml.onload = function() {
        var url = window.URL.createObjectURL(xml.response)
        var a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
        // console.log(this, that, that.$message);
        that.disLoad()
      }
      xml.send()
    },
    disLoad() {
      this.downLoading = false
      this.$message.closeAll()
      this.$message({type: 'success', message: '下载成功'})
    },
    setFileName(name) {
      return name.slice(10)
    },
    // 预览文件
    previewFile(item,index) {
      console.log(item);
      let userInfo = JSON.parse(getUser())
      let token = getSession()
      let url = ''
      if(item.file_extension == 'rar' || item.file_extension == 'zip') {
        url = newHttpConfig.previewUrl +  '/onlinePreview?url='+encodeURIComponent(this.$Base64.encode(item.url))
      }else {
        url = newHttpConfig.previewFile + '/index.html' + `?isEdit=${this.isEdit}&user=${userInfo.user_id}&token=${token}&file_id=${item.id}&type=${item.file_extension}`
      }
      window.open(url)
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.image-file-upload
  width: 100%;
  .no-upload 
    font-family: Source Han Sans SC-Medium, Source Han Sans SC;
    font-size: 12px;
    font-weight: 400;
    color: #999999;
  .on-upload
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    .on-upload-title
      font-size: 14px;
      font-weight: bold;
      color: #333333;
  .upload-list 
    width: 100%;
    max-height: 300px;
    overflow-y: auto;
    .image-list
      width: 100%;
      // max-height: 155px;
      display: flex;
      flex-wrap: wrap;
      // overflow-y: auto;
      .image-item
        position: relative;
        width: 56px;
        height: 56px;
        margin: 10px 11px 20px 11px;
        /deep/ .el-image
          width: 100%;
          height: 100%;
          border-radius: 5px;
        .del-font
          position: absolute;
          width: 18px;
          height: 18px;
          top: -6px;
          right: -6px;
          cursor: pointer;
          z-index: 666;
        .original-drawing
          display: none; 
          text-align: center;
          font-size: 12px;
          color: #409EFF;
          cursor: pointer;
      .image-item:hover {
        .original-drawing {
          display: block;
        }
      }
    .file-list
      width: 100%;
      // max-height: 144px;
      // overflow-y: auto;
      .file-item
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 10px 11px;
        padding-bottom: 4px;
        border-bottom: 2px solid #E9E9E9;
        span, i
          font-size: 16px;
          font-weight: 400;
          color: #333333;
        .file-btn > i
          margin: 0 5px;
          font-size: 18px;
          cursor: pointer;
        .file-btn > i:hover
            color: #66b1ff;
</style>

<style>
.el-image-viewer__wrapper {
  z-index: 9999 !important;
}
</style>