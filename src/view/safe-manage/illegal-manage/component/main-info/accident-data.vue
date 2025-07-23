<template>
  <div class="scrap-condition" style="height: 440px; overflow-x: hidden">
    <div class="show-flex-box-c">
       <span style="margin-bottom:20px; color:#33333385; font-size: 14px;">仅支持上传jpg/png格式文件，单个文件不能超过500kb，最多可上传10张图片</span>
       <div style="height: 400px;">
         <image-list-upload
          ref="laborInfo"
          :action="'/api/ERPWeb/ViolationManage/UploadPicture'"
          :imgData='tyreMaintainData'
          :imageHeight="400"
          :isShowRemark="false"
          :disabled="this.curChangeType == 'detail'"
          :picturePathList="picturePathList"
          :ImageBoxName="'tyreMaintainData'"
          @on-add-img ='addTyreMaintainImg(arguments)'
          @on-del ='deleteImg(arguments)'
          @on-del-all ='deleteAllImg'
        ></image-list-upload>
       </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
import imageListUpload from "@/components/imageListUpload";
export default {
  components: {
    imageListUpload
  },
  props: {
    curChangeType: {
      type: String,
      default: "add",
    },
  },
  data() {
    return {
      formData: {

      },
      rules:{},
      tyreMaintainData:[],
      picturePathList:[]
    };
  },
  methods: {
    // 重置信息
    resetData() {
      this.tyreMaintainData = [];
      this.picturePathList = [];
    },
    // 数据回显
    setData(val) {
      const evidences = val.evidences || []
      if(evidences.length > 0) {
        evidences.forEach((item,index) => {
          let Obj = {
            id: index +1,
            image_path: item,
          }
          this.tyreMaintainData.push(Obj)
        });
      }
      this.picturePathList = val.evidences || []
    },
    // 添加图片
    addTyreMaintainImg(msg){
      // console.log('addVehLicenseImg',JSON.stringify(msg) ,msg)
      let lastChildId = 0;
      if(this.tyreMaintainData.length > 0) {
        lastChildId = this.tyreMaintainData[this.tyreMaintainData.length-1].id;
      }
      let imgSort = lastChildId + 1
      let Obj = {
        id: imgSort,
        image_path: msg[0],
      }
      this.tyreMaintainData.push(Obj)
      this.picturePathList.push(msg[0])
    },
     // 删除图片
    deleteImg(msg){
    //  console.log(msg[0],msg[1])
      let item = msg[0]
      let flag = msg[1]

      this[`${flag}`].forEach((element,index) => {
        if(element.id == item.id){
          this[`${flag}`].splice(index,1);
          this.picturePathList.splice(index,1)
        }
      });
    },
    // 删除所有图片
    deleteAllImg(val){
      // console.log(this[`${val}`])
      this[`${val}`] = [];
      this.picturePathList = [];
    },
    // 给父级页面提供得获取本页数据
    getData() {
      let form = {
        evidences: this.picturePathList
      }
      return new Promise((resolve, reject) => {
        resolve({
          formData: form,
          result: 200,
          msg: "获取成功",
        });
      });
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.scrap-condition /deep/ .el-input {
  width: 480px;
}

.scrap-condition /deep/ .el-input--mini {
  width: 480px;
}

.scrap-condition/deep/ .el-date-editor {
  width: 480px;
}
.document-content{
  padding: 0 4px;
  // width: 100%;
  >li{
    width: 60%;
    // padding: 8px 0;
    justify-content: space-between;
    align-items: center;
    border-bottom: 3px solid #19be6b;
  }
}
.scrap-condition /deep/ .el-upload-list{
  display: none
}
</style>
