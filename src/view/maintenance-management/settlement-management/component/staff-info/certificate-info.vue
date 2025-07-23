<!-- 证件信息页面 -->
<template>
  <div style="height:100%; overflow-x: hidden">
    <el-row style="margin-bottom:40px">
      <el-col :span="11" style="height:300px;width:600px">
        <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div> 
        <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:16px;font-weight:bold">维修相关图片</p>
        <!-- <p style="margin-left:15px;margin-bottom:15px;">仅支持上传jpg/jpeg/png格式文件，单个文件不能超过5MB，最多可上传10张图片</p> -->
        <img-box ref="laborInfo" :imgData='VehicleLicenseData' :imageHeight="310" :action="'/api/ERPWeb/DataBase/UploadFile'" :ImageBoxName="VehicleLicense" :picturePathList="laborInfoPicturePathList" :isShowRemark="true" :disabled="this.curChangeType == 'detail'" @on-add-img ='addVehLicenseImg(arguments)' @on-del ='deleteImg(arguments)'  @on-del-all ='deleteAllImg' @send-remark="saveRemark"></img-box>
        <div style="float:left;width: 6px;height: 18px; background: #409EFF;margin-top:15px;"></div> 
        <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:16px;font-weight:bold;margin-top:15px;">维修相关资料</p>
      </el-col>
    </el-row>
    <el-row style="margin-top:80px">
      <el-col :span="11">
        <el-upload
          class="upload-demo"
          :limit="4"
          action="#"
          :on-preview="handlePreview2"
          :http-request="handlePreview1"
          :on-remove="handleRemove"
          :on-change="handlePreview"
          :file-list="fileList"
          >
          <el-button size="small" type="primary" :disabled="curChangeType == 'detail'">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">支持格式：.rar .zip .doc .docx .pdf ，单个文件不能超过20MB，最多只能保存5个文件</div>
        </el-upload>
  
      </el-col>
    </el-row>
  </div>
</template>

<script>
import upFileImg from "@/components/upload/up-file-img.vue";
// import ImgBox from './img-box.vue';
import ImgBox from "@/components/imageListUpload";
export default {
  components: { upFileImg,ImgBox },
  data() {
    return {
      fileList:[],
      order_id:'',
      VehicleLicenseData: [], //劳务合同
      VehRegisterData: [], //驾驶证
      VehInsuranceData: [],//其他

      VehicleLicense: 'VehicleLicenseData', //劳务合同
      VehRegister: 'VehRegisterData', //驾驶证
      VehInsurance: 'VehInsuranceData',//其他
      VehicleLicenseDataRemark: '',
      VehRegisterDataRemark: '',
      VehInsuranceDataRemark: '',
      laborInfoPicturePathList: [],
      driveLicenceInfoPicturePathList: [],
      otherInfoPicturePathList: [],

    };
  },
   props: {
    curChangeType: {
      type: String,
      default: 'add' //add添加  edit编辑  detail详情
    }
  },

  methods: {
       handleRemove(file, fileList) {
    //  this.formData.imgs = this.formData.imgs.filter(dataLists=>dataLists == file.url);
      console.log(file,'777')
      let c = this.fileList.findIndex(d=>{// 测试条件为true时返回当前位置
            return d.url == file.url;
        })
      this.fileList.splice(c,1)
    },
    handlePreview2(file) {
      console.log(file);
      // document.location.href = file.url
      window.open(file.url, 'hello')
    },
    handlePreview1(){

    },
        handlePreview(file) {
          console.log(file)
      // console.log(this.formData.imgs.length,'长度')
      // if(this.formData.imgs.length > 3) {
      //    this.$message({type: 'warning', message: '最多只能上传4个文件', showClose: true})
      //   return
      // }
  
        this.uploadAccidentDataFiles(file)
    },
    // 上传相关资料文件
    uploadAccidentDataFiles(file) {
    // if(this.formData.imgs.length > 4) {
    //      this.$message({type: 'warning', message: '最多只能上传4个文件', showClose: true})
    //     return
    //   }
      // console.log(file)
      let formData = new FormData();
      formData.append("file", file.raw);

      let params = {
        file: formData,
      };
      let fileName = file.name;
      console.log(fileName,'1')
      this.$client.AddTxtfileUpload(params).then(res => {
        if(res.head.result == "200") {
          // this.formData.imgs.push(res.context)
            let Obj = {
              url: res.context,
              name:fileName,
              isStore: false,  // 是否存储到数据表里   如果只是新增图片，则isStore 为 false
              type:2,
              order_id:this.order_id
            }
            this.fileList.push(Obj)
            console.log(this.fileList,6679)
            this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 删除图片
    deleteImg(msg){
     console.log(msg[0],msg[1])
      let item = msg[0]
      let flag = msg[1]

      this[`${flag}`].forEach((element,index) => {
        if(element.id == item.id){
          this[`${flag}`].splice(index,1)
          switch (flag) {
            case 'VehicleLicenseData':
              this.laborInfoPicturePathList.splice(index,1)
              break;
            case 'VehRegisterData':
              this.driveLicenceInfoPicturePathList.splice(index,1)
              break;
            case 'VehInsuranceData':
              this.otherInfoPicturePathList.splice(index,1)
              break;
          }
        }
      });
    },
    // 删除所有图片
    deleteAllImg(val){
      // console.log(this[`${val}`])
      this[`${val}`] = [];
      switch (val) {
        case 'VehicleLicenseData':
          this.laborInfoPicturePathList = []
          break;
        case 'VehRegisterData':
          this.driveLicenceInfoPicturePathList = []
          break;
        case 'VehInsuranceData':
          this.otherInfoPicturePathList = []
          break;
      }
    },

    // 给父级页面提供得获取本页数据
    getData() {
      
      return new Promise((resolve, reject) => {
        let laborPhotoList =  JSON.parse(JSON.stringify(this.VehicleLicenseData).replace(/image_path/g,"url"))
         laborPhotoList.forEach(item => {
          // this.$set(item,'dept_id',this.formData.dept_id)
          this.$set(item,'type','1')
          this.$set(item,'name','image')
          this.$set(item,'order_id',this.order_id)
          })
          let Repairfiles= laborPhotoList.concat(this.fileList)
        // let driverLicencePhotoList = this.bulidImagePathList(this.VehRegisterData);
        // let  otherPhotoList = this.bulidImagePathList(tshis.VehInsuranceData);
         console.log(Repairfiles,'555')
        setTimeout(() => {
          resolve({
            formData:Repairfiles,
            result:200,
            msg: '获取成功'
          });
        }, 50);
        
      })
    },
    bulidImagePathList(imageList) {
      let imageArray = [];
      console.log(imageList)
      if(imageList.length > 0) {
        imageList.forEach(item => {
          imageArray.push(item.image_path)
        });
      }
      return imageArray
    },
    // 维修图片
    addVehLicenseImg(msg){
      // console.log('addVehLicenseImg',JSON.stringify(msg) ,msg)
      let lastChildId = 0;
      if(this.VehicleLicenseData.length > 0) {
        lastChildId = this.VehicleLicenseData[this.VehicleLicenseData.length-1].id;
      }
      let imgSort = lastChildId + 1
      let Obj = {
        id: imgSort,
        image_path: msg[0],
        isStore: false  // 是否存储到数据表里   如果只是新增图片，则isStore 为 false
      }
      this.VehicleLicenseData.push(Obj)
      this.laborInfoPicturePathList.push(msg[0])
    },
    //维修资料
    addVehRepairFile(msg){
      // console.log('addVehRegisterImg',msg)

      if(this.VehRegisterData.length > 0) {
        lastChildId = this.VehRegisterData[this.VehRegisterData.length-1].id;
      }
      let imgSort = lastChildId + 1
      let Obj = {
        url: msg,
        name:1234,
        isStore: false,  // 是否存储到数据表里   如果只是新增图片，则isStore 为 false
        type:2,
      }
      this.VehRegisterData.push(Obj)
      this.driveLicenceInfoPicturePathList.push(msg[0])
    },
    // 其他
    addVehInsuranceImg(msg){
      // console.log('addVehInsuranceImg',msg)
      let lastChildId = 0;
      if(this.VehInsuranceData.length > 0) {
        lastChildId = this.VehInsuranceData[this.VehInsuranceData.length-1].id;
      }
      let imgSort = lastChildId + 1
      let Obj = {
        id: imgSort,
        image_path: msg[0],
        isStore: false  // 是否存储到数据表里   如果只是新增图片，则isStore 为 false
      }
      this.VehInsuranceData.push(Obj)
      this.otherInfoPicturePathList.push(msg[0])
    },
    saveRemark(remark, picName) {
      console.log(remark, picName);
      switch (picName) {
        case 'VehicleLicenseData':
          this.VehicleLicenseDataRemark = remark
          break;
        case 'VehRegisterData':
          this.VehRegisterDataRemark = remark
          break;
        case 'VehInsuranceData':
            this.VehInsuranceDataRemark = remark
          break;
      }
    },
    // 重置图片数据
    resetData(){
      this.fileList = [];
      this.VehicleLicenseData = []; //劳务合同
      this.VehRegisterData = []; //驾驶证
      this.VehInsuranceData = [];//其他
      this.laborInfoPicturePathList = [];
      this.driveLicenceInfoPicturePathList = [];
      this.otherInfoPicturePathList = [];
      this.VehicleLicenseDataRemark = '';
      this.VehRegisterDataRemark = '';
      this.VehInsuranceDataRemark = '';
    },
    // 设置图片回显
    setData(val){
      this.resetData();
      console.log(val,'abc')
      this.order_id = val.id
      // alert(JSON.stringify(val.labor_photos))
      this.$client.getOrderFile({order_id:val.id}).then(res => {
        if(res.head.result == "200") {
          this.VehicleLicenseData = res.context? this.bulidImageEcho(res.context) : [];
          res.context.forEach(element => {
            if(element.type == 1){
            }else{
              this.fileList.push(element)
            }
          });
          // this.VehicleLicenseData = val.labor_photos? this.bulidImageEcho(val.labor_photos) : [];
          // this.VehicleLicenseData =JSON.parse(JSON.stringify(this.laborInfoPicturePathList).replace(/url/g,"image_path"))
          console.log(res.context)
         console.log(this.VehicleLicenseData,'1666')
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })

    },
    // 回显示
    bulidImageEcho(picList){
      let imageReturnList = [];
      // alert(picList)
      if(picList.length > 0) {
        picList.forEach((item,index) => {
          if(item.type ==1){
          let Obj = {
            id: index + 1,
            image_path: item.url,
            isStore: false  // 是否存储到数据表里   如果只是新增图片，则isStore 为 false
          };
          imageReturnList.push(Obj)
          }
        })
        
      }
      return imageReturnList
    },
  },
};
</script>
<style lang='scss' scoped>
</style>