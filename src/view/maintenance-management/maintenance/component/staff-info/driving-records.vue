<template>
  <div class="base-info" style="height:60vh;overflow-x:hidden">
      <el-form
      size="mini"
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="165px"
    >
      <div class="el-form-row-first">
        <div class="el-form-row-first-left">
          <el-form-item label="档案编号:" prop="c_da_code">
            <div class="show-flex-box-r">
              <el-input
              placeholder="请输入档案编号"
              v-model="formData.c_da_code"
              disabled
            ></el-input>
            <el-button v-if="!formData.c_da_code && curChangeType == 'edit'" style="margin-left: 5px;" type="primary" icon="" size="mini" @click="reqRecordNumber()"
            >获取</el-button
          >
            </div>
            
          </el-form-item>
          <el-form-item label="驾照类别:" prop="c_licence_grade">
            <el-select v-model="formData.c_licence_grade" placeholder="请选择驾照类别">
              <el-option
                v-for="item in licenceGradeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公交驾驶日期:" prop="d_driver_date">
            <el-date-picker
              v-model="formData.d_driver_date"
              type="date"
              placeholder="选择日期"
              @change="selectedTime"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              >
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="el-form-row-first-right">
          <span>驾驶证照片:</span>
          <div
            class="avatar-uploader"
            :class="{ 'have-avatar-active': formData.driving_record_photos && formData.driving_record_photos.length > 0 }"
            @click="uploadFile"
          >
            <img v-if="formData.driving_record_photos && formData.driving_record_photos.length > 0" :src="formData.driving_record_photos[0]" class="avatar" />
            <i v-else class="avatar-uploader-icon"
              ><el-button class="el-icon-upload2">上传图片</el-button></i
            >
          </div>
        </div>
      </div>
      <div class="el-form-row">
        <el-form-item label="初次领证日期:" prop="d_first_get_licence">
          <el-date-picker
            v-model="formData.d_first_get_licence"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发证机构:" prop="c_certificate">
          <el-input
              placeholder="请输入发证机构"
              v-model="formData.c_certificate"
          ></el-input>
        </el-form-item>
      </div>
      <div class="el-form-row">
        <el-form-item label="上次年审日期:" prop="d_licence_last_verify">
           <el-date-picker
            v-model="formData.d_licence_last_verify"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="下次年审日期:" prop="d_licence_next_verify">
          <el-date-picker
            v-model="formData.d_licence_next_verify"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="el-form-row">
        <el-form-item label="有效起始日期:" prop="d_valid_start_time">
          <el-date-picker
            v-model="formData.d_valid_start_time"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到期日期:" prop="d_valid_end_time">
          <el-date-picker
            v-model="formData.d_valid_end_time"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="el-form-row">
        <el-form-item label="公交驾龄（年）:">
          <el-input
            placeholder="根据公交驾驶日期（年）"
            v-model="drivingAge"
            disabled
          ></el-input>
        </el-form-item>

        <el-form-item label="资格证获取时间:" prop="d_qualification">
          <el-date-picker
            v-model="formData.d_qualification"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="el-form-row">
        <el-form-item label="从业资格证号:" prop="c_qualification_code">
          <el-input
            placeholder="请输入从业资格证号"
            v-model="formData.c_qualification_code"
          ></el-input>
        </el-form-item>
      </div>
      <div class="el-form-row">
        <el-form-item label="初始化总里程（KM）:" prop="init_total_mile">
          <el-input
            oninput="value=value.replace(/[^\d.-]/g,'')"
            placeholder="请输入初始化总里程（KM）"
            v-model="formData.init_total_mile"
          ></el-input>
        </el-form-item>
        <el-form-item label="公交总里程（KM）:" prop="bus_total_mile">
          <el-input
            oninput="value=value.replace(/[^\d.-]/g,'')"
            placeholder="请输入公交总里程（KM）"
            v-model="formData.bus_total_mile"
          ></el-input>
        </el-form-item>
      </div>
      <div class="el-form-row">
        <el-form-item label="当前安全里程（KM）:" prop="safe_mile">
          <el-input
            oninput="value=value.replace(/[^\d.-]/g,'')"
            placeholder="请输入当前安全里程（KM）"
            v-model="formData.safe_mile"
          ></el-input>
        </el-form-item>
        <el-form-item label="初始安全里程（KM）:" prop="init_safe_mile">
          <el-input
            oninput="value=value.replace(/[^\d.-]/g,'')"
            placeholder="请输入初始安全里程（KM）"
            v-model="formData.init_safe_mile"
          ></el-input>
        </el-form-item>
      </div>
      <div class="el-form-row">
        <el-form-item label="安全等级:" prop="safe_level">
          <el-select v-model="formData.safe_level" placeholder="请选择安全等级">
            <el-option
              v-for="item in safeLevelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始计算日期:" prop="begin_caculate_date">
          <el-date-picker
            v-model="formData.begin_caculate_date"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    curChangeType:{
      type: String,
      default: 'add' //add添加  edit编辑  detail详情
    }
  },
  data() {
    return {
      licenceGradeOptions:[
        {
          value: "A1",
          label: "A1",
        },
        {
          value: "A2",
          label: "A2",
        },
        {
          value: "A3",
          label: "A3",
        },
        {
          value: "B1",
          label: "B1",
        },
        {
          value: "B2",
          label: "B2",
        },
        {
          value: "C1",
          label: "C1",
        },
        {
          value: "C2",
          label: "C2",
        },
        {
          value: "C3",
          label: "C3",
        },
      ],
      safeLevelOptions:[
        {
          value: "等级1",
          label: "等级1",
        },
        {
          value: "等级2",
          label: "等级2",
        },
        {
          value: "等级3",
          label: "等级3",
        },
      ],
      date:[],
      drivingAge:'0',
      formData: {
        c_da_code: '',
        c_licence_grade: '',
        d_driver_date: '',
        driving_record_photos: [], //驾驶档案图片地址
        
        d_first_get_licence: '',
        c_certificate: '',
        d_licence_last_verify: '',
        d_licence_next_verify: '',
        d_valid_start_time: '',
        d_valid_end_time: '',

        d_qualification: '',
        c_qualification_code: '',
        init_total_mile: '',
        bus_total_mile: '',
        safe_mile: '',
        init_safe_mile: '',
        safe_level: '',
        begin_caculate_date: '',
      },
      rules: {
        
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
  },
  methods: {
    // 初始化数据
    resetData(){ 
      this.$refs['formData'].resetFields()
      this.formData.driving_record_photos = [];
      this.drivingAge = '0'
    },
    // 获取档案编号
    reqRecordNumber() {
      this.$client.getRecordNumber()
      .then(res => {
        if(res.head.result == '200') {
          this.formData.c_da_code = res.context;
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 选择公交驾驶日期算出公交驾龄
    selectedTime(val) {
      console.log(val);
      let pamras = {
        birth_day: val
      }
      this.$client.getRelatedAge(pamras)
      .then(res => {
        if(res.head.result == '200') {
          this.drivingAge = res.context;
        }else{
          this.$message({type: 'error', message: '获取驾龄失败'})
        }
      })
     
    },
    // 数据回显
    setData(val){
      // alert(111)
      this.formData.c_da_code = val.c_da_code
      this.formData.c_licence_grade = val.c_licence_grade
      this.formData.d_driver_date = val.d_driver_date
      this.formData.driving_record_photos = val.driving_record_photos

      this.formData.d_first_get_licence =  val.d_first_get_licence
      this.formData.c_certificate = val.c_certificate
      this.formData.d_licence_last_verify =  val.d_licence_last_verify
      this.formData.d_licence_next_verify = val.d_licence_next_verify
      this.formData.d_valid_start_time =  val.d_valid_start_time
      this.formData.d_valid_end_time = val.d_valid_end_time
      this.drivingAge = val.gj_age //公交驾龄
      this.formData.d_qualification = val.d_qualification

      this.formData.c_qualification_code = val.c_qualification_code
      this.formData.init_total_mile = val.init_total_mile
      this.formData.bus_total_mile= val.bus_total_mile
      this.formData.safe_mile = val.safe_mile
      this.formData.init_safe_mile = val.init_safe_mile
      this.formData.safe_level = val.safe_level
      this.formData.begin_caculate_date = val.begin_caculate_date
    },
    // 给父级页面提供得获取本页数据
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs['formData'].validate(valid => {
          if (!valid) {
            reject({
              result: 400,
              msg: '获取失败'
            })
            return
          }
          resolve({ 
            formData: this.formData,
            result:200,
            msg: '获取成功'

          })
        })
      })
    },
     // 自定义上传文件方法
    // :http-request="uploadFile"
    uploadFile() {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => {
        console.log(input.files);
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        reader.onload = (ev) => {
          input = undefined;
        };
        let formData = new FormData();
        formData.append("file", file);
        let params = {
          file: formData,
        };
        this.$client.uploadPicture(params,'/api/ERPWeb/EmployeeManage/UploadPicture')
        .then(res => {
          if(res.head.result == '200') {
            this.formData.driving_record_photos = [res.context];
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
      };
      input.click();

      // 把文件放入 FormData 进行提交
      // this.imageUrl = URL.createObjectURL(file.raw);
      // const param = new FormData()
      // param.append('files', file.file)
      // uploadFile(param).then(response => {
      // // TODO 一些关闭弹框，上传成功提示等
      // })
    },
  }
}

</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

.el-form-row-first {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;

  .el-form-row-first-left {
    width: 45%;
    height: 145px;
    display: flex;
    flex-direction: column;
  }

  .el-form-row-first-right {
    width: 220px;
    height: 120px;
    // background red
    margin-left: 16%;
    margin-bottom: 30px;
    display: flex;
    >span{
      white-space: nowrap;
      margin-right: 20px;
      margin-top: 10px;
      font-size: 14px;
      color: #606266;
      font-weight bold
    }

    .avatar-uploader {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      // border: 1px dashed #d9d9d9;
      // border-radius: 6px;
      cursor: pointer;
      background: url('../../../../../assets/veh_svg/uploader-icon.svg') no-repeat center;
      // border: 2px solid #eee;
      background-size: 100% 100%;
      overflow: hidden;
      object-fit: cover !important;
        .avatar {
          display: block;
          width: 100%;
          height: 100%;
        }

      // .el-upload {
      //   width: 100% !important;
      //   height: 100% !important;
      //   overflow: hidden !important;
      //   object-fit: cover !important;

      // }
    }

    .have-avatar-active {
      background: none;

      div {
        width: 100% !important;
        height: 100% !important;
      }
    }
  }
}

.el-form-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  // white-space:nowrap;

  .el-form-item {
    width: 45%;
    margin-right: 5%;

    .el-form-item__label {
      white-space: nowrap;
    }
  }
}

.base-info /deep/ .el-input{
  width: 220px;
}

.base-info /deep/ .el-date-editor--daterange{
  width: 220px;
}
.base-info /deep/ .el-range-separator {
  width: 10%;
}
</style>

<style scoped>
.el-form-row-first-right /deep/ .have-avatar-active {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.div{
  /* background: url("../../../../../src/assets/veh_svg/uploader-icon.svg") no-repeat center;
  object-fit: cover;
  background: url("../../../../../assets/veh_svg/uploader-icon.svg"); */
}
</style>
