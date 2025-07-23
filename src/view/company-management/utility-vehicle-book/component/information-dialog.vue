<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="700px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <el-form-item label="车辆别名:" prop="name">
          <el-input v-model="form.name" placeholder="请输入车辆别名" :disabled="curSelecedType == 'detail'"></el-input>
        </el-form-item>
        <el-form-item label="公车车型:" prop="kind">
          <el-input v-model="form.kind" placeholder="请输入公车车型" :disabled="curSelecedType == 'detail'"></el-input>
        </el-form-item>
        <el-form-item label="车牌号:" prop="code">
          <el-input v-model="form.code" placeholder="请输入车牌号" :disabled="curSelecedType == 'detail'"></el-input>
        </el-form-item>
        <el-form-item label="车辆容量:" prop="max_count">
          <el-input v-model="form.max_count" placeholder="请输入车辆容量" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.max_count = $event.target.value" :disabled="curSelecedType == 'detail'"></el-input>
        </el-form-item>
        <el-form-item label="车辆停放位置:" prop="last_position">
          <el-input v-model="form.last_position" placeholder="请输入车辆停放位置" :disabled="curSelecedType == 'detail'"></el-input>
        </el-form-item>
        <el-form-item label="管理员:" prop="duty_id">
          <get-department-select
              ref="dutyPersonalTree"
              v-model="form.duty_id"
              :width="'420'"
              :show_all="true"
              :isShowCheckbox="false"
              :placeholder="'请选择会管理员'"
              :isContainEmp="true"
              :isExportMultiple="false"
              :disabled="curSelecedType == 'detail'"
            ></get-department-select>
        </el-form-item>
        <el-form-item label="管理员电话:" prop="duty_phone">
          <el-input v-model="form.duty_phone" placeholder="请输入管理员联系电话" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.duty_phone = $event.target.value" :disabled="curSelecedType == 'detail'"></el-input>
        </el-form-item>
        <el-form-item label="里程/km:" prop="last_mile">
          <el-input v-model="form.last_mile" placeholder="请输入里程/km" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.last_mile = $event.target.value" :disabled="curSelecedType == 'detail'"></el-input>
        </el-form-item>
        <el-form-item label="加油类型:" prop="oil_kind">
            <tr-select-dictionaries v-model="form.oil_kind" :classKey="'公车加油类型'" :placeholder="'请选择加油类型'" :isMultiple="false" :disabled="curSelecedType == 'detail'"></tr-select-dictionaries>
        </el-form-item>
        <el-form-item label="车架号:" prop="chassis_number" v-if="false">
          <el-input v-model="form.chassis_number" placeholder="请输入车架号" :disabled="curSelecedType == 'detail'"></el-input>
        </el-form-item>
        <el-form-item label="发动机号:" prop="engine_number" v-if="false">
          <el-input v-model="form.engine_number" placeholder="请输入发动机号" :disabled="curSelecedType == 'detail'"></el-input>
        </el-form-item>

        <el-form-item label="购置日期:" prop="buy_date" v-if="false">
          <el-date-picker
              v-model="form.buy_date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="年-月-日"
              :disabled="curSelecedType == 'detail'"
            >
            </el-date-picker>
        </el-form-item>
        <el-form-item label="上次年检时间:" prop="last_check" v-if="false">
          <el-date-picker
              v-model="form.last_check"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="年-月-日"
              :disabled="curSelecedType == 'detail'"
            >
            </el-date-picker>
        </el-form-item>
        <el-form-item label="上次保养时间:" prop="last_maintain" v-if="false">
          <el-date-picker
              v-model="form.last_maintain"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="年-月-日"
              :disabled="curSelecedType == 'detail'"
            >
            </el-date-picker>
        </el-form-item>
    
        <el-form-item label="是否需要审批:" prop="is_audit" v-if="false">
          <el-select v-model="form.is_audit" placeholder="请选择是否需要审批" :disabled="curSelecedType == 'detail'">
            <el-option
              v-for="item in conditionOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批人:" prop="audit_person" v-if="form.is_audit">
          <get-department-select
            ref="personalTree"
            v-model="form.audit_person"
            :width="'420'"
            :show_all="true"
            :isShowCheckbox="false"
            :placeholder="'请选择审批人'"
            :isContainEmp="true"
            :isExportMultiple="false"
            :disabled="curSelecedType == 'detail'"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="车辆图片:" prop="img_url" v-if="false">
          <div class="show-flex-box-r" style="align-items: center;">
            <el-button size="small" type="primary" @click="uploadFile" :disabled="curSelecedType == 'detail'">{{!!form.img_url?'更换图片':'上传图片'}}</el-button>
            <el-image
              v-if="!!form.img_url"
              style="width: 60px; margin-left: 10px;"
              :src="form.img_url"
              fit="contain"
              :preview-src-list="[form.img_url]"></el-image>
              <span style="font-size: 12px;color: #606266; margin-left:20px;">上传的图片尺寸建议不超过1M</span>
          </div>
        </el-form-item>
        <el-form-item label="上传附件:" prop="files" v-if="false">
          <div>
            <el-upload
              class="upload-demo"
              ref="uploadDocomnet"
              action="string"
              :on-change="handlePreview"
              :on-remove="handleRemove"
              accept=".rar,.zip,.doc,.docx,.pdf "
              :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary" class="el-icon-upload" :disabled="curSelecedType == 'detail'">上传文件</el-button>
              <div slot="tip" class="el-upload__tip">支持格式：.rar .zip .doc .docx .pdf ，单个文件不能超过20MB，最多只能保存5个文件</div>
            </el-upload>
            <ul class="document-content show-flex-box-c" v-loading="accidentDataDocumentLoading">
              <li class="show-flex-box-r" style="margin-bottom:10px;" v-for="(item,index) in form.files" :key="index">
                <span class="show-flex-box-r">
                  <i class="el-icon-document-remove" style="margin-right:6px;"></i>
                  <span>{{item.name}}</span> 
                  </span>
                <strong class="show-flex-box-r">
                  <el-button type="text" @click="downloadDocument(item)">下载</el-button
                  >
                  <el-button type="text" :disabled="curSelecedType == 'detail'" @click="deleteDocument(item,index)">删除</el-button>
                
                </strong>
              </li>
            </ul>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer" v-if="curSelecedType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import {getUser} from '@/utils/auth'
export default {
  components: {getDepartmentSelect},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: {
      type: String,
      default: "detail",
    },
  },
  mounted() {
  },
  data() {
    return {
      date: [],
      conditionOptions:[ //
        { value: 0, name: "无需审批" },
        { value: 1, name: "需要审批" }
      ],
      form: {
        id: "",
        kind:"",
        name: "",
        code: "",
        max_count: "",
        last_position:'',

        duty_id: "",
        duty_phone: "",
        last_mile:"",
        oil_kind:"",
        ex_equipment_ids:[],
        chassis_number:"",
        engine_number:"",
        buy_date:"",
        last_check:"",
        last_maintain:"",
        is_audit: 0, //1是0否
        audit_person: "",
        img_url: "",
        files:[],
      },
      basicRules: {
        kind: [
          { required: true, message: "请输入公车车型", trigger: "change" },
        ],
        name: [
          { required: true, message: "请输入车辆别名", trigger: "change" },
        ],
        code: [
          { required: true, message: "请输入车牌号", trigger: "change" },
        ],
        max_count: [
          { required: true, message: "请输入车辆容量", trigger: "change" },
        ],
        last_position: [
          { required: true, message: "请输入车辆停放位置", trigger: "change" },
        ],
        // duty_id: [
        //   { required: true, message: "请选择管理员", trigger: "change" },
        // ],
        // duty_phone: [
        //   { required: true, message: "请输入联系人电话", trigger: "change" },
        // ],
        last_mile: [
          { required: true, message: "请输入里程/km", trigger: "change" },
        ],
        oil_kind: [
          { required: true, message: "请选择加油类型", trigger: "change" },
        ],
        last_check: [
          { required: true, message: "请选择上次年检时间", trigger: "change" },
        ],
        last_maintain: [
          { required: true, message: "请选择上次保养时间", trigger: "change" },
        ],
        is_audit: [
          { required: true, message: "请选择是否需要审批", trigger: "change" },
        ],
        audit_person: [
          { required: true, message: "请选择审批人", trigger: "change" },
        ],
      },
      accidentDataDocumentLoading: false,
      fileLists:[],
      limitNum: 5,
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.resetFrom();
      }else{
        // 添加自动载入当前用户为审批人
        if(this.curSelecedType == 'add') {
          let userInfo = JSON.parse(getUser());
          this.form.audit_person = Number(userInfo.user_id)
        }
        if (this.curSelecedType == 'detail') {
          setTimeout(() => {
            this.$refs.form.clearValidate();
          }, 100);
        }
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 重置
    resetFrom() {
      this.$refs.dutyPersonalTree.onClear()
      if(this.form.is_audit) {
        this.$refs.personalTree.onClear()
      }

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
            this.form.img_url = res.context;
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
      const isLt1M = file.size / 1024 / 1024 < 10
      if (isLt1M) {
        return true
      }
      this.$message({type: 'error', message: '请不要上传大小超过10M的文件', showClose: true})
      return false
    },
    // 上传事关资料
    handlePreview(file) {
      if( this.form.files.length > 4) {
         this.$message({type: 'warning', message: '最多只能上传五个文件', showClose: true})
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

      let params = {
        file: formData,
      };
      let fileName = file.name;
      this.$client.AddTxtfileUpload(params).then(res => {
        if(res.head.result == "200") {
          let fileObj = {
            name: fileName,
            file_url: res.context
          }
          this.form.files.push(fileObj)
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
    // 删除事故相关资料
    handleRemove(file, fileList){
      console.log(file, fileList)
      // this.$emit('on-reset')
    },
    // 下载文件
    downloadDocument(item) {
      // console.log(item)
      window.location.href = item.file_url
      this.$message({type: 'success', message: '下载成功'})
    },
    // 删除文件
    deleteDocument(item,index) {
      this.fileDocumentIndex = index;
       this.form.files.splice(index, 1)
      // this.$refs.uploadDocomnet.uploadFiles.splice(index, 1)
    },
   
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          // if(this.form)


          // console.log(info)
          // return

          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div{
   height: 450px;
  // overflow-y: scroll;
}
.el-dialog-div /deep/ .el-input {
  width: 480px;
}

.document-content{
  padding: 5px 4px 40px;
  
  // width: 100%;
  >li{
    width: 60%;
    // padding: 8px 0;
    justify-content: space-between;
    align-items: center;
    border-bottom: 3px solid #19be6b;
  }
}
.el-dialog-div /deep/ .el-upload-list{
  display: none
}
</style>

