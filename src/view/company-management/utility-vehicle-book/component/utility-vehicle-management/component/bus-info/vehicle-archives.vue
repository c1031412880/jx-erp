<template>
  <div class="vehicle-archives" style="height:510px;overflow-x:hidden">
    <el-form :model="form" :rules="basicRules" ref="form" size="mini" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="24" style="display:flex;align-items:center;padding-bottom:10px">
          <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div>
          <p style="margin-left:5px;color:#000;font-size:14px;">车辆档案</p>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆购置日期:" prop="buy_date">
            <el-date-picker
              @change="dateChange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              v-model="form.buy_date"
              style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车龄:" prop="bus_old">
            <el-input v-model="form.bus_old" disabled style="width:100%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="保险开始日期:" prop="start_insurance">
            <el-date-picker
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              v-model="form.start_insurance"
              style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="保险到期日期:" prop="end_insurance">
            <el-date-picker
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              v-model="form.end_insurance"
              style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上次保养日期:" prop="last_maintain">
            <el-date-picker
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              v-model="form.last_maintain"
              style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上次保养里程:" prop="last_maintain_mile">
            <el-input-number v-model="form.last_maintain_mile" style="width:100%" :min="0" :precision="2" :controls="false"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="上次年审日期:" prop="last_check">
            <el-date-picker
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              v-model="form.last_check"
              style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记证书号码:" prop="cretificate">
            <el-input v-model="form.cretificate" style="width:100%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记证书日期:" prop="certificate_date">
            <el-date-picker
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              v-model="form.certificate_date"
              style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车架号码:" prop="chassis_number">
            <el-input v-model="form.chassis_number" style="width:100%" placeholder="请输入或上传行驶证自动识别车架号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发动机号:" prop="engine_number">
            <el-input v-model="form.engine_number" style="width:100%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车身颜色:" prop="bus_color">
            <el-input v-model="form.bus_color" style="width:100%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆型号:" prop="kind">
            <el-input v-model="form.kind" style="width:100%"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24" style="display:flex;align-items:center;padding-bottom:10px">
          <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div>
          <p style="margin-left:5px;color:#000;font-size:14px;">车辆证件</p>
        </el-col>
        <el-col :span="12">
          <el-carousel height="220px" ref="carousel" indicator-position="none" :autoplay="false" @change="changeCarousel" style="border:1px solid #999">
            <el-carousel-item v-for="(item,index) in form.img_list" :key="index">
              <el-image
                style="width: 100%; height:100%"
                fit="fill"
                :src="item.file_url"></el-image>
            </el-carousel-item>
          </el-carousel>
          <div class="carousel-box">
            <div class="carousel-button" @click="showRemark">备注</div>
            <div class="carousel-button" style="border-left:1px solid #000;border-right:1px solid #000" @click="uploadFile">添加</div>
            <div class="carousel-button" @click="deleteImg">删除</div>
          </div>
          <div class="remarks" v-if="form.img_list.length > 0 && isShow">
            <el-input v-model="form.img_list[img_index].remark" class="remarks-text" clearable placeholder="请输入备注"></el-input>
            <!-- <div class="remarks-button" @click="removeRemark">删除</div> -->
          </div>
        </el-col>
        <el-col :span="12">
          <el-upload
            class="upload-demo"
            ref="uploadDocomnet"
            action="string"
            :on-change="handlePreview"
            accept=".rar,.zip,.doc,.docx,.pdf "
            :show-file-list="false"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary" class="el-icon-upload">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">支持格式：.rar .zip .doc .docx .pdf ，单个文件不能超过20MB，最多只能保存5个文件</div>
          </el-upload>
          <ul class="document-content show-flex-box-c" style="margin-top:10px">
            <li class="show-flex-box-r" style="margin-bottom:10px;justify-content:space-between;" v-for="(item,index) in form.file_list" :key="index">
              <span class="show-flex-box-r">
                <i class="el-icon-document-remove" style="margin-right:6px;font-size: 16px"></i>
                <span>{{item.name}}</span> 
              </span>
              <div class="show-flex-box-r">
                <el-button type="text" style="padding:0" @click="downloadDocument(item)">下载</el-button>
                <el-button type="text" style="padding:0" @click="deleteDocument(item,index)">删除</el-button>
              </div>
            </li>
          </ul>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import { getVehicleAge } from '@/utils/index'
export default {
  components: {},
  props: {
  },
  mounted() {
  },
  data() {
    return {
      certificate:[],
      form: {
        buy_date: '',
        bus_old: '',
        start_insurance: '',
        end_insurance: '',
        last_maintain: '',
        last_maintain_mile: '',
        last_check: '',
        cretificate: '',
        certificate_date: '',
        chassis_number: '',
        engine_number: '',
        bus_color: '',
        kind: '',
        img_list: [],
        file_list: [],
      },
      img_index: 0,
      basicRules: {
        buy_date: [
          { required: true, message: "请选择车辆购置日期", trigger: "change" },
        ],
        bus_old: [
          { required: true, message: "请输入车龄", trigger: "change" },
        ],
        start_insurance: [
          { required: true, message: "请选择保险开始日期", trigger: "change" },
        ],
        end_insurance: [
          { required: true, message: "请选择保险到期日期", trigger: "change" },
        ],
        last_maintain: [
          { required: true, message: "请选择上次保养日期", trigger: "change" },
        ],
        last_maintain_mile: [
          { required: true, message: "请选择上次保养里程", trigger: "change" },
        ],
        last_check: [
          { required: true, message: "请选择上次年审日期", trigger: "change" },
        ]
      },
      isShow: false,
    };
  },
  watch: {
  },
  methods: {
    // 初始化数据
    resetData(){
      Object.assign(this.$data.form, this.$options.data().form);
    },
    dateChange() {
      this.form.bus_old = getVehicleAge(this.form.buy_date)
    },
    changeCarousel(val) { 
      this.img_index = val
    },
    // 显示备注
    showRemark() {
      if (this.form.img_list.length > 0) {
        this.isShow = !this.isShow
      }
    },
    // 删除 备注
    removeRemark() {
      this.img_index[this.img_index].remark = ""
    },
    // 数据回显
    setData(val){
      Object.keys(this.form).forEach(key => {
        if (val.hasOwnProperty(key)) {
          this.form[key] = val[key]
        }
      })
      this.form.img_list = this.form.img_list ? this.form.img_list : []
      this.form.file_list = this.form.file_list ? this.form.file_list : []
    },
    // 删除 车辆证件照片
    deleteImg() {
      this.form.img_list.splice(this.img_index, 1)
      this.img_index --
    },
    // 合并表单值
    outData() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            resolve({
              form: this.form
            });
          } else {
            reject({
              msg: '获取失败,带星号的为必填项',
              type: 2
            });
            return false;
          }
        });
      });
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
        if(!this.beforeUpload(file)) {
          return
        }
        reader.onload = (ev) => {
          input = undefined;
        };
        let formData = new FormData();
        formData.append("file", file);
        let params = {
          file: formData,
        };
        this.$client.uploadPictureMeetingRoom(params)
        .then(res => {
          if(res.head.result == '200') {
            // this.form.img_url = res.context;
            let params = {
              file_url: res.context,
              remark: ''
            }
            this.form.img_list.push(params)
            setTimeout(() => {
              this.$refs.carousel.setActiveItem(this.form.img_list.length - 1)
            }, 100);
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
    },
    // 判断文件大小
    beforeUpload (file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({type: 'error', message: '请不要上传大小超过1M的文件', showClose: true})
      return false
    },
    // 判断文件大小
    beforeFileUpload (file) {
      const isLt1M = file.size / 1024 / 1024 < 20
      if (isLt1M) {
        return true
      }
      this.$message({type: 'error', message: '请不要上传大小超过20M的文件', showClose: true})
      return false
    },
    // 判断文件类型
    beforeUploadFileType(file) {
      let acceptType = '.rar,.zip,.doc,.docx,.pdf'
      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1)
      if(acceptType.indexOf(fileSuffix) === -1) {
        this.$message({type: 'warning', message: `只能上传${acceptType}类型的文件`, showClose: true})
        return false
      }else{
        return true
      }
    },
    // 上传资料
    handlePreview(file) {
      if( this.form.file_list.length > 4) {
         this.$message({type: 'warning', message: '最多只能上传五个文件', showClose: true})
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

      let params = {
        file: formData,
      };
      let fileName = file.name;
      this.$client.AddTxtfileUpload(params).then(res => {
        if(res.head.result == "200") {
          let fileObj = {
            name: fileName,
            file_url: res.context,
            size: file.size
          }
          this.form.file_list.push(fileObj)
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
    },
    // 下载文件
    downloadDocument(item) {
      // console.log(item)
      window.location.href = item.file_url
      this.$message({type: 'success', message: '下载成功'})
    },
    // 删除文件
    deleteDocument(item,index) {
      this.form.file_list.splice(index, 1)
      // this.$refs.uploadDocomnet.uploadFiles.splice(index, 1)
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.vehicle-archives {
  .carousel-box { 
    display:flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #000;
    padding: 10px 0;
    .carousel-button {
      padding: 0 10px;
      font-size:16px;
      font-weight:bold;
      cursor: pointer;
      &:hover {
        color: #409eff
      }
    }
  }
  .remarks {
    display: flex;
    align-items: center;
    border: 1px solid #000;
    border-top: none;
    .remarks-text {
      flex: 1;
      border: none;
      /deep/ .el-input__inner {
        border: none !important;
      }
    }
    .remarks-button {
      color: red;
      width: 50px;
      text-align: center;
      cursor: pointer;
    }
   }
}
</style>

