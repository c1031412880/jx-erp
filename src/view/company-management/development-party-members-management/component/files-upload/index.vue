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
      <div slot="tip" class="el-upload__tip" v-if="!disabled">支持格式：{{acceptType}},单个文件不能超过{{maxUpLoadSize}}MB，最多只能保存{{maxUpLoadNum}}个文件</div>
    </el-upload>
    <ul class="document-content show-flex-box-c" v-loading="uploadDocumentLoading">
      <li class="show-flex-box-r" style="margin-bottom:10px;" v-for="(item,index) in filesList" :key="index">
        <span class="show-flex-box-r" style="align-items: center;">
          <i class="el-icon-document-remove" style="margin-right:6px; font-size: 16px"></i>
          <span style="font-size: 12px; color:#999999">{{item.name}}</span> 
        </span>
        <strong class="show-flex-box-r">
          <el-button type="text" @click="downloadDocument(item)">下载</el-button
          >
          <el-button type="text" @click="deleteDocument(item,index)" :disabled="disabled" v-if="!disabled">删除</el-button>
        
        </strong>
      </li>
    </ul>
  </div>
</template>

<script>
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
    documentType: {  //发展党员中的文档类型  （发展党员专用）
      type: [Number,String],
      default: ''
    },
  },
  data() {
    return {
      uploadDocumentLoading: false,
      upLoadFilesList:[],
      documentTypeNameMap:{
        11:'入党申请书',
        21:'个人自传',
        22:'谈话记录',
        31:'推荐推优材料',
        32:'会议记录',
        41:'备案报告',
        61:'思想汇报',
        71:'会议记录',
        81:'备案报告',
        82:'发展对象公示材料',
        101:'发展对象集中培训合格证书/高知识培训积分表',
        111:'政审结论材料',
        112:'发展对象部门联审材料',
        121:'会议记录',
        131:'发展对象预审材料',
        141:'入党自愿书',
        151:'会议记录',
        191:'思想汇报',
        192:'中国共产党党员基本情况登记表',
        221:'转正申请书',
        231:'个人自传',
        232:'谈话记录',
      }
    };
  },
  computed: {},
  watch: {
    filesList: {
      deep: true,
    　handler(newValue, oldValue) {
        this.$forceUpdate()
    　}
   },
  },
  mounted() {
  },
  methods: {
    // 判断文件大小
    beforeFileUpload (file) {
      const isLt1M = file.size / 1024 / 1024 < Number(this.maxUpLoadSize)
      if (isLt1M) {
        return true
      }
      this.$message({type: 'error', message: `请不要上载大小超过${this.maxUpLoadSize}M的文件`, showClose: true})
      return false
    },
    // 上传资料
    handlePreview(file) {
      if(!this.documentType) {
        this.$message({
          showClose: true,
          message: '请选择文档类型',
          type: 'warning'
        });
        return
      }
      if(this.filesList.length > (this.maxUpLoadNum -1)) {
         this.$message({type: 'warning', message: `最多只能上传${this.maxUpLoadNum}个文件`, showClose: true})
        return
      }
      if (this.beforeFileUpload(file)) {
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

      let fileName = `[${this.documentTypeNameMap[this.documentType]}]${file.name}`;
      if(!this.isPreviewable) {
        
        let params = {
          file: formData,
        };
        this.$client.AddTxtfileUpload(params).then(res => {
          if(res.head.result == "200") {
            let fileObj = {
              name: fileName,
              url: res.context,
              id: this.filesList.length? (Number(this.filesList.at(-1).id) + 1) : 1
            }
            this.$emit('upload-update-success', fileObj, this.contentType)
  
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
              id: this.filesList.length? (Number(this.filesList.at(-1).id) + 1) : 1
            }
            this.$emit('upload-update-success', fileObj, this.contentType)
  
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
    // 下载文件
    downloadDocument(item) {
      // console.log(item)
      window.location.href = item.url
      this.$message({type: 'success', message: '下载成功'})
    },
    // 删除文件
    deleteDocument(item,index) {
      this.$refs.uploadDocomnet.uploadFiles.splice(index, 1)
       this.$emit('delete-success', item, this.contentType)
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