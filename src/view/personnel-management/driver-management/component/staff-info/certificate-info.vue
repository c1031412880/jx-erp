<!-- 证件信息页面 -->
<template>
  <div style="height: 400px; overflow-x: hidden">
    <el-row style="margin-bottom:40px">
      <el-col :span="11" style="height:300px">
        <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div> 
        <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:16px;font-weight:bold">劳务合同</p>
        <img-box ref="laborInfo" :imgData='VehicleLicenseData' :imageHeight="310" :action="'/api/ERPWeb/EmployeeManage/UploadPicture'" :ImageBoxName="VehicleLicense" :picturePathList="laborInfoPicturePathList" :isShowRemark="true" :disabled="this.curChangeType == 'detail'" @on-add-img ='addVehLicenseImg(arguments)' @on-del ='deleteImg(arguments)'  @on-del-all ='deleteAllImg' @send-remark="saveRemark"></img-box>
      </el-col>
       <el-col :span="11" :offset="1" style="height:300px">
        <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div> 
        <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:16px;font-weight:bold">任命书照片</p>
        <img-box ref="driverLetterAppointment" :imgData='LetterAppointmentData' :imageHeight="310" :action="'/api/ERPWeb/EmployeeManage/UploadPicture'" :ImageBoxName="LetterAppointment" :picturePathList="letterAppointmentPicturePathList" :isShowRemark="true" :disabled="this.curChangeType == 'detail'" @on-add-img ='addLetterAppointmentImg(arguments)' @on-del ='deleteImg(arguments)' @on-del-all ='deleteAllImg' @send-remark="saveRemark"></img-box>
      </el-col>
    </el-row>
    <el-row style="margin-bottom:40px">
      <el-col :span="11" style="height:300px">
        <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div> 
        <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:16px;font-weight:bold">驾驶证</p>
        <img-box ref="driveLicenceInfo" :imgData='VehRegisterData' :imageHeight="310" :action="'/api/ERPWeb/EmployeeManage/UploadPicture'" :ImageBoxName="VehRegister" :picturePathList="driveLicenceInfoPicturePathList" :isShowRemark="true" :disabled="this.curChangeType == 'detail'" @on-add-img ='addVehRegisterImg(arguments)' @on-del ='deleteImg(arguments)' @on-del-all ='deleteAllImg' @send-remark="saveRemark"></img-box>
      </el-col>
      <el-col :span="11" :offset="1" style="height:300px">
        <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div> 
        <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:16px;font-weight:bold">其他</p>
        <img-box ref="otherInfo" :imgData='VehInsuranceData' :imageHeight="310" :action="'/api/ERPWeb/EmployeeManage/UploadPicture'" :ImageBoxName="VehInsurance" :picturePathList="otherInfoPicturePathList" :isShowRemark="true" :disabled="this.curChangeType == 'detail'"  @on-add-img ='addVehInsuranceImg(arguments)' @on-del ='deleteImg(arguments)' @on-del-all ='deleteAllImg' @send-remark="saveRemark"></img-box>
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
      VehicleLicenseData: [], //劳务合同
      LetterAppointmentData: [], //任命书

      VehRegisterData: [], //驾驶证
      VehInsuranceData: [],//其他

      VehicleLicense: 'VehicleLicenseData', //劳务合同

      LetterAppointment: 'LetterAppointmentData', //劳务合同

      VehRegister: 'VehRegisterData', //驾驶证
      VehInsurance: 'VehInsuranceData',//其他
      VehicleLicenseDataRemark: '',

      LetterAppointmentDataRemark: '', 

      VehRegisterDataRemark: '',
      VehInsuranceDataRemark: '',
      laborInfoPicturePathList: [],

      letterAppointmentPicturePathList: [],

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
            case 'LetterAppointmentData':
              this.letterAppointmentPicturePathList.splice(index,1)
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
        case 'LetterAppointmentData':
          this.letterAppointmentPicturePathList = []
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
        let laborPhotoList = this.bulidImagePathList(this.VehicleLicenseData);
        let appointImages = this.bulidImagePathList(this.LetterAppointmentData);
        let driverLicencePhotoList = this.bulidImagePathList(this.VehRegisterData);
        let otherPhotoList = this.bulidImagePathList(this.VehInsuranceData);
        setTimeout(() => {
          resolve({
            formData:{
              labor_photos: laborPhotoList,
              appoint_images: appointImages,
              driver_licence_photos: driverLicencePhotoList,
              other_photos: otherPhotoList,
              c_labor_remark: this.VehicleLicenseDataRemark,
              c_appoint_remark: this.LetterAppointmentDataRemark,
              c_driver_licence_remark: this.VehRegisterDataRemark,
              c_other_remark: this.VehInsuranceDataRemark
            },
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
    // 劳务合同
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
    // 任命书照片
    addLetterAppointmentImg(msg){
      // console.log('addVehRegisterImg',msg)
      let lastChildId = 0;
      if(this.LetterAppointmentData.length > 0) {
        lastChildId = this.LetterAppointmentData[this.LetterAppointmentData.length-1].id;
      }
      let imgSort = lastChildId + 1
      let Obj = {
        id: imgSort,
        image_path: msg[0],
        isStore: false  // 是否存储到数据表里   如果只是新增图片，则isStore 为 false
      }
      this.LetterAppointmentData.push(Obj)
      this.letterAppointmentPicturePathList.push(msg[0])
    },
    // 驾驶证证书
    addVehRegisterImg(msg){
      // console.log('addVehRegisterImg',msg)
      let lastChildId = 0;
      if(this.VehRegisterData.length > 0) {
        lastChildId = this.VehRegisterData[this.VehRegisterData.length-1].id;
      }
      let imgSort = lastChildId + 1
      let Obj = {
        id: imgSort,
        image_path: msg[0],
        isStore: false  // 是否存储到数据表里   如果只是新增图片，则isStore 为 false
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
        case 'LetterAppointmentData':
          this.LetterAppointmentDataRemark = remark
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
      this.VehicleLicenseData = []; //劳务合同
      this.LetterAppointmentData = []; //任命书
      this.VehRegisterData = []; //驾驶证
      this.VehInsuranceData = [];//其他
      this.laborInfoPicturePathList = [];
      this.letterAppointmentPicturePathList = [];
      this.driveLicenceInfoPicturePathList = [];
      this.otherInfoPicturePathList = [];
      this.VehicleLicenseDataRemark = '';
      this.LetterAppointmentDataRemark = '';
      this.VehRegisterDataRemark = '';
      this.VehInsuranceDataRemark = '';
    },
    // 设置图片回显
    setData(val){
      this.resetData();
      // alert(JSON.stringify(val.labor_photos))
      this.VehicleLicenseData = val.labor_photos? this.bulidImageEcho(val.labor_photos) : [];
      this.laborInfoPicturePathList = val.labor_photos? val.labor_photos : [];
      // --------------任命书
      this.LetterAppointmentData = val.appoint_images? this.bulidImageEcho(val.appoint_images) : [];
      this.letterAppointmentPicturePathList = val.appoint_images? val.appoint_images : [];
      this.VehRegisterData = val.driver_licence_photos? this.bulidImageEcho(val.driver_licence_photos) : [];
      this.driveLicenceInfoPicturePathList = val.driver_licence_photos? val.driver_licence_photos: [];
      this.VehInsuranceData = val.other_photos? this.bulidImageEcho(val.other_photos) : [];
      this.otherInfoPicturePathList = val.other_photos? val.other_photos : [];


      this.VehicleLicenseDataRemark = val.c_labor_remark? val.c_labor_remark: "";
      this.VehRegisterDataRemark = val.c_driver_licence_remark? val.c_driver_licence_remark: "";
      this.VehInsuranceDataRemark = val.c_other_remark? val.c_other_remark: "";
      this.$refs.laborInfo.remark = val.c_labor_remark? val.c_labor_remark: "";
      this.$refs.driverLetterAppointment.remark = val.c_appoint_remark? val.c_appoint_remark: "";
      this.$refs.driveLicenceInfo.remark = val.c_driver_licence_remark? val.c_driver_licence_remark: "";
      this.$refs.otherInfo.remark = val.c_other_remark? val.c_other_remark: "";
    },
    // 回显示
    bulidImageEcho(picList){
      let imageReturnList = [];
      // alert(picList)
      if(picList.length > 0) {
        picList.forEach((item,index) => {
          let Obj = {
            id: index + 1,
            image_path: item,
            isStore: false  // 是否存储到数据表里   如果只是新增图片，则isStore 为 false
          };
          imageReturnList.push(Obj)
        })
      }
      return imageReturnList
    },
  },
};
</script>
<style lang='scss' scoped>
</style>