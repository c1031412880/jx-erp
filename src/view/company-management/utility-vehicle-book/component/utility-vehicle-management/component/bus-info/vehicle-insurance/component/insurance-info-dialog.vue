<template>
  <el-dialog
    :visible="dialogBool"
    :title="title + '保险信息'"
    :before-close="dialogClose"
    width="760px"
    
    append-to-body
    class="insurance-info-dialog"
  >
    <div class="el-dialog-div">
      <el-form ref="form" size="mini" :model="form" :rules="rules" label-width="120px" label-suffix=":">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="车牌号" prop="bus_code">
              <el-input v-model="form.bus_code" style="width:100%" disabled placeholder="请输入车牌号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保险单号" prop="insurance_code">
              <el-input v-model="form.insurance_code" style="width:100%" :disabled="disabled" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保险种类:" prop="type">
              <get-select-dictionaries  style="width:100%" :disabled="disabled" v-model="form.type" :classKey="'保险类型'" placeholder="请选择保险种类"></get-select-dictionaries>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保险公司:" prop="company">
             <get-select-dictionaries  style="width:100%" :disabled="disabled" v-model="form.company" :classKey="'保险公司'" placeholder="请选择保险公司"></get-select-dictionaries>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投保日期" prop="insurance_start">
              <el-date-picker
                @change="changeStart"
                :disabled="disabled"
                style="width:100%"
                v-model="form.insurance_start"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保险到期日期" prop="insurance_end">
              <el-date-picker
                :disabled="disabled"
                style="width:100%"
                v-model="form.insurance_end"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投保金额" prop="insure_fee">
              <el-input-number v-model="form.insure_fee" style="width:100%" :disabled="disabled"  :min="0" :precision="2" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实付金额" prop="actual_fee">
              <el-input-number v-model="form.actual_fee" style="width:100%" :disabled="disabled"  :min="0" :precision="2" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" style="width:100%" :disabled="disabled" type="textarea" :rows="4" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row style="margin-bottom:15px">
          <el-col :span="24" style="display:flex;align-items:center;padding-bottom:10px">
            <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div>
            <p style="margin-left:5px;color:#000;font-size:14px;">保险相关图片</p>
          </el-col>
          <template v-for="(item,index) in form.img_list" >
            <el-col :span="8" :key="index" class="image-box">
              <el-image fit="fill" :src="item" style="width:100%;height:100%"></el-image>
              <div class="box">
                <i class="el-icon-delete" @click="imageDelete(index)"></i>
              </div>
            </el-col>
          </template>
          <el-col :span="8" v-if="form.img_list.length < 3 && !disabled" style="height:180px;border:1px dashed #409EFF">
            <div style="height:100%;padding-top:50px;text-align:center;">
              <el-button type="primary" @click="uploadFile">选择图片</el-button>
              <p style="padding-top:20px">仅支持上传jpg/png格式文件</p>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="display:flex;align-items:center;padding-bottom:10px;justify-content: space-between;">
            <div style="display:flex;align-items:center;width:150px;">
              <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div>
              <p style="margin-left:5px;color:#000;font-size:14px;">保险相关资料</p>
            </div>
            <el-upload
              v-if="!disabled"
              class="upload-demo"
              ref="uploadDocomnet"
              action="string"
              :on-change="handlePreview"
              accept=".rar,.zip,.doc,.docx,.pdf "
              :show-file-list="false"
              :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary" class="el-icon-upload">选择文件</el-button>
            </el-upload>
          </el-col>
          <el-col :span="24">
            <div class="el-upload__tip" style="padding-bottom:15px;">支持格式：.rar .zip .doc .docx .pdf ，单个文件不能超过20MB，最多只能保存5个文件</div>
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
        </el-row> -->
        <el-row>
          <image-file-upload
            :images="form.img_list"
            :files="form.file_list"
            :maxUpLoadSize="100"
            :isPreview="false"
            @files-update-success="filesUpdateSuccess"
            @images-update-success="imagesUpdateSuccess"></image-file-upload>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer" v-if="!disabled">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" size="mini" @click="submit()">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import imageFileUpload from "@/components/imageFileUpload/index";
import {formatDate,getDate} from "@/utils/index"
export default {
  components: {
    imageFileUpload,
    getSelectDictionaries
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
    disabled: Boolean,
    bus_code: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      cycleData:[
        {value: 1, label: "半年一次"},
        {value: 2, label: "一年一次"},
        {value: 3, label: "两年一次"},
        {value: 4, label: "三年一次"},
      ],
      form: {
        id: 0,
        bus_code: "",
        insurance_code: "",
        type: "",
        company: "",
        insurance_start: "",
        insurance_end: "",
        insure_fee: "",
        actual_fee: "",
        remark: "",
        img_list: [],
        file_list: []
      },
      rules: {
        bus_code: [
          {
            required: true,
            message: "请输入车牌号",
            trigger: "change",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择保险种类",
            trigger: "change",
          },
        ],
        company: [
          {
            required: true,
            message: "请选择保险公司",
            trigger: "change",
          },
        ],
        insurance_start: [
          {
            required: true,
            message: "请选择投保日期",
            trigger: "change",
          },
        ],
        insurance_end: [
          {
            required: true,
            message: "请选择保险到期日期",
            trigger: "change",
          },
        ],
        insure_fee: [
          {
            required: true,
            message: "请输入投保金额",
            trigger: "change",
          },
        ],
      }
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data.form, this.$options.data().form);
        this.resetFrom();
      }else{
        this.$nextTick( () => {
          this.$refs["form"].resetFields();
        })
      }
    },
  },
  mounted() {
    this.form.insurance_start = formatDate(new Date(),"yyyy-MM-dd")
    this.form.bus_code = this.bus_code
    this.changeStart()
  },
  methods: {
    // 重置
    resetFrom() {

    },
    // 获取保险到期日期
    changeStart() {
      let year = new Date(this.form.insurance_start).getFullYear() + 1
      let month = new Date(this.form.insurance_start).getMonth() + 1
      let day = new Date(this.form.insurance_start).getDate()
      this.form.insurance_end = year + "-" + month + "-" + day
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 数据回显
    setData(val){
      Object.keys(this.form).forEach(key => {
        if (val.hasOwnProperty(key)) {
          this.form[key] = val[key]
        }
      })
    },
    // 保存
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit("on-ok",this.form,this.curSelecedType)
        } else {
          reject({
            msg: '获取失败,带星号的为必填项'
          });
          return false;
        }
      });
    },
    // 上传图片
    imagesUpdateSuccess(val) {
      let url = '';let list = [];val.forEach(item => {url = item.url ? item.url : item;list.push(url);});this.form.img_list = list
    },
    // 上传文件
    filesUpdateSuccess(filesList) {
      this.form.file_list = filesList;
      // console.log(this.form, filesList);
    },
    // 自定义上传文件方法
    // :http-request="uploadFile"
    uploadFile() {
      let input = document.createElement("input");
      input.type = "file";
      // input.accept = "image/*";
      input.accept = ".jpg,.png";
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
            this.form.img_list.push(res.context)
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
      this.$message({type: 'error', message: '请不要上传大小超过10M的文件', showClose: true})
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
            url: res.context,
            size:file.size
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
      window.location.href = item.url
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
.insurance-info-dialog {
  .image-box {
    height:180px;
    position: relative;
  }
  .image-box:hover {
    .box {
      display: block;
      background-color: rgba(0,0,0,0.3);
    }
  }
  .box {
    display: none;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
    line-height: 180px;
    i {
      font-size: 18px;
      cursor: pointer;
      color: red;
    }
  }
}
</style>

