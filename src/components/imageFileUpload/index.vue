<template>
<!-- 批量上传图片文件 -->
  <div class="image-file-upload">
    <div class="upload-btn">
      <div class="on-upload show-flex-box-r">
        <div class="no-upload"
          >{{showTitle}}
          <span 
            v-show="!isShowBox && !imagesList.length && !filesList.length"
            style="color: #999999">暂无图片和文件</span>
        </div>
        <div class="show-flex-box-r" v-loading="loading" v-if="isShowBox">
          <el-upload
            v-if="isShowImages"
            ref="imagesUpload"
            action="string"
            :multiple="multiple"
            :on-change="imagesHandlePreview"
            :accept="imagesType"
            :auto-upload="false"
            :show-file-list="false"
            style="margin-right: 10px;">
            <el-button slot="trigger" size="small" icon="el-icon-picture">图片</el-button>
          </el-upload>
          <el-upload
            v-if="isShowFiles"
            ref="fileUpload"
            action="string"
            :multiple="multiple"
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
            <safe-image :preList="setSrcList(imagesList)" :imgUrl="Object.prototype.toString.call(item) === '[object Object]' ? (!!item.thumbnail_url ? item.thumbnail_url : item.url) : item" :authToken="token"></safe-image>
            <el-tooltip v-if="isShowBox" effect="light" content="删除" placement="top">
              <img 
                class="del-font" 
                :src="require('../../assets/approverStepIcon/liuchen5.png')" 
                @click="deleteImage(item,index)" 
                alt="">
            </el-tooltip>
            <div class="original-drawing" @click="showOriginal(!!item.url ? item.url : item)" v-if="item.thumbnail_url && isShowOriginal">查看原图</div>
            <div class="image-name" v-if="showImageName" :title="getImageName(item)">{{getImageName(item)}}</div>
          </li>
          <li class="image-pro" v-show="isShowImagePro">
            <el-progress type="circle" :percentage="upLoadPro" :stroke-width="6"></el-progress>
          </li>
        </ul>
        <ul class="file-list">
          <li class="file-item" v-for="(zItem,zIndex) in filesList" :key="zItem.url">
            <div>
              <i class="el-icon-document-checked" style="color: #09F91D;"></i>
              <span>{{setFileName(zItem.name || zItem.file_name)}}</span>
            </div>
            <div class="file-btn">
              <el-tooltip effect="dark" v-if="isShowBox" content="删除" placement="top">
                <i class="el-icon-delete" @click="deleteFile(zItem, zIndex)"></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="下载" placement="top">
                <i class="el-icon-download" @click="downloadFile(zItem,zIndex)"></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="预览" placement="top" v-if="isPreview">
                <i class="el-icon-view" @click="previewFile(zItem,zIndex)"></i>
              </el-tooltip>
            </div>
          </li>
          <li class="file-pro" v-show="isShowFilePro">
            <i class="el-icon-document-checked"></i>
            <span>{{file_name}}</span>
            <el-progress :percentage="upLoadPro" :stroke-width="6"></el-progress>
          </li>
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
import safeImage from "@/components/image-box/component/safe-image"
export default {
  components: {ElImageViewer, safeImage},
  props: {
    showTitle: {
      type: String,
      default: '图片和文件:'
    },
    isShowBox: { //编辑用 改为false
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
      default: 30
    },
    maxUpLoadSize: { //最大上传size
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
    isShowOriginal: {   // 是否显示 查看原图按钮
      type: Boolean,
      default: true
    },
    isEdit:{    // 文档是否可编辑
      type: Boolean,
      default: false
    },
    isShowImages: {     // 是否显示图片上传
      type: Boolean,
      default: true
    },
    isShowFiles: {      // 是否显示文件上传
      type: Boolean,
      default: true
    },
    isPreview: {      // 能否预览
      type: Boolean,
      default: true
    },
    multiple: {      // 是否支持多选
      type: Boolean,
      default: true
    },
    showImageName: {    // 是否显示图片名称
      type: Boolean,
      default: false
    },
  },
  watch: {
    images: {
      deep: true,
      immediate: true,
      handler(newValue=[], oldValue) {
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
      imagesList: [],
      filesList: [],
      eachSize: 1 * 1024 * 1024,  //切片大小
      loading: false, //上传loading
      downLoading: false,
      showViewer: false,
      original_url: [],
      token: '',
      waitFiles: [], // 存储待上传的文件列表
      currentIndex: 0, // 当前正在上传的文件索引
      onOff: false,
      //大文件上传时进度显示
      file_name: '',
      isShowImagePro: false,
      isShowFilePro: false,
      upLoadPro: 0,
      imgKey: null,
    }
  },
  mounted() {
    this.token = getSession()
  },
  methods: {
    closeViewer() {
      this.showViewer = false
    },
    showOriginal(url) {
      console.log(url,'url原图');
      this.original_url = [url]
      this.showViewer = true
    },
    // 自定义上传图片
    imagesHandlePreview(file) {
      this.formType = 0
      this.waitFiles.push(file)
      if(this.onOff) return false
      this.onOff = true
      this.upLoadValidate()
    },
    // 检验文件大小格式等
    upLoadValidate() {
      const files = this.waitFiles;
      if (this.currentIndex >= files.length) {
        this.currentIndex = 0
        this.waitFiles = []
        this.onOff = false
        return; // 所有文件上传完毕
      }
      const file = files[this.currentIndex];
      if(this.beforeUploadMax() && this.beforeUploadSize(file) && this.beforeUploadType(file)) {
        try {
          if(this.formType) {
            this.seqFileUpload(file)
          }else {
            this.seqImageUpload(file)
          }
        } catch (e) {
          console.log(e);
        }
      }
    },
    // 图片上传
    seqImageUpload(file) {
      return new Promise(async (resolve, reject) => {
        try {
          let fileName = file.name;
          let size = (file.size /1024/1024).toFixed(2);
          console.log(fileName,file,size, '图片');
          let splitUploadSize = 5 * 1024 * 1024;
          if(file.size > splitUploadSize) {
            // 大文件分块上传
            const { eachSize } = this;
            const chunks = Math.ceil(file.size / eachSize);
            const fileChunks = this.splitFile(file, eachSize, chunks);
            let currentChunk = 0;
            this.loading = true
            for (let i = 0; i < fileChunks.length; i++) {
              if (currentChunk === i) {
                this.isShowImagePro = true
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
                let res = await this.NewUpLoadFileBreakPointResumeUpload(formData); 
                if(res.head.result == "200") {
                  this.upLoadPro += Math.round(100 / chunks)
                  if(currentChunk == fileChunks.length -1) {
                    this.isShowImagePro = false
                    this.upLoadPro = 0
                    let fileObj = {
                      name: fileName,
                      url: res.context[0].url,
                      thumbnail_url: res.context[0].thumbnail_url,
                      size: size
                    }
                    this.loading = false
                    this.imagesList.push(fileObj)
                    this.$emit('images-update-success', this.imagesList)
                    this.$emit('images-add', fileObj)
                    this.$message({
                      showClose: true,
                      message: `图片(${fileName})上传成功`,
                      type: "success"
                    });
                    this.currentIndex++
                    this.upLoadValidate()
                  }
                  currentChunk = i + 1;
                }else{
                  this.loading = false
                  this.$message({
                    showClose: true,
                    message: `图片(${fileName})上传失败，请从新上传未上传成功的图片`,
                    type: "error",
                  });
                  this.currentIndex++
                  this.upLoadValidate()
                }
              }
            }
          }else {
            // 小文件图片直接上传
            let formData = new FormData();
            formData.append("file", file.raw);
            let size = (file.size /1024/1024).toFixed(2);
            this.$client.uploadPicture({file: formData}, '/api/ERPWeb/PartyHonor/UploadPicture').then((req) => {
              if(req.head.result == "200") {
                let fileObj = {
                  name: fileName,
                  url: req.context,
                  size: size
                }
                this.imagesList.push(fileObj);
                this.$emit('images-update-success', this.imagesList)
                this.$emit('images-add', fileObj)
                this.$message({
                  showClose: true,
                  message: `图片(${fileName})上传成功`,
                  type: "success"
                });
                this.currentIndex++
                this.upLoadValidate()
              }else{
                this.$message({
                  showClose: true,
                  message: `图片(${fileName})上传失败，请从新上传未上传成功的图片`,
                  type: "error",
                });
                this.currentIndex++
                this.upLoadValidate()
              }
            });
          }
        } catch (e) {
          reject(e);
        }
      });
    },
    // 自定义上传文件
    fileHandlePreview(file) {
      this.formType = 1
      this.waitFiles.push(file)
      if(this.onOff) return false
      this.onOff = true
      this.upLoadValidate()
    },
    // 文件上传
    seqFileUpload(file) {
      return new Promise(async (resolve, reject) => {
        try {
          let fileName = file.name;
          this.file_name = file.name;
          let size = (file.size /1024/1024).toFixed(2);
          console.log(fileName,file,size, '文件');
          let splitFileName = fileName.split('.')
          let splitUploadSize = 5 * 1024 * 1024;
          if(file.size > splitUploadSize) {
            const { eachSize } = this;
            const chunks = Math.ceil(file.size / eachSize);
            const fileChunks = this.splitFile(file, eachSize, chunks);
            let currentChunk = 0;
            this.loading = true
            for (let i = 0; i < fileChunks.length; i++) {
              if (currentChunk === i) {
                this.isShowFilePro = true
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
                  this.upLoadPro += Math.round(100 / chunks)
                  if(currentChunk == fileChunks.length -1) {
                    this.isShowFilePro = false
                    this.upLoadPro = 0
                    let splitName = res.context[0].split('/')
                    let fileObj = {
                      name: splitName[splitName.length - 1],
                      url: Array.isArray(res.context) ? res.context[0] : res.context,
                      size: size,
                      id: res.file_id,
                      file_extension: splitFileName[splitFileName.length - 1],
                    }
                    this.loading = false
                    this.filesList.push(fileObj);
                    this.$emit('files-update-success', this.filesList)
                    this.$message({
                      showClose: true,
                      message: `文件(${fileName})上传成功`,
                      type: "success"
                    });
                    this.currentIndex++
                    this.upLoadValidate()
                  }
                  currentChunk = i + 1;
                }else{
                  this.loading = false
                  this.isShowFilePro = false
                  this.upLoadPro = 0
                  this.$message({
                    showClose: true,
                    message: `文件(${fileName})上传失败，请从新上传未上传成功的文件`,
                    type: "error",
                  });
                  this.currentIndex++
                  this.upLoadValidate()
                }
              }
            }
          }else {
            let formData = new FormData();
            formData.append("file", file.raw);
            this.loading = true
            this.$client.AddTxtfileUpload({file: formData}).then(res => {
              if(res.head.result == "200") {
                let splitName = res.context.split('/')
                this.loading = false
                let fileObj = {
                  name: splitName[splitName.length - 1],
                  url: res.context,
                  size: size,
                  id: res.file_id,
                  file_extension: splitFileName[splitFileName.length - 1],
                }
                this.filesList.push(fileObj);
                this.$emit('files-update-success', this.filesList)
                this.$message({
                  showClose: true,
                  message: `文件(${fileName})上传成功`,
                  type: "success"
                });
                this.currentIndex++
                this.upLoadValidate()
              }else{
                this.loading = false
                this.$message({
                  showClose: true,
                  message: `文件(${fileName})上传失败，请从新上传未上传成功的文件`,
                  type: "error",
                });
                this.currentIndex++
                this.upLoadValidate()
              }
            })
          }
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
    // 调用图片切片上传接口
    NewUpLoadFileBreakPointResumeUpload(formData) {
      return this.$client.NewUpLoadFileBreakPointResumeUpload(formData).then(res => res)
    },
    // 调用文件切片上传接口
    UpLoadFileBreakPointResumeUpload(formData) {
      return this.$client.UpLoadFileBreakPointResumeUpload(formData).then(res => res)
    },
    // 上传数量限制
    beforeUploadMax() {
      let num = !this.formType ? this.imagesList.length : this.filesList.length
      let name = !this.formType ? '图片' : '文件'
      if(num > (this.maxUpLoadNum -1)) {
        this.$message({type: 'warning', message: `最多只能上传${this.maxUpLoadNum}个${name},已上传${num}个${name}`, showClose: true})
        this.onOff = false
        if(!this.formType) {
          this.$refs.imagesUpload.uploadFiles.splice(this.currentIndex-1)
          // console.log(this.$refs.imagesUpload.uploadFiles);
        }else {
          this.$refs.fileUpload.uploadFiles.splice(this.currentIndex-1)
          // console.log(this.$refs.fileUpload.uploadFiles);
        }
        this.currentIndex = 0
        this.waitFiles = []
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
        this.$message({type: 'error', message: `请选择上传文件大小在5KB到${this.maxUpLoadSize}M之间的${name}, ${name}(${file.name})超过限制`, showClose: true})
        this.onOff = false
        if(!this.formType) {
          this.$refs.imagesUpload.uploadFiles.splice(this.currentIndex-1, 1)
          this.currentIndex++
          this.upLoadValidate()
        }else {
          this.$refs.fileUpload.uploadFiles.splice(this.currentIndex-1, 1)
          this.currentIndex++
          this.upLoadValidate()
        }
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
        this.$message({type: 'warning', message: `只能上传${type}类型的${name}, ${name}(${file.name})类型不符`, showClose: true})
        this.onOff = false
        if(!this.formType) {
          this.$refs.imagesUpload.uploadFiles.splice(this.currentIndex-1, 1)
          this.currentIndex++
          this.upLoadValidate()
        }else {
          this.$refs.fileUpload.uploadFiles.splice(this.currentIndex-1, 1)
          this.currentIndex++
          this.upLoadValidate()
        }
        return false
      }else{
        return true
      }
    },
    // 图片预览列表
    setSrcList(val) {
      let list = []
      val.forEach(item => {
        list.push(item.thumbnail_url ? item.thumbnail_url : item.url ? item.url : item)
      })
      return list
    },
    // 删除某一张图
    deleteImage(item,index) {
      this.imagesList.splice(index, 1)
      this.$refs.imagesUpload.uploadFiles.splice(index, 1)
      // console.log(index, this.imagesList, item);
      this.$emit('images-update-success', this.imagesList)
      this.$emit('image-del', item)
    },
    // 删除文件
    deleteFile(item,index) {
      this.filesList.splice(index, 1)
      this.$refs.fileUpload.uploadFiles.splice(index, 1)
      this.$emit('files-update-success', this.filesList)
      this.$emit('files-del', item)
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
      this.download(item.url, fileName)
    },
    download(url, fileName) {
      let xml = new XMLHttpRequest()
      xml.open('GET', url, true)
      xml.setRequestHeader('Authorization', this.token)
      xml.responseType = 'blob'
      let that = this
      // 设置头信息
      xml.onload = function() {
        console.log(xml,xml.size, '下载返回');
        if(xml.status === 200) {
          let url = window.URL.createObjectURL(xml.response)
          let a = document.createElement('a')
          a.href = url
          a.download = fileName
          a.click()
          that.downLoading = false
          that.$message.closeAll()
          that.$message({type: 'success', message: '下载成功'})
        }else {
          that.downLoading = false
          that.$message.closeAll()
          that.$message.error('下载失败，请联系开发人员')
        }
      }
      xml.send()
    },
    // 预览文件
    previewFile(item,index) {
      console.log(item);
      let userInfo = JSON.parse(getUser())
      let url = ''
      if(item.file_extension == 'rar' || item.file_extension == 'zip') {
        url = newHttpConfig.previewUrl +  '/onlinePreview?url='+encodeURIComponent(this.$Base64.encode(item.url))
      }else {
        url = newHttpConfig.previewFile + '/index.html' + `?isEdit=${this.isEdit}&user=${userInfo.user_id}&token=${this.token}&file_id=${item.id}&type=${item.file_extension}`
      }
      window.open(url)
    },
    setFileName(name) {
      return name.slice(10)
    },
    // 获取图片名称，处理没有name的情况
    getImageName(item) {
      // 如果是对象且有name属性
      if (Object.prototype.toString.call(item) === '[object Object]') {
        if (item.name) {
          return item.name
        } else if (item.file_name) {
          return item.file_name
        } else if (item.url) {
          // 从url中提取文件名
          const urlParts = item.url.split('/')
          const fileName = urlParts[urlParts.length - 1]
          return fileName.indexOf('.') > -1 ? fileName : '未命名图片'
        }
      } else if (typeof item === 'string') {
        // 如果是字符串（url），从url中提取文件名
        const urlParts = item.split('/')
        const fileName = urlParts[urlParts.length - 1]
        return fileName.indexOf('.') > -1 ? fileName : '未命名图片'
      }
      return '未命名图片'
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.image-file-upload
  width: 100%;
  .on-upload
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    .no-upload 
      font-family: Source Han Sans SC-Medium, Source Han Sans SC;
      font-size: 14px;
      font-weight: 700;
      color: #606266;
  .upload-list 
    width: 100%;
    max-height: 300px;
    overflow-y: auto;
    .image-list
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .image-item
        position: relative;
        width: 56px;
        height: 56px;
        margin: 10px 11px 26px 11px;
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
        .image-name
          position: absolute;
          bottom: -30px;
          left: 0;
          right: 0;
          font-size: 12px;
          color: #606266;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0 2px;
      .image-item:hover {
        .original-drawing {
          display: block;
        }
      }
      .image-pro
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 56px;
        margin: 10px 11px 20px 11px;
        background: #f5f7fa;
        border-radius: 5px;
    .file-list
      width: 100%;
      .file-pro
        font-size: 16px;
        margin: 10px 11px;
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


/deep/ .el-progress-circle
  width: 56px !important;
  height: 56px !important;
  margin: 10px 11px 20px 11px !important;
</style>

<style>
.el-image-viewer__wrapper {
  z-index: 9999 !important;
}
</style>