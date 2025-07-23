<template>
  <div class="accident-data" style="height: 470px; overflow-x: hidden">
    <div class="show-flex-box-c" style="margin-bottom: 30px" v-loading="accidentDataImageLoading">
      <!-- <div class="show-flex-box-r">
        <i style="float:left;width: 6px;height: 18px; background: #409EFF;"></i> 
        <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:16px;font-weight:bold">事故现场图片</p>
      </div> -->
      <span style="margin-bottom: 20px; color: #33333385; font-size: 14px">
        仅支持上传jpg/png格式文件，单个文件不能超过500kb
      </span>
      <div style="min-height: 150px">
        <!-- <image-list-upload
          ref="laborInfo"
          :action="'/api/ERPWeb/AccidentManage/UploadPicture'"
          :imgData='accidentData'
          :picturePathList="picturePathList"
          :disabled="curChangeType == 'detail'"
          :imageHeight="350"
          :isShowRemark="false"
          :ImageBoxName="'accidentData'"
          :maxUpLoadNum="50"
          @on-add-img ='addAccidentImg(arguments)'
          @on-del ='deleteImg(arguments)'  
          @on-del-all ='deleteAllImg'
        ></image-list-upload> -->

        <image-file-upload
          :isShowFiles="false"
          showTitle="事故现场图片"
          :images="picturePathList"
          :multiple="false"
          :maxUpLoadNum="50"
          @images-add="imagesUpdateSuccess"
          @image-del="delImage"
        ></image-file-upload>
      </div>
      <!-- <div style="height: 350px;" v-if="curChangeType=='detail' && accidentData.length == 0">
         <el-empty description="暂无事故现场图片"></el-empty>
       </div> -->
    </div>

    <div class="show-flex-box-c">
      <div class="show-flex-box-r">
        <i style="float: left; width: 6px; height: 18px; background: #409eff"></i>
        <p
          style="
            margin-left: 15px;
            margin-bottom: 15px;
            color: #409eff;
            font-size: 16px;
            font-weight: bold;
          "
        >
          相关资料
        </p>
      </div>
      <!-- <span style="margin-bottom:20px; color:#33333385; font-size: 14px;"></span> -->
      <el-upload
        class="upload-demo"
        ref="uploadDocomnet"
        action="string"
        :on-change="handlePreview"
        :on-remove="handleRemove"
        accept=".rar,.zip,.doc,.docx,.pdf "
        :auto-upload="false"
      >
        <el-button
          slot="trigger"
          size="small"
          type="primary"
          class="el-icon-upload"
          :disabled="curChangeType == 'detail'"
        >
          上传文件
        </el-button>
        <div slot="tip" class="el-upload__tip">
          支持格式：.rar .zip .doc .docx .pdf ，单个文件不能超过20MB，最多只能保存5个文件
        </div>
      </el-upload>
      <ul class="document-content show-flex-box-c" v-loading="accidentDataDocumentLoading">
        <li class="show-flex-box-r" v-for="(item, index) in fileLists" :key="index">
          <span class="show-flex-box-r">
            <i class="el-icon-document-remove" style="margin-right: 6px; font-size: 16px"></i>
            <span>{{ item.name }}</span>
          </span>
          <strong class="show-flex-box-r">
            <el-button type="text" @click="downloadDocument(item)">下载</el-button>
            <el-button type="text" @click="previewFile(item)">预览</el-button>
            <el-button
              type="text"
              :disabled="curChangeType == 'detail'"
              @click="deleteDocument(item, index)"
            >
              删除
            </el-button>
          </strong>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getUser, getSession } from '@/utils/auth'
import imageListUpload from '@/components/imageListUpload'
import imageFileUpload from '@/components/imageFileUpload/index'

export default {
  components: {
    imageListUpload,
    imageFileUpload
  },
  props: {
    accidentRecordId: [Number, String],
    curChangeType: {
      type: String,
      default: 'edit'
    }
  },
  data() {
    return {
      formData: {},
      rules: {},
      accidentData: [],
      picturePathList: [],
      fileLists: [],
      limitNum: 5,
      selectedId: '',
      accidentDataImageLoading: false,
      accidentDataDocumentLoading: false,
      accidentDataImageList: [],
      selectedDataId: [], //选中的事故资料ID
      fileDocumentIndex: -1,
      isEdit: false
    }
  },
  methods: {
    // 重置信息
    resetData() {},
    // 数据回显
    setData(val) {
      this.selectedId = val.i_id
      this.reqAccidentData(1)
      this.reqAccidentData(2)
    },
    // 获取事故资料
    reqAccidentData(type) {
      if (type == 1) {
        this.accidentDataImageLoading = true
      } else {
        this.accidentDataDocumentLoading = true
      }
      let parmas = {
        id: this.selectedId,
        type: type
      }
      this.$client.queryAccidentData(parmas).then(res => {
        if (res.head.result == '200') {
          if (type == 1) {
            this.accidentData = this.bulidDataList(res.context, type)
            this.picturePathList = this.bulidPicturePathList(res.context)
            this.accidentDataImageLoading = false
            console.log(this.accidentData)
          } else {
            this.fileLists = this.bulidDataList(res.context, type)
            this.accidentDataDocumentLoading = false
          }
        } else {
          if (type == 1) {
            this.accidentData = []
            this.accidentDataImageLoading = false
          } else {
            this.fileLists = []
            this.accidentDataDocumentLoading = false
          }
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    bulidDataList(list, type) {
      let newList = []
      list.forEach((item, index) => {
        let obj = {
          id: item.i_id,
          file_id: item.file_id,
          name: item.c_name,
          isStore: false
        }
        if (type == 1) {
          obj.image_path = item.c_path
        } else {
          obj.path = item.c_path
        }
        newList.push(obj)
      })

      return newList
    },
    bulidPicturePathList(list) {
      let pathList = []
      list.forEach((item, index) => {
        pathList.push(item.c_path)
      })

      return pathList
    },
    // 添加
    imagesUpdateSuccess(info) {
      this.addAccidentImg([info.url])
    },
    // 删除
    delImage(info) {
      this.accidentData.forEach(item => {
        if (item.image_path == info) {
          this.selectedDataId = [item.id]
        }
      })
      this.sureDeleteAccidentData(1)
    },
    // 添加图片
    addAccidentImg(msg) {
      // console.log('图片',JSON.stringify(msg) ,msg)
      let parmas = {
        context: {
          i_main_id: this.selectedId,
          c_path: msg[0],
          c_name: '事故资料图片',
          i_type: 1
        }
      }
      this.$client.addAccidentData(parmas).then(res => {
        if (res.head.result == '200') {
          this.reqAccidentData(1)
          // this.$message({
          //   showClose: true,
          //   message: res.head.describle,
          //   type: "success",
          // });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    // 删除图片
    deleteImg(msg) {
      //  console.log(msg[0],msg[1])
      this.selectedDataId = []
      this.selectedDataId.push(msg[0].id)
      this.sureDeleteAccidentData(1)
    },
    // 删除所有图片
    deleteAllImg(val) {
      // console.log(val,this[`${val}`])
      this.selectedDataId = []
      this[`${val}`].forEach((item, index) => {
        this.selectedDataId.push(item.id)
      })
      this.sureDeleteAccidentData(1)
    },
    // 批量删除
    sureDeleteAccidentData(type) {
      if (this.selectedDataId.length > 0) {
        let parmas = {
          context: this.selectedDataId
        }
        this.$client.batchDeleteAccidentData(parmas).then(res => {
          if (res.head.result == '200') {
            this.reqAccidentData(type)
            // 清除点击放大图片地址
            if (this.type == 1) {
              this.picturePathList = []
            } else {
              // 清除一下 limitNum 最大限制文件格式
              if (this.fileDocumentIndex != -1) {
                this.$refs.uploadDocomnet.uploadFiles.splice(this.fileDocumentIndex, 1)
              }
            }
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'success'
            })
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'error'
            })
          }
        })
      }
    },
    // 判断文件大小
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 20
      if (isLt1M) {
        return true
      }
      this.$message({ type: 'error', message: '请不要上传大小超过20M的文件', showClose: true })
      return false
    },
    // 上传事故相关资料
    handlePreview(file) {
      if (this.fileLists.length > 4) {
        this.$message({ type: 'warning', message: '最多只能上传五个文件', showClose: true })
        return
      }
      if (this.beforeUpload(file)) {
        this.uploadAccidentDataFiles(file)
      }
    },
    // 上传相关资料文件
    uploadAccidentDataFiles(file) {
      // let parmas ={
      //   file: file.row
      // };
      console.log(file)
      let formData = new FormData()
      formData.append('file', file.raw)

      let params = {
        file: formData
      }
      let fileName = file.name
      this.$client.AddTxtfileUpload(params).then(res => {
        if (res.head.result == '200') {
          let filePath = res.context
          let file_id = res.file_id
          this.saveAccidentDataFiles(filePath, fileName, file_id)
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    // 保存相关事故资料
    saveAccidentDataFiles(filePath, fileName, file_id) {
      let parmas = {
        context: {
          i_main_id: this.selectedId,
          c_path: filePath,
          c_name: fileName,
          file_id: file_id,
          i_type: 2
        }
      }
      this.$client.addAccidentData(parmas).then(res => {
        if (res.head.result == '200') {
          this.reqAccidentData(2)
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    // 删除事故相关资料
    handleRemove(file, fileList) {
      console.log(file, fileList)
      // this.$emit('on-reset')
    },
    // 下载文件
    downloadDocument(item) {
      // console.log(item)
      window.location.href = item.path
      this.$message({ type: 'success', message: '下载成功' })
    },
    // 删除文件
    deleteDocument(item, index) {
      this.fileDocumentIndex = index
      this.selectedDataId = []
      this.selectedDataId.push(item.id)
      if (this.selectedDataId.length > 0) {
        this.sureDeleteAccidentData(2)
      }
      // this.fileLists.splice(index, 1)
      // this.$refs.uploadDocomnet.uploadFiles.splice(index, 1)
    },
    // 预览文件
    previewFile(item) {
      console.log(item)
      let userInfo = JSON.parse(getUser())
      let url = ''
      if (!item.name) {
        this.$message({ type: 'warning', message: '文件格式错误', showClose: true })
        return
      }
      item.file_extension = item.name.split('.').pop()
      if (!item.file_extension) {
        this.$message({ type: 'warning', message: '文件格式错误', showClose: true })
        return
      }
      if (item.file_extension == 'rar' || item.file_extension == 'zip') {
        url =
          newHttpConfig.previewUrl +
          '/onlinePreview?url=' +
          encodeURIComponent(this.$Base64.encode(item.url))
      } else {
        url =
          newHttpConfig.previewFile +
          '/index.html' +
          `?isEdit=${this.isEdit}&user=${userInfo.user_id}&token=${getSession()}&file_id=${
            item.file_id
          }&type=${item.file_extension}`
      }
      window.open(url)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.accident-data /deep/ .el-input {
  width: 480px;
}

.accident-data /deep/ .el-input--mini {
  width: 480px;
}

.accident-data /deep/ .el-date-editor {
  width: 480px;
}
.document-content{
  padding: 0 4px 40px;

  // width: 100%;
  >li{
    width: 60%;
    // padding: 8px 0;
    justify-content: space-between;
    align-items: center;
    border-bottom: 3px solid #19be6b;
  }
}
.accident-data /deep/ .el-upload-list{
  display: none
}
</style>
